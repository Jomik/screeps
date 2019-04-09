import { PID, Process, ProcessDescriptor } from "sys/Kernel";

export class Scheduler {
  public *run(processList: ProcessDescriptor[]): Iterator<PID> {
    const queue: PID[] = processList.map((p) => p.pid);
    for (const pid of queue) {
      yield pid;
    }
    return 0;
  }
}
