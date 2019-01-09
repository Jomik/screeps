import { Logger } from "sys/Logger";
import { Image } from "sys/Registry";

export type PID = number;

export type ProcessDescriptor = {
  readonly pid: PID;
  readonly parentPid?: PID;
  readonly image: Image;
};

export type ProcessContext<M> = {
  readonly logger: Logger;
  memory: M;
};

export type Process<M> = {
  descriptor: ProcessDescriptor;
  context: ProcessContext<M>;
}

