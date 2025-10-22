import { CreateRewardDto, RewardDto } from "@/core/application/dtos/rewards";

export interface RegisterReward {
  execute(data: CreateRewardDto): Promise<RewardDto>;
}