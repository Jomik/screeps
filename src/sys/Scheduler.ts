import { PID, kernel, ProcessState } from "sys/Kernel";

interface Scheduler {
  run(): Iterator<PID>;
}

class SimpleScheduler implements Scheduler {
  private get processes() {
    return kernel.processTable;
  }
  constructor() {}

  public *run(): Iterator<PID> {
    for (const { pid, status } of Object.values(this.processes)) {
      if (status.state === ProcessState.RUNNABLE) {
        yield pid;
      }
    }
  }
}

export const scheduler = new SimpleScheduler();
