import { Mission } from "missions/Mission";

export class Headquarters {
  private missions: Mission[] = [];
  private creeps: string[] = [];

  public clean() {
    this.missions.forEach((m) => m.clean());
  }

  public update() {
    this.validateMissions();
    this.missions.forEach((m) => m.update());
  }

  public registerMission(mission: Mission) {
    if (!mission.valid) {
      throw Error(`Attempting to register invalid mission: ${mission.id}`);
    }
    if (this.missions.every((m) => m.id !== mission.id)) {
      this.missions.push(mission);
    }
  }

  public withdrawMission(id: string) {
    const index = this.missions.findIndex((m) => m.id === id);
    if (index > -1) {
      this.missions[index].abort();
      this.missions.slice(index, index);
    }
  }

  public assignMissions(creeps: Creep[]) {
    for (const c of creeps) {
      const mission = _(this.missions)
        .filter((m) => m.needsNew)
        .min((m) => m.squadSize);
      if (mission !== (Infinity as any)) {
        mission.assign(c);
      }
    }
  }

  public validateMissions() {
    for (const mission of this.missions) {
      if (!mission.valid) {
        mission.abort();
      }
    }
  }

  public executeMissions() {
    this.missions.forEach((m) => m.execute());
  }
}
