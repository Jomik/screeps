import { Colony } from "Colony";

export class Government {
  private colonies: Colony[] = [];

  public initialize() {
    _.forEach(Game.rooms, (r) => {
      const c = r.controller;
      if (c !== undefined) {
        if (c.my) {
          this.addColony(r);
        }
      }
    });
    _.forEach(Game.creeps, (c) => {
      c.memory.mission = null;
    });
  }

  public addColony(room: Room) {
    if (!this.colonies.some((c) => c.room.name === room.name)) {
      this.colonies.push(new Colony(room));
    }
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
