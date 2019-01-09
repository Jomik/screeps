export function isStructureType<T extends keyof StructureMap>(
  structure: Structure,
  type: T
): structure is StructureMap[T] {
  return structure.structureType === type;
}
