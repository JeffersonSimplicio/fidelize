import { CustomerRewardDto } from "@/core/application/dtos/customers-rewards/customer-reward.dto";

export interface RedeemReward {
  execute(customerId: number, rewardId: number): Promise<CustomerRewardDto>;
}
