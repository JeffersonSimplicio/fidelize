import { UpdateRewardDto } from "@/core/application/dtos/rewards/update-reward.dto";
import { Reward } from "@/core/domain/rewards/reward.entity";

export interface IEditRewardDetail {
  execute(id: number, data: UpdateRewardDto): Promise<Reward | null>;
}