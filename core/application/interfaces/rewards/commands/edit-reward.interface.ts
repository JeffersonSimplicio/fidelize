import { RewardDto } from "@/core/application/dtos/rewards/reward.dto";
import { UpdateRewardDto } from "@/core/application/dtos/rewards/update-reward.dto";

export interface EditReward {
  execute(id: number, data: UpdateRewardDto): Promise<RewardDto>;
}