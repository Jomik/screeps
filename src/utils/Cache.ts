import { getReference } from ".";

class Cache {
  private cache = new Map<string, any>();
  public get<T extends RoomObject>(
    object: T
  ): Pick<T, PropertyNames<T, number>> {
    const ref = getReference(object);
    let proxy = this.cache.get(ref);
    if (proxy === undefined) {
      proxy = new Proxy({} as any, {
        get(target, prop) {
          return target[prop] || (object as any)[prop];
        }
      });
      this.cache.set(ref, proxy);
    }
    return proxy;
  }

  public clear() {
    this.cache.clear();
  }
}

export const cache = new Cache();
