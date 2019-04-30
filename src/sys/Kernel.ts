import { Logger } from "sys/Logger";
import {
  ProgramImage,
  ProgramInit,
  programRegistry,
  ProgramRun,
  Programs,
  ProgramSignalHandlers
} from "sys/Registry";
import { scheduler } from "sys/Scheduler";

export type PID = number;

export const enum ProcessState {
  RUNNABLE,
  SLEEPING,
  ZOMBIE
}

export type ProcessDescriptor = {
  readonly pid: PID;
  ppid: PID;
  readonly image: ProgramImage;
  status: ProcessStatus;
};

export type ProcessStatus =
  | { state: ProcessState.RUNNABLE }
  | { state: ProcessState.SLEEPING; duration?: number }
  | { state: ProcessState.ZOMBIE; status: number };

export type Signals = {
  SIGCHLD: { pid: PID };
};

export type Signal<S extends keyof Signals> = Signals[S] & {
  kind: S;
};

// Terminate process
export function exit(status: number): ProcessStatus {
  return { state: ProcessState.ZOMBIE, status };
}

export function awaken(): ProcessStatus {
  return { state: ProcessState.RUNNABLE };
}

// Sleep until awoken by child termination
export function wait(): ProcessStatus {
  return { state: ProcessState.SLEEPING };
}

// Sleep for duration ticks
export function sleep(duration: number): ProcessStatus {
  return { state: ProcessState.SLEEPING, duration };
}

export function spawn<I extends ProgramImage>(
  image: I,
  ...args: Parameters<Programs[I]["init"]>
): PID {
  return kernel.startProcess(image, ...args);
}

function justRespawned() {
  if (Object.values(Game.spawns).length != 1) {
    return false;
  }
  const spawn = Object.values(Game.spawns)[0];
  const creeps = Object.values(Game.creeps);
  return (
    spawn.room.controller!.safeMode === 19999 &&
    _.all(creeps, (c) => c.spawning)
  );
}

const defaultSignalHandlers: ProgramSignalHandlers<any> = {
  SIGCHLD: () => {}
};

class Kernel {
  get processTable(): { [pid in PID]: ProcessDescriptor } {
    return Memory.processTable;
  }

  private get memoryPages(): { [pid in PID]: any } {
    return Memory.memoryPages;
  }

  private get signals(): { [pid in PID]: Array<Signal<keyof Signals>> } {
    return Memory.signals;
  }

  private lastPid: number = 0;
  private _currentPid: number = 0;
  private logger = new Logger("Kernel");

  public get currentPid(): number {
    return this._currentPid;
  }

  constructor() {
    if (justRespawned()) {
      Memory.memoryPages = {};
      Memory.processTable = {};
      Memory.signals = {};
      this.startProcess("init");
    } else {
      const descriptors = Object.values(this.processTable);
      this.lastPid = Math.max(0, ...descriptors.map((p) => p.pid));
    }
  }

  public startProcess<I extends ProgramImage>(
    image: I,
    ...args: Parameters<Programs[I]["init"]>
  ): PID {
    const pid = this.lastPid + 1;
    const init: ProgramInit<any, any> = programRegistry.getInit(image) as any;

    if (init === undefined) {
      throw `Could not start process for ${image}`;
    }

    const descriptor: ProcessDescriptor = {
      pid,
      image,
      ppid: this.currentPid,
      status: { state: ProcessState.RUNNABLE }
    };
    const memory = init(...args);
    this.lastPid = pid;
    this.processTable[pid] = descriptor;
    this.memoryPages[pid] = memory;
    this.logger.info(`Started ${image} process with ${pid}`);
    return descriptor.pid;
  }

  private runProcess(pid: PID) {
    const process = this.processTable[pid];

    if (process === undefined) {
      this.logger.error(`Trying to execute unknown process ${pid}.`);
      return;
    }

    const { image, ppid } = process;
    const memory = this.memoryPages[pid];

    // Handle pending signals
    if (this.signals[pid] !== undefined) {
      let s = this.signals[pid].shift();
      while (s !== undefined) {
        const signalHandler =
          programRegistry.getSignalHandler(image, s.kind) ||
          defaultSignalHandlers[s.kind];
        signalHandler(s, memory);
        if (s.kind === "SIGCHLD") {
          delete this.processTable[s.pid];
          delete this.memoryPages[s.pid];
        }
        s = this.signals[pid].shift();
      }
      delete this.signals[pid];
    }

    // Handle running the process
    const program: ProgramRun<any> = programRegistry.getRun(image);
    if (program === undefined) {
      this.logger.error(
        `Trying to execute unknown program ${image} for ${pid}.`
      );
      return;
    }

    const result = program(memory);
    this.processTable[pid].status = result;

    // Signal if zombie
    if (result.state === ProcessState.ZOMBIE) {
      Object.values(this.processTable).forEach((descriptor) => {
        if (descriptor.ppid === pid) {
          // TODO Set to init instead of kernel.
          descriptor.ppid = 0;
        }
      });
      // TODO We should not need this check.
      if (ppid === 0) {
        delete this.processTable[pid];
        delete this.memoryPages[pid];
      } else {
        if (this.signals[ppid] === undefined) {
          this.signals[ppid] = [];
        }
        this.signals[ppid].push({ kind: "SIGCHLD", pid });
        this.processTable[ppid].status = awaken();
      }
    }
  }

  public loop() {
    Object.values(this.processTable).forEach((descriptor) => {
      const { status } = descriptor;
      if (status.state === ProcessState.SLEEPING) {
        const { duration } = status;
        if (duration !== undefined) {
          if (duration === 0) {
            descriptor.status = awaken();
          } else {
            status.duration = duration - 1;
          }
        }
      }
    });
    this._currentPid = 0;
    const scheduledProcesses = scheduler.run();
    let next = scheduledProcesses.next();
    while (!next.done) {
      const pid = next.value;
      this._currentPid = pid;
      const start = Game.cpu.getUsed();
      this.runProcess(pid);
      const used = Game.cpu.getUsed() - start;
      next = scheduledProcesses.next(used);
    }
  }
}

export const kernel = new Kernel();
