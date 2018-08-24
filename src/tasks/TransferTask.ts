import { Task } from "./Task";
import { cache } from "utils/Cache";

export class TransferTask extends Task<StructureSpawn> {
  constructor(target: StructureSpawn) {
    super(target, 1, [CARRY]);
  }

  public estimateProgress(creep: Creep): MissionProgress {
    const tc = cache.get(this.target!);
    const capacity = tc.energyCapacity - tc.energy;
    if (capacity > 0) {
      const amount = Math.min(creep.carry.energy, capacity);
      tc.energy -= amount;
      return { transfered: amount };
    }
    return {};
  }

  public postCondition(creep: Creep): boolean {
    return (
      creep.carry.energy === 0 ||
      this.target!.energyCapacity - this.target!.energy === 0
    );
  }

  public perform(creep: Creep): MissionProgress {
    const tc = cache.get(this.target!);
    const capacity = tc.energyCapacity - tc.energy;
    if (capacity > 0) {
      const amount = Math.min(creep.carry.energy, capacity);
      if (creep.transfer(this.target!, RESOURCE_ENERGY, amount) === OK) {
        tc.energy -= amount;
        return { transfered: amount };
      }
    }
    return {};
  }
}
