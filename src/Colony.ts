import { Headquarters } from "Headquarters";

export class Colony {
  public readonly headquarters = new Headquarters(this);
  public readonly name: string;
  public get room(): Room {
    return Game.rooms[this.name];
  }
  private get spawns(): StructureSpawn[] {
    return this.room.find(FIND_MY_SPAWNS);
  }

  constructor(room: Room) {
    this.name = room.name;
  }

  public clean() {
    this.headquarters.clean();
  }

  public update() {
    // Register new missions, etc.
    this.headquarters.update();
  }

  public plan() {
    for (const spawn of this.spawns) {
      if (!spawn.spawning && spawn.energy === spawn.energyCapacity) {
        spawn.spawnCreep(
          [WORK, WORK, CARRY, MOVE],
          `${this.name}#${Game.time}`,
          { memory: { mission: null, colony: this.name } }
        );
      }
    }
  }

  public execute() {
    this.headquarters.executeMissions();
  }
}
