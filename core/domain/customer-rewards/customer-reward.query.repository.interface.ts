import {
  TopReward,
  CustomerRedeemedReward
} from "@/core/domain/customer-rewards/query-models";
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";

export interface CustomerRewardQueryRepository {
  findAll(): Promise<CustomerReward[]>;
  findTopRewardsByRedeem(limit: number): Promise<TopReward[]>;
  findRewardsRedeemedByCustomer(customerId: number): Promise<CustomerRedeemedReward[]>;
}