import { CustomerReward } from '@/core/domain/customer-rewards/customer-reward.entity';

export interface CustomerRewardRepository {
  create(customerReward: CustomerReward): Promise<CustomerReward>;
  getById(id: number): Promise<CustomerReward>;
  alreadyRedeemed(
    customerId: number,
    rewardId: number,
  ): Promise<CustomerReward | null>;
  delete(id: number): Promise<void>;
}
