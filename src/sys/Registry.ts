import { programs } from "bin";
import { ProcessStatus, Signals } from "sys/Kernel";

export type Programs = typeof programs;
export type ProgramImage = keyof Programs;

export type ProgramRun<M extends object> = (memory: M) => ProcessStatus;
export type ProgramInit<A extends any[], M extends object> = (...args: A) => M;
export type ProgramSignalHandler<S extends keyof Signals, M extends object> = (
  signal: Signals[S],
  memory: M
) => void;
export type ProgramSignalHandlers<M extends object> = {
  [S in keyof Signals]: ProgramSignalHandler<S, M>
};

export type ProgramDefinition<A extends any[], M extends object> = {
  run: ProgramRun<M>;
  init: ProgramInit<A, M>;
  signalHandlers: Partial<ProgramSignalHandlers<M>>;
};

export class ProgramRegistry {
  private registry: Programs = programs;

  public registerProgram(
    image: ProgramImage,
    run: Programs[typeof image]["run"],
    init: Programs[typeof image]["init"],
    signalHandlers: Programs[typeof image]["signalHandlers"]
  ) {
    this.registry[image] = {
      run,
      init,
      signalHandlers
    } as Programs[typeof image];
  }

  public getRun(image: ProgramImage): Programs[typeof image]["run"] {
    return this.registry[image].run;
  }

  public getInit(image: ProgramImage): Programs[typeof image]["init"] {
    return this.registry[image].init;
  }

  public getSignalHandler(
    image: ProgramImage,
    signal: keyof Signals
  ): Programs[typeof image]["signalHandlers"][typeof signal] {
    return this.registry[image].signalHandlers[signal];
  }
}

export const programRegistry = new ProgramRegistry();

export function program<A extends any[], M extends object>(
  init: ProgramDefinition<A, M>["init"],
  run: ProgramDefinition<A, M>["run"],
  signalHandlers: Partial<ProgramSignalHandlers<M>> = {}
): ProgramDefinition<A, M> {
  return {
    run,
    init,
    signalHandlers
  };
}
