import { RewardDto,UpdateRewardDto } from "@/core/application/dtos/rewards";

export interface EditReward {
  execute(id: number, data: UpdateRewardDto): Promise<RewardDto>;
}