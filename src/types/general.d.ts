type PropertyNames<T, P> = {
  [K in keyof T]: T[K] extends P ? K : never
}[keyof T];

interface MissionProgress {
  harvested?: number;
  pickedUp?: number;
  transfered?: number;
  upgraded?: number;
}
