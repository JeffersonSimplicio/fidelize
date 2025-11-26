import { CustomerReward } from '@/core/domain/customer-rewards/customer-reward.entity';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { CustomerRewardSelect } from '@/core/infrastructure/database/drizzle/types';

export class DbCustomerRewardsToDomainMapper
  implements Mapper<CustomerRewardSelect, CustomerReward>
{
  map(input: CustomerRewardSelect): CustomerReward {
    const customerReward = new CustomerReward({
      customerId: input.customerId,
      rewardId: input.rewardId,
      redeemedAt: input.redeemedAt,
    });
    customerReward.setId(input.id);

    return customerReward;
  }
}
