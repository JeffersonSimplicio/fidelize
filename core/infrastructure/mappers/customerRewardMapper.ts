import { CustomerReward as CustomerRewardEntity } from '@/core/domain/customer-reward/customer-reward.entity';
import { CustomerRewardsSelect } from '@/core/infrastructure/database/drizzle/types';

export function mapDbCustomerRewardToDomain(
  dbCustomerReward: CustomerRewardsSelect
): CustomerRewardEntity {
  const customerRewards = new CustomerRewardEntity({
    customerId: dbCustomerReward.customerId,
    rewardId: dbCustomerReward.rewardId,
    redeemedAt: dbCustomerReward.redeemedAt,
  });
  customerRewards.setId(dbCustomerReward.id);

  return customerRewards;
}
