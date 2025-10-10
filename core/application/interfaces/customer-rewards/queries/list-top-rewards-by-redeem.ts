import { Reward } from "@/core/domain/rewards/reward.entity";

export interface IListTopRewardsByRedeem {
  execute(limit: number): Promise<{ reward: Reward; amount: number; }[]>;
}