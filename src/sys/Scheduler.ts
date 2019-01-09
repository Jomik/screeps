import { PID, Process } from "./Process";

export class Scheduler {
  public *run(processTable: Map<PID, Process<any>>): Iterator<PID> {
    const queue = processTable.keys();
    for (const pid of queue) {
      yield pid;
    }
  }
}
