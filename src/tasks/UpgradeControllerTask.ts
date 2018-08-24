import { Task } from "./Task";

export class UpgradeControllerTask extends Task<StructureController> {
  constructor(target: StructureController) {
    super(target, 3, [WORK, CARRY]);
  }

  public postCondition(creep: Creep): boolean {
    return creep.carry.energy === 0;
  }

  public perform(creep: Creep): MissionProgress {
    return creep.upgradeController(this.target!) === OK
      ? { upgraded: creep.carry.energy }
      : {};
  }

  public estimateProgress(creep: Creep): MissionProgress {
    return { upgraded: creep.carry.energy };
  }
}
