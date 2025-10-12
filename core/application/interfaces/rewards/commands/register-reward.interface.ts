import { CreateRewardDto } from "@/core/application/dtos/rewards/create-reward.dto";
import { RewardDto } from "@/core/application/dtos/rewards/reward.dto";

export interface RegisterReward {
  execute(data: CreateRewardDto): Promise<RewardDto>;
}