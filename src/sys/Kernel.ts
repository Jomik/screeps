import { PID, Process } from "sys/Process";
import { Scheduler } from "sys/Scheduler";
import { Logger } from "sys/Logger";
import { programRegistry, Image } from "sys/Registry";

const logger = new Logger("Kernel");

export class Kernel {
  private processTable: Map<PID, Process<any>> = new Map();
  private lastPid: number = 0;

  constructor(private readonly scheduler: Scheduler) { }

  public startProcess(image: Image, parentPid?: PID) {
    const pid = this.lastPid + 1;
    const memory = programRegistry.getInitialMemory(image);
    if (memory !== undefined) {
      const descriptor = { pid, parentPid, image };
      const context = { memory, logger: new Logger(`P${pid}@${image}`) };
      this.lastPid = pid;
      this.processTable.set(pid, { context, descriptor });
      logger.info(`Started process for ${image} with P${pid}`);
      return true;
    }

    logger.warn(`Could not start process for ${image}`);
    return false;
  }

  private runProcess(pid: PID) {
    const process = this.processTable.get(pid);
    if (process === undefined) {
      logger.error(`Trying to execute unknown process P${pid}.`);
      return;
    }
    const { descriptor: { image }, context } = process;
    const program = programRegistry.getProgram(image);
    if (program === undefined) {
      logger.error(`Trying to execute unknown program ${image} for P${pid}.`);
      return;
    }
    const result = program(context);
    if (result.done) {
      logger.info(`Program ${image} for P${pid} exited with code ${result.status}`);
      this.processTable.delete(pid);
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
