import { kernel } from "sys/Kernel";
import { programRegistry } from "sys/Registry";
import { scheduler } from "sys/Scheduler";
import { ErrorMapper } from "utils";

(global as any).kernel = kernel;
(global as any).scheduler = scheduler;
(global as any).pr = programRegistry;

export const loop = ErrorMapper.wrapLoop(() => {
  kernel.loop();
});
