import { Task } from "./Task";
import { cache } from "utils/Cache";

export class PickupTask extends Task<Resource> {
  constructor(target: Resource) {
    super(target, 1, [CARRY]);
  }

  public postCondition(creep: Creep): boolean {
    return (
      creep.carry.energy === creep.carryCapacity || this.target!.amount === 0
    );
  }

  public perform(creep: Creep): MissionProgress {
    const tc = cache.get(this.target!);
    const tamount = tc.amount;
    if (tamount > 0) {
      const amount = Math.min(creep.carryCapacity, tamount);
      if (creep.pickup(this.target!) === OK) {
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
