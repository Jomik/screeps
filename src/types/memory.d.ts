interface Memory {
  missions: {
    [id: string]: MissionMemory;
  };
}

interface MissionMemory {
  progress: MissionProgress;
}

interface CreepMemory {
  colony: string;
  mission: CreepMissionMemory | null;
}

interface CreepMissionMemory {
  id: string;
  step: number;
}
