import {
  TopReward,
  CustomerRedeemedReward
} from "@/core/domain/customer-rewards/query-models";
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";
import { Customer } from "@/core/domain/customers/customer.entity";

export interface CustomerRewardQueryRepository {
  findAll(): Promise<CustomerReward[]>;
  findTopRewardsByRedeem(limit: number): Promise<TopReward[]>;
  findRewardsRedeemedByCustomer(customerId: number): Promise<
    CustomerRedeemedReward[]
  >;
  findCustomersEligibleToRedeemReward(rewardId: number): Promise<Customer[]>;
}