import { PID, Process } from "sys/Kernel";

export class Scheduler {
  public *run(processTable: { [pid: string]: Process<any> }): Iterator<PID> {
    const queue: PID[] = Object.keys(processTable);
    for (const pid of queue) {
      yield pid;
    }
  }
}
