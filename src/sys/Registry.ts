import { Logger } from "sys/Logger";
import { ProcessContext } from "sys/Kernel";
import { Programs } from "bin";

export type ProgramImage = keyof Programs;

export type ProgramStatus = { done: true; status: number } | { done: false };
export type Program<M> =
  (context: ProcessContext<M>) => ProgramStatus;
export type ProgramInit<A extends any[], M> = (...args: A) => M;
export type ProgramDescriptor<A extends any[], M> = {
  program: Program<M>;
  init: ProgramInit<A, M>;
};

const logger = new Logger("Registry");

class ProgramRegistry {
  private registry: Programs = {} as any;

  public register<I extends ProgramImage>(image: I, program: Programs[I]["program"], init: Programs[I]["init"]): boolean {
    this.registry[image] = { program, init } as any;
    return true;
  }

  public getProgram<I extends ProgramImage>(image: I): Programs[I]["program"] {
    return this.registry[image].program;
  }

  public getInit<I extends ProgramImage>(image: I): Programs[I]["init"] {
    return this.registry[image].init;
  }
}

export const programRegistry = new ProgramRegistry();
