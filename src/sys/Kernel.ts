import { Scheduler } from "sys/Scheduler";
import { Logger } from "sys/Logger";
import {
  programRegistry,
  ProgramImage,
  Program,
  ProgramInit,
  Programs
} from "sys/Registry";

export type PID = string;

export type ProcessDescriptor = {
  readonly pid: PID;
  readonly parentPid?: PID;
  readonly image: ProgramImage;
};

export type ProcessContext<M> = {
  readonly logger: Logger;
  state: M;
};

export type Process<M> = {
  descriptor: ProcessDescriptor;
  context: ProcessContext<M>;
};

const logger = new Logger("Kernel");

export class Kernel {
  private processTable: { [pid in PID]: Process<any> } = {};
  private lastPid: number = 0;

  constructor(private readonly scheduler: Scheduler) {}

  public startProcess<I extends ProgramImage>(
    image: I,
    parentPid?: PID,
    ...args: Parameters<Programs[I]["init"]>
  ) {
    const pid = this.lastPid + 1;
    const init: ProgramInit<any, any> = programRegistry.getInit(image) as any;
    if (init !== undefined) {
      const descriptor = { pid: pid.toString(), parentPid, image };
      const context = {
        state: init(...args),
        logger: new Logger(`P${pid}@${image}`)
      };
      this.lastPid = pid;
      this.processTable[pid] = { context, descriptor };
      logger.info(`Started process for ${image} with ${pid}`);
      return true;
    }

    logger.warn(`Could not start process for ${image}`);
    return false;
  }

  private runProcess(pid: PID) {
    const process = this.processTable[pid];
    if (process === undefined) {
      logger.error(`Trying to execute unknown process ${pid}.`);
      return;
    }
    const {
      descriptor: { image },
      context
    } = process;
    const program: Program<any> = programRegistry.getProgram(image);
    if (program === undefined) {
      logger.error(`Trying to execute unknown program ${image} for ${pid}.`);
      return;
    }
    const result = program(context);
    if (result.exit) {
      logger.info(
        `Program ${image} for ${pid} exited with code ${result.status}`
      );
      delete this.processTable[pid];
    }
  }

  public loop() {
    const scheduledProcesses = this.scheduler.run(this.processTable);
    let next = scheduledProcesses.next();
    while (!next.done) {
      const pid = next.value;
      const start = Game.cpu.getUsed();
      this.runProcess(pid);
      const used = Game.cpu.getUsed() - start;
      next = scheduledProcesses.next(used);
    }
  }
}
