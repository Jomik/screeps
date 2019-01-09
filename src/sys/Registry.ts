import { Logger } from "sys/Logger";
import { ProcessContext } from "sys/Process";

export type Image = string;

export type Program<M> =
  (context: ProcessContext<M>) => { done: true; status: number } | { done: false };

const logger = new Logger("Registry");

class ProgramRegistry {
  private registry: Map<Image, { program: Program<any>, memory: any }> = new Map();

  public registerImage<M>(image: Image, program: Program<M>, memory: M) {
    // if (!this.registry.has(image)) {
    //   this.registry.set(image, { program, memory });
    // } else {
    //   logger.error(`Image ${image} already registered`);
    // }
    this.registry.set(image, { program, memory });
  }

  public install(bundle: { [key: string]: { program: Program<any>, memory: any } }) {
    for (const [image, { program, memory }] of Object.entries(bundle)) {
      this.registerImage(image, program, memory);
    }
  }

  public getProgram<M>(image: Image): Program<M> | undefined {
    const result = this.registry.get(image);
    if (result !== undefined) {
      return result.program;
    }

    logger.warn(`Image ${image} not found in program registry`);
    return undefined;
  }

  public getInitialMemory<M>(image: Image): M | undefined {
    const result = this.registry.get(image);
    if (result !== undefined) {
      return _.cloneDeep(result.memory);
    }

    logger.warn(`Image ${image} not found in program registry`);
    return undefined;
  }

  public list(): Image[] {
    return Array.from(this.registry.keys());
  }
}

export const programRegistry = new ProgramRegistry();
