import { Reward } from "@/core/domain/rewards/reward.entity";

export interface IListRewards {
  execute(): Promise<Reward[]>;
}