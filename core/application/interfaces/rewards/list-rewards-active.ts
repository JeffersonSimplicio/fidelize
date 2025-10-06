import { Reward } from "@/core/domain/rewards/reward.entity";

export interface IListRewardsActive {
  execute(): Promise<Reward[]>;
}