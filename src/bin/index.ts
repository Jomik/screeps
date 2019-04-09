import {
  ProgramStatus,
  ProgramDefinition,
  Program,
  ProgramInit
} from "sys/Registry";

const success: ProgramStatus = { exit: true, status: 0 };
const fail: ProgramStatus = { exit: true, status: 1 };
const wait: ProgramStatus = { exit: false };

function program<A extends any[], M extends object>(
  init: ProgramInit<A, M>,
  program: Program<M>
): ProgramDefinition<A, M> {
  return {
    program,
    init
  };
}

export const programs = {
  ["hello-world"]: program(
    () => ({}),
    () => (console.log("Hello world"), success)
  ),
  ["move-creep"]: program(
    (creep: Creep, pos: RoomPosition) => ({ id: creep.id, pos }),
    ({ memory: { pos } }) => {
      const creep = undefined as any;
      if (creep === null) {
        return fail;
      }
      const result = creep.moveTo(pos);
      if (result === OK || result === ERR_TIRED) {
        return wait;
      }
      return { exit: true, status: result * -1 };
    }
  ),
  ["harvest"]: program(
    (creep: Creep, source: Source) => ({
      creepId: creep.id,
      sourceId: source.id
    }),
    ({ memory: { creepId, sourceId } }) => {
      const creep = Game.getObjectById<Creep>(creepId);
      const source = Game.getObjectById<Source>(sourceId);
      if (creep === null || source === null) {
        return fail;
      }
      const result = creep.harvest(source);
      if (result === OK || result === ERR_TIRED) {
        return wait;
      }
      return { exit: true, status: result * -1 };
    }
  ),
  ["spawn-creep"]: program(
    (spawn: StructureSpawn, body: BodyPartConstant[], name: string) => ({
      spawnId: spawn.id,
      body,
      name,
      didSpawn: false
    }),
    ({ logger, memory: { spawnId, name, body, didSpawn } }) => {
      const spawn = Game.getObjectById<StructureSpawn>(spawnId);
      if (spawn === null) return fail;
      if (spawn.spawning === null) {
        if (didSpawn) {
          logger.info(`Spawned ${name} with id ${Game.creeps[name].id}`);
          return success;
        } else {
          const result = spawn.spawnCreep(body, name);
          if (result === OK) {
            didSpawn = true;
          } else if (result !== ERR_BUSY) {
            return { exit: true, status: result * -1 };
          }
        }
      }
      return wait;
    }
  )
};

