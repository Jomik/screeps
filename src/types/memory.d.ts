interface Memory {
  missions: {
    [id: string]: MissionMemory<any>;
  };
}

interface MissionMemory<P> {
  progress: P;
}

interface CreepMemory {
  colony: string;
  mission: CreepMissionMemory | null;
}

interface CreepMissionMemory {
  id: string;
  step: number;
}
