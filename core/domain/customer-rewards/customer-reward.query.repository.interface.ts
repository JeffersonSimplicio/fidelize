import {
  TopReward,
  CustomerRedeemedReward
} from "@/core/domain/customer-rewards/query-models";

export interface CustomerRewardQueryRepository {
  findTopRewardsByRedeem(limit: number): Promise<TopReward[]>;
  findRewardsRedeemedByCustomer(customerId: number): Promise<CustomerRedeemedReward[]>;
}