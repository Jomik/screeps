export * from "./ErrorMapper";
export * from "./typeguards";

export function getObjectFromReference<T extends RoomObject>(
  reference: string
): T | null {
  return (Game.getObjectById(reference) ||
    Game.flags[reference] ||
    Game.creeps[reference] ||
    Game.spawns[reference] ||
    null) as any;
}

export function getReference(object: RoomObject): string {
  const ref: string | undefined = (object as any).id || (object as any).name;
  if (ref === undefined) {
    throw Error(`Unable to get a reference for ${object}`);
  }
  return ref;
}
