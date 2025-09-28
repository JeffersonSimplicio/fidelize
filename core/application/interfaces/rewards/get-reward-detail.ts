import { Reward } from "@/core/domain/rewards/reward.entity";

export interface IGetRewardDetail {
  execute(id: number): Promise<Reward | null>;
}