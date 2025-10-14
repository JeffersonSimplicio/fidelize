import { RewardDto } from "@/core/application/dtos/rewards";

export interface GetRewardDetail {
  execute(id: number): Promise<RewardDto>;
}