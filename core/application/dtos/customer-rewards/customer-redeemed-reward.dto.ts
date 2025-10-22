import { RewardDto } from "@/core/application/dtos/rewards"

export type CustomerRedeemedRewardDto = {
  reward: RewardDto;
  redeemedAt: string;
}