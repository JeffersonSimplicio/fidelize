import { CreateRewardDto } from "@/core/application/dtos/rewards/create-reward.dto";
import { Reward } from "@/core/domain/rewards/reward.entity";

export interface IRegisterReward {
  execute(data: CreateRewardDto): Promise<Reward>;
}