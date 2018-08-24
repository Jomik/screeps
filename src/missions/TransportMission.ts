import { Mission } from "./Mission";
import { TransferTask } from "tasks/TransferTask";
import { PickupNearbyTask } from "tasks/PickupNearbyTask";

export class TransportMission extends Mission {
  constructor(from: RoomObject, to: StructureSpawn) {
    super(
      `transport@${(from as any).id.substr(0, 5)}->${to.id.substr(0, 5)}`,
      [new PickupNearbyTask(from), new TransferTask(to)],
      2
    );
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
