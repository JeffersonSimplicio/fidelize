import { RewardDto } from "@/core/application/dtos";

export interface ListRewards {
  execute(): Promise<RewardDto[]>;
}