import { Kernel } from "sys/Kernel";
import { Scheduler } from "sys/Scheduler";
import { programRegistry } from "sys/Registry";
import { register } from "bin";

const scheduler = new Scheduler();
const kernel = new Kernel(scheduler);

(global as any).kernel = kernel;
(global as any).pr = programRegistry;

register();

export function loop() {
  kernel.loop();
};
