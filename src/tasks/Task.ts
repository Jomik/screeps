import { getObjectFromReference, getReference } from "utils";

export abstract class Task<T extends RoomObject> {
  public readonly requiredBodyPart: BodyPartConstant[];
  public range: number;
  public get target(): T | null {
    return getObjectFromReference(this._targetRef);
  }
  protected _targetRef: string;

  constructor(
    target: T,
    range: number,
    requiredBodyPart: BodyPartConstant[] = []
  ) {
    this._targetRef = getReference(target);
    this.range = range;
    this.requiredBodyPart = requiredBodyPart;
  }

  public get valid(): boolean {
    return this.target !== null;
  }

  public abstract postCondition(creep: Creep): boolean;
  public abstract perform(creep: Creep): MissionProgress;
  public abstract estimateProgress(creep: Creep): MissionProgress;
}
