import { Logger } from "sys/Logger";
import { ProcessContext } from "sys/Kernel";

export type ProgramImage = keyof Programs;
export type ProgramStatus = { exit: true; status: number } | { exit: false };
export type Program<S> = (context: ProcessContext<S>) => ProgramStatus;

export type ProgramInit<A extends any[], S> = (...args: A) => S;
export type ProgramDefinition<A extends any[], S> = {
  program: Program<S>;
  init: ProgramInit<A, S>;
};
export type ProgramDescriptor<S> = { program: Program<S>; state: S };

export type Programs = {
  ["hello-world"]: ProgramDefinition<[], {}>;
  ["move-creep"]: ProgramDefinition<
    [Creep, RoomPosition],
    { id: string; pos: RoomPosition }
  >;
  ["harvest"]: ProgramDefinition<
    [Creep, Source],
    { creepId: string; sourceId: string }
  >;
  ["spawn-creep"]: ProgramDefinition<
    [StructureSpawn, BodyPartConstant[], string],
    {
      spawnId: string;
      body: BodyPartConstant[];
      name: string;
      didSpawn: boolean;
    }
  >;
};

export class ProgramRegistry {
  private registry: Programs = {} as any;

  public registerProgram<I extends ProgramImage>(
    image: I,
    program: Programs[I]["program"],
    init: Programs[I]["init"]
  ) {
    this.registerPrograms({ [image]: { program, init } });
  }

  public registerPrograms(programs: Partial<Programs>) {
    Object.assign(this.registry, programs);
  }

  public getProgram<I extends ProgramImage>(image: I): Programs[I]["program"] {
    return this.registry[image].program;
  }

  public getInit<I extends ProgramImage>(image: I): Programs[I]["init"] {
    return this.registry[image].init;
  }
}

export const programRegistry = new ProgramRegistry();
