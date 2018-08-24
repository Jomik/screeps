import { Government } from "Government";
import { ErrorMapper } from "utils";
import { cache } from "utils/Cache";

export const government = new Government();
government.initialize();

export const loop = ErrorMapper.wrapLoop(() => {
  cache.clear();
  government.clean();
  government.update();
  government.plan();
  cache.clear();
  government.execute();
});
