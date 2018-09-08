import { Task } from "tasks/Task";

export const enum Priority {
  OPTIONAL,
  ESSENTIAL,
  CRITICAL
}

export abstract class Mission {
  public get squadSize(): number {
    return this.squad.length;
  }
  public progress: MissionProgress = {};

  private squad: string[] = [];

  constructor(
    public readonly id: string,
    private tasks: Array<Task<RoomObject>>,
    public readonly maxSquadSize: number = 1
  ) {}

  public clean() {
    _.remove(
      this.squad,
      (name) =>
        !(name in Game.creeps) ||
        Memory.creeps[name].mission === null ||
        Memory.creeps[name].mission!.id !== this.id
    );
  }

  public update() {
    for (const name of this.squad) {
      const mission = Memory.creeps[name].mission!;
      const task = this.tasks[mission.step];
      if (task.postCondition(Game.creeps[name])) {
        if (mission.step + 1 < this.tasks.length) {
          ++mission.step;
        } else if (this.isComplete()) {
          this.withdraw(name);
        } else {
          mission.step = 0;
        }
      }
    }
  }

  public execute() {
    if (this.isComplete()) {
      throw Error(`Trying to execute a completed mission: ${this.id}`);
    } else if (!this.valid) {
      throw Error(`Trying to execute an invalid mission: ${this.id}`);
    } else {
      for (const name of this.squad) {
        const creep = Game.creeps[name];
        const task = this.tasks[creep.memory.mission!.step];
        if (creep.pos.inRangeTo(task.target!, task.range)) {
          this.progress = this.updateProgress(
            this.progress,
            task.perform(creep)
          );
        } else {
          creep.moveTo(task.target!);
        }
      }
    }
  }

  protected abstract updateProgress(
    acc: MissionProgress,
    task: MissionProgress
  ): MissionProgress;
  protected abstract checkProgress(progress: MissionProgress): boolean;
  public isComplete(): boolean {
    return this.checkProgress(this.progress);
  }

  public willBeCompleted(): boolean {
    const creeps = this.squad.map((name) => Game.creeps[name]);
    const { progress } = _.foldl(
      this.tasks,
      ({ progress: prog, index }, task) => {
        const estimates = _(creeps)
          .filter((creep) => creep.memory.mission!.step <= index)
          .map((c) => task.estimateProgress(c))
          .value();
        const p = _.foldl(
          estimates,
          (acc, e) => this.updateProgress(acc, e),
          prog
        );
        return { progress: p, index: index + 1 };
      },
      { progress: this.progress, index: 0 }
    );
    return this.checkProgress(progress);
  }

  public get needsNew(): boolean {
    return (
      this.squadSize < this.maxSquadSize &&
      this.tasks[0].valid &&
      !this.isComplete() &&
      !this.willBeCompleted()
    );
  }

  public get valid(): boolean {
    if (this.isComplete()) {
      return false;
    }
    const lastInvalid = _.findLastIndex(this.tasks, (task) => !task.valid);
    return (
      lastInvalid < 0 ||
      (this.squad.length > 0 &&
        this.squad.every(
          (name) => Game.creeps[name].memory.mission!.step > lastInvalid
        ))
    );
  }

  public assign(creep: Creep): boolean {
    if (this.needsNew) {
      if (!_.contains(this.squad, creep.name)) {
        this.squad.push(creep.name);
      }
      if (
        creep.memory.mission === null ||
        creep.memory.mission.id !== this.id
      ) {
        creep.memory.mission = {
          id: this.id,
          step: 0
        };
      }
      return true;
    } else {
      return false;
    }
  }

  public withdraw(name: string) {
    _.remove(this.squad, (n) => n === name);
    const memory = Memory.creeps[name];
    if (memory.mission !== null && memory.mission.id === this.id) {
      memory.mission = null;
    }
  }

  public abort() {
    this.squad.forEach((n) => this.withdraw(n));
  }
}
