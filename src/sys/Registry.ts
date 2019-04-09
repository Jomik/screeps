import { ProcessContext } from "sys/Kernel";
import { programs } from "bin";

export type Programs = typeof programs;

export type ProgramImage = keyof Programs;
export type ProgramStatus = { exit: true; status: number } | { exit: false };
export type Program<M> = (context: ProcessContext<M>) => ProgramStatus;

export type ProgramInit<A extends any[], M> = (...args: A) => M;
export type ProgramDefinition<A extends any[], M> = {
  program: Program<M>;
  init: ProgramInit<A, M>;
};
export type ProgramDescriptor<M> = { program: Program<M>; memory: M };

export class ProgramRegistry {
  private registry: Programs = programs;

  public registerProgram<I extends ProgramImage>(
    image: I,
    program: Programs[I]["program"],
    init: Programs[I]["init"]
  ) {
    this.registry[image] = { program, init } as Programs[I];
  }

  public getProgram<I extends ProgramImage>(image: I): Programs[I]["program"] {
    return this.registry[image].program;
  }

  public getInit<I extends ProgramImage>(image: I): Programs[I]["init"] {
    return this.registry[image].init;
  }
}

export const programRegistry = new ProgramRegistry();

