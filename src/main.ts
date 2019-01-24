import { Kernel } from "sys/Kernel";
import { Scheduler } from "sys/Scheduler";
import { programRegistry } from "sys/Registry";
import * as bin from "bin";

const scheduler = new Scheduler();
const kernel = new Kernel(scheduler);

(global as any).kernel = kernel;
(global as any).pr = programRegistry;

bin.register(programRegistry);
export function loop() {
  kernel.loop();
}
