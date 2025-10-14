import { RewardDto } from "@/core/application/dtos/rewards";

export interface ListRewardsActive {
  execute(): Promise<RewardDto[]>;
}