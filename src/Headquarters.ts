import { Mission } from "missions/Mission";
import { Colony } from "Colony";

export class Headquarters {
  private missions: Mission[] = [];
  private get creeps(): Creep[] {
    return _.filter(Game.creeps, (c) => c.memory.colony === this.colony.name);
  }

  constructor(private colony: Colony) {}

  public clean() {
    this.missions.forEach((m) => m.clean());
  }

  public update() {
    for (const mission of this.missions) {
      if (!mission.valid) {
        mission.abort();
      }
    }
    this.missions.forEach((m) => m.update());
  }

  public registerMission(mission: Mission) {
    if (!mission.valid) {
      throw Error(`Attempting to register invalid mission: ${mission.id}`);
    }
    if (this.missions.every((m) => m.id !== mission.id)) {
      this.missions.push(mission);
    } else {
      throw Error(
        `Attempting to register already registered mission: ${mission.id}`
      );
    }
  }

  public withdrawMission(id: string) {
    const index = this.missions.findIndex((m) => m.id === id);
    if (index > -1) {
      this.missions[index].abort();
      this.missions.slice(index, index);
    }
  }

  public assignMissions() {
    const creeps = _.filter(this.creeps, (c) => c.memory.mission === null);
    for (const c of creeps) {
      const mission = _(this.missions)
        .filter((m) => m.needsNew)
        .min((m) => m.squadSize);
      if (mission !== (Infinity as any)) {
        mission.assign(c);
      }
    }
  }

  public executeMissions() {
    this.missions.forEach((m) => m.execute());
  }
}
