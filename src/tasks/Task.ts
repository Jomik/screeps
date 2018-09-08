import { getObjectFromReference, getReference } from "utils";

export abstract class Task<T extends RoomObject> {
  public get target(): T | null {
    return getObjectFromReference(this.targetRef);
  }
  protected targetRef: string;

  constructor(
    target: T,
    public readonly range: number = 1,
    public readonly requiredBodyPart: BodyPartConstant[] = []
  ) {
    this.targetRef = getReference(target);
  }

  public get valid(): boolean {
    return this.target !== null;
  }

  public abstract postCondition(creep: Creep): boolean;
  public abstract perform(creep: Creep): MissionProgress;
  public abstract estimateProgress(creep: Creep): MissionProgress;
}
