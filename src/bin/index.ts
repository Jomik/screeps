import { ProgramRegistry, ProgramStatus } from "sys/Registry";

const success: ProgramStatus = { exit: true, status: 0 };
const fail: ProgramStatus = { exit: true, status: 1 };
const wait: ProgramStatus = { exit: false };

export function register(registry: ProgramRegistry) {
  registry.registerPrograms({
    ["hello-world"]: {
      program: () => (console.log("Hello world"), success),
      init: () => ({})
    },
    ["move-creep"]: {
      program: ({ memory: { pos } }) => {
        const creep = undefined as any;
        if (creep === null) {
          return fail;
        }
        const result = creep.moveTo(pos);
        if (result === OK || result === ERR_TIRED) {
          return wait;
        }
        return { exit: true, status: result * -1 };
      },
      init: (creep, pos) => ({ id: creep.id, pos })
    },
    ["harvest"]: {
      program: ({ memory: { sourceId } }) => {
        const creep = undefined as any;
        const source = Game.getObjectById<Source>(sourceId);
        if (creep === null || source === null) {
          return fail;
        }
        const result = creep.harvest(source);
        if (result === OK || result === ERR_TIRED) {
          return wait;
        }
        return { exit: true, status: result * -1 };
      },
      init: (creep, source) => ({ creepId: creep.id, sourceId: source.id })
    },
    ["spawn-creep"]: {
      program: ({ logger, memory: { spawnId, name, body, didSpawn } }) => {
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
      },
      init: (
        spawn: StructureSpawn,
        body: BodyPartConstant[],
        name: string
      ) => ({
        spawnId: spawn.id,
        body,
        name,
        didSpawn: false
      })
    }
  });
}

