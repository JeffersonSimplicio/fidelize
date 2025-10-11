import { CustomerReward as CustomerRewardEntity } from '@/core/domain/customerRewards/customerReward.entity';
import { IMapper } from '@/core/domain/shared/mappers/mapper.interface';
import { CustomerRewardsSelect } from '@/core/infrastructure/database/drizzle/types';

export class DbCustomerRewardsToDomainMapper implements IMapper<
  CustomerRewardsSelect,
  CustomerRewardEntity
> {
  map(input: CustomerRewardsSelect): CustomerRewardEntity {
    const customerReward = new CustomerRewardEntity({
      customerId: input.customerId,
      rewardId: input.rewardId,
      redeemedAt: input.redeemedAt,
    });
    customerReward.setId(input.id);

    return customerReward;
  }
}