interface StructureMap {
  [STRUCTURE_EXTENSION]: StructureExtension;
  [STRUCTURE_RAMPART]: StructureRampart;
  [STRUCTURE_ROAD]: StructureRoad;
  [STRUCTURE_SPAWN]: StructureSpawn;
  [STRUCTURE_LINK]: StructureLink;
  [STRUCTURE_WALL]: StructureWall;
  [STRUCTURE_KEEPER_LAIR]: StructureKeeperLair;
  [STRUCTURE_CONTROLLER]: StructureController;
  [STRUCTURE_STORAGE]: StructureStorage;
  [STRUCTURE_TOWER]: StructureTower;
  [STRUCTURE_OBSERVER]: StructureObserver;
  [STRUCTURE_POWER_BANK]: StructurePowerBank;
  [STRUCTURE_POWER_SPAWN]: StructurePowerSpawn;
  [STRUCTURE_EXTRACTOR]: StructureExtension;
  [STRUCTURE_LAB]: StructureLab;
  [STRUCTURE_TERMINAL]: StructureTerminal;
  [STRUCTURE_CONTAINER]: StructureContainer;
  [STRUCTURE_NUKER]: StructureNuker;
  [STRUCTURE_PORTAL]: StructurePortal;
}

export function isStructureType<T extends keyof StructureMap>(
  structure: Structure,
  type: T
): structure is StructureMap[T] {
  return structure.structureType === type;
}
