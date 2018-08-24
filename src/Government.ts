import { Colony } from "Colony";

export class Government {
  private colonies: Colony[] = [];

  public initialize() {
    this.colonies.push(new Colony(Game.rooms["W8N3"]));
    _.forEach(Memory.creeps, (m) => (m.mission = null));
  }

  public clean() {
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];
      }
    }

    this.colonies.forEach((c) => c.clean());
  }

  public update() {
    this.colonies.forEach((c) => c.update());
  }

  public plan() {
    this.colonies.forEach((c) => c.plan());
  }

  public execute() {
    this.colonies.forEach((c) => c.execute());
  }
}
