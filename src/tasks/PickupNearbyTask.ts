import { Task } from "./Task";
import { cache } from "utils/Cache";
import { getObjectFromReference } from "utils";

export class PickupNearbyTask extends Task<RoomObject> {
  private tick: number = -1;
  private _resource: Resource | null = null;
  public get target(): Resource | null {
    if (Game.time !== this.tick) {
      this.tick = Game.time;
      this._resource = null;
      const t = getObjectFromReference(this.targetRef);
      if (t !== null) {
        const potential = t.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        if (potential !== null && t.pos.getRangeTo(potential.pos) < 9) {
          this._resource = potential;
        }
      }
    }
    return this._resource;
  }

  constructor(target: RoomObject) {
    super(target, 1, [CARRY]);
  }

  public postCondition(creep: Creep): boolean {
    return this.target !== null && this.target.amount > 0
      ? creep.carry.energy === creep.carryCapacity
      : creep.carry.energy > 0;
  }

  public perform(creep: Creep): MissionProgress {
    const tc = cache.get(this.target!);
    const tamount = tc.amount;
    if (tamount > 0) {
      if (creep.pickup(this.target!) === OK) {
        const amount = Math.min(creep.carryCapacity, tamount);
        tc.amount -= amount;
        return { pickedUp: amount };
      }
    }
    return {};
  }
  public estimateProgress(creep: Creep): MissionProgress {
    const tc = cache.get(this.target!);
    const tamount = tc.amount;
    if (tamount > 0) {
      const amount = Math.min(creep.carryCapacity, tamount);
      tc.amount -= amount;
      return { pickedUp: amount };
    }
    return {};
  }
}
