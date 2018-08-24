import { Headquarters } from "Headquarters";
import { EnergyHarvestMission } from "missions/EnergyHarvestMission";
import { TransportMission } from "missions/TransportMission";
import { UpgradeControllerMission } from "missions/UpgradeControllerMission";

let registered = false;
let counter = -1;

export class Colony {
  public readonly headquarters: Headquarters = new Headquarters();
  public get room(): Room {
    return Game.rooms[this._room];
  }

  private _room: string;

  constructor(room: Room) {
    this._room = room.name;
  }

  public clean() {
    this.headquarters.clean();
  }

  public update() {
    this.headquarters.update();
  }

  public plan() {
    const spawn = Game.spawns["Spawn1"];
    if (!registered) {
      const source1 = this.room.find(FIND_SOURCES)[0];
      const source2 = this.room.find(FIND_SOURCES)[1];
      this.headquarters.registerMission(new EnergyHarvestMission(source1));
      this.headquarters.registerMission(new TransportMission(source1, spawn));
      this.headquarters.registerMission(new EnergyHarvestMission(source2));
      this.headquarters.registerMission(
        new UpgradeControllerMission(this.room.controller!, source2, 10)
      );
      registered = true;
    }
    if (!spawn.spawning && spawn.energy === spawn.energyCapacity) {
      spawn.spawnCreep(
        [WORK, WORK, CARRY, MOVE],
        `${this._room}#${++counter}`,
        { memory: { mission: null, colony: this._room } }
      );
    }
    const creeps = _.filter(
      Game.creeps,
      (c) =>
        !c.spawning &&
        c.memory.mission === null &&
        c.memory.colony === this._room
    );
    if (creeps.length > 0) {
      this.headquarters.assignMissions(creeps);
    }
  }

  public execute() {
    this.headquarters.executeMissions();
  }
}
