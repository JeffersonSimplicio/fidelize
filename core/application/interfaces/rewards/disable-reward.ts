import { Reward } from "@/core/domain/rewards/reward.entity";

export interface IDisableReward {
  execute(id: number): Promise<Reward | null>;
}