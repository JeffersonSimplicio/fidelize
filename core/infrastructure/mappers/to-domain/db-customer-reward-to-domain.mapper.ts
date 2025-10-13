import { CustomerReward as CustomerRewardEntity } from '@/core/domain/customer-rewards/customer-reward.entity';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { CustomerRewardSelect } from '@/core/infrastructure/database/drizzle/types';

export class DbCustomerRewardsToDomainMapper implements Mapper<
  CustomerRewardSelect,
  CustomerRewardEntity
> {
  map(input: CustomerRewardSelect): CustomerRewardEntity {
    const customerReward = new CustomerRewardEntity({
      customerId: input.customerId,
      rewardId: input.rewardId,
      redeemedAt: input.redeemedAt,
    });
    customerReward.setId(input.id);

    return customerReward;
  }
}