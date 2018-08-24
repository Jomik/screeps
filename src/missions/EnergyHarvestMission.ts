import { Mission } from "./Mission";
import { HarvestTask } from "tasks/HarvestTask";

export class EnergyHarvestMission extends Mission {
  constructor(source: Source) {
    super(`harvest@${source.id.substr(0, 5)}`, [new HarvestTask(source)], 3);
  }

  protected updateProgress(
    acc: MissionProgress,
    task: MissionProgress
  ): MissionProgress {
    return acc;
  }

  protected checkProgress(progress: MissionProgress): boolean {
    return false;
  }
}
