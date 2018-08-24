import { Mission } from "./Mission";
import { UpgradeControllerTask } from "tasks/UpgradeControllerTask";
import { PickupNearbyTask } from "tasks/PickupNearbyTask";

export class UpgradeControllerMission extends Mission {
  constructor(
    controller: StructureController,
    energy: RoomObject,
    squadSize: number
  ) {
    super(
      `upgrade@${controller.id.substr(0, 5)}`,
      [new PickupNearbyTask(energy), new UpgradeControllerTask(controller)],
      squadSize
    );
  }

  protected updateProgress(
    acc: MissionProgress,
    task: MissionProgress
  ): MissionProgress {
    return {
      upgraded: acc.upgraded || 0 + (task.upgraded || 0)
    };
  }

  protected checkProgress(progress: MissionProgress): boolean {
    return false;
  }
}
