import { Task } from "./Task";
import { cache } from "utils/Cache";

export class HarvestTask extends Task<Source> {
  constructor(target: Source) {
    super(target, 1, [WORK]);
  }

  public postCondition(creep: Creep): boolean {
    return false;
  }

  public estimateProgress(creep: Creep): MissionProgress {
    const tc = cache.get(this.target!);
    if (tc.energy > 0) {
      const amount = Math.min(creep.getActiveBodyparts(WORK) * 2, tc.energy);
      tc.energy -= amount;
      return { transfered: amount };
    }
    return {};
  }

  public perform(creep: Creep): MissionProgress {
    const tc = cache.get(this.target!);
    if (tc.energy > 0) {
      const amount = Math.min(creep.getActiveBodyparts(WORK) * 2, tc.energy);
      if (creep.harvest(this.target!) === OK) {
        tc.energy -= amount;
        return { transfered: amount };
      }
    }
    return {};
  }
}
