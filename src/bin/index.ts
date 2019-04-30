import { program } from "sys/Registry";
import { exit, sleep, wait, spawn } from "sys/Kernel";

export const programs = {
  ["init"]: program(
    () => ({}),
    () => {
      return wait();
    }
  ),
  ["hello-world"]: program(
    () => ({}),
    () => (console.log("Hello world"), exit(0))
  ),
  ["move-creep"]: program(
    (creep: Creep, pos: RoomPosition) => ({
      id: creep.id,
      pos
    }),
    ({ id, pos }) => {
      const creep = Game.getObjectById<Creep>(id);
      if (creep === null) {
        return exit(1);
      }
      const result = creep.moveTo(pos);
      if (result === OK || result === ERR_TIRED) {
        return sleep(1);
      }
      return exit(result * -1);
    }
  ),
  ["harvest"]: program(
    (creep: Creep, source: Source) => ({
      creepId: creep.id,
      sourceId: source.id
    }),
    ({ creepId, sourceId }) => {
      const creep = Game.getObjectById<Creep>(creepId);
      const source = Game.getObjectById<Source>(sourceId);
      if (creep === null || source === null) {
        return exit(1);
      }
      const result = creep.harvest(source);
      if (result === OK || result === ERR_TIRED) {
        return sleep(1);
      }
      return exit(result * -1);
    }
  ),
  ["spawn-creep"]: program(
    (spawn: StructureSpawn, body: BodyPartConstant[], name: string) => ({
      spawnId: spawn.id,
      body,
      name,
      didSpawn: false
    }),
    (memory) => {
      const { spawnId, name, body, didSpawn } = memory;
      const spawn = Game.getObjectById<StructureSpawn>(spawnId);
      if (spawn === null) return exit(1);
      if (spawn.spawning === null) {
        if (didSpawn) {
          // logger.info(`Spawned ${name} with id ${Game.creeps[name].id}`);
          return exit(0);
        } else {
          const result = spawn.spawnCreep(body, name);
          if (result === OK) {
            memory.didSpawn = true;
          } else if (result !== ERR_BUSY) {
            return exit(result * -1);
          }
        }
      }
      return sleep(1);
    }
  )
};
