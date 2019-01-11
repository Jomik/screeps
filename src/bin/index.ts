import { ProgramDescriptor, programRegistry, ProgramStatus } from "sys/Registry";
import { ProcessContext } from "sys/Kernel";

const success: ProgramStatus = { done: true, status: 0 };
const running: ProgramStatus = { done: false };

export interface Programs {
  ["hello-world"]: ProgramDescriptor<[], {}>;
  ["spawn-creep"]: ProgramDescriptor<[string, BodyPartConstant[], string], { spawn: string, body: BodyPartConstant[], name: string, didSpawn: boolean, id?: string }>;
}

export function register() {
  programRegistry.register(
    "hello-world",
    ({ logger }: ProcessContext<{}>) => (logger.info("Hello world!"), success),
    () => ({})
  );
  programRegistry.register(
    "spawn-creep",
    ({ logger, memory }: ProcessContext<{ spawn: string, body: BodyPartConstant[], name: string, didSpawn: boolean }>) => {
      const spawn = Game.getObjectById<StructureSpawn>(memory.spawn);
      if (spawn === null) {
        logger.error(`Invalid spawn ${memory.spawn}`);
        return { done: true, status: 1 } as ProgramStatus;
      }
      if (spawn.spawning === null) {
        if (memory.didSpawn) {
          logger.info(`Spawned ${memory.name} with id ${Game.creeps[memory.name].id}`);
          return success;
        } else {
          const ret = spawn.spawnCreep(memory.body, memory.name);
          if (ret === OK) {
            memory.didSpawn = true;
          } else if (ret !== ERR_BUSY) {
            return { done: true, status: ret } as ProgramStatus;
          }
        }
      }
      return { done: false } as ProgramStatus;
    },
    (spawn: string, body: BodyPartConstant[], name: string) => ({ spawn, body, name, didSpawn: false })
  );
}
