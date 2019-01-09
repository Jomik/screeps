import { Kernel } from "sys/Kernel";
import { Scheduler } from "sys/Scheduler";
import { programRegistry } from "sys/Registry";

const scheduler = new Scheduler();
const kernel = new Kernel(scheduler);

(global as any).kernel = kernel;
(global as any).pr = programRegistry;

export function loop() {
  kernel.loop();
};
