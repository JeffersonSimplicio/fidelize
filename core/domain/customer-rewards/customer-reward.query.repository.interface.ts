import {
  TopReward,
  CustomerRedeemedReward,
  CustomerRewardRedemption,
} from '@/core/domain/customer-rewards/query-models';
import { CustomerReward } from '@/core/domain/customer-rewards/customer-reward.entity';
import { Customer } from '@/core/domain/customers/customer.entity';
import { Reward } from '@/core/domain/rewards/reward.entity';

export interface CustomerRewardQueryRepository {
  findAll(): Promise<CustomerReward[]>;
  findTopRewardsByRedeem(limit: number): Promise<TopReward[]>;
  findRewardsRedeemedByCustomer(
    customerId: number,
  ): Promise<CustomerRedeemedReward[]>;
  findAvailableRewardsForCustomer(customerId: number): Promise<Reward[]>;
  findCustomersEligibleToRedeemReward(rewardId: number): Promise<Customer[]>;
  findCustomersWhoRedeemedReward(
    rewardId: number,
  ): Promise<CustomerRewardRedemption[]>;
}
