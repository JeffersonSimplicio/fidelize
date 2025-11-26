import { CustomerRedeemedRewardDto } from '@/core/application/dtos/customer-rewards';
import { ListRewardsRedeemedByCustomer } from '@/core/application/interfaces/customers-rewards/queries';
import { CustomerRewardQueryRepository } from '@/core/domain/customer-rewards/customer-reward.query.repository.interface';
import { CustomerRepository } from '@/core/domain/customers/customer.repository.interface';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardDto } from '@/core/application/dtos/rewards';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';

export interface ListRewardsRedeemedByCustomerDep {
  customerRepo: CustomerRepository;
  customerRewardQueryRepo: CustomerRewardQueryRepository;
  rewardToDtoMapper: Mapper<Reward, RewardDto>;
}

export class ListRewardsRedeemedByCustomerUseCase
  implements ListRewardsRedeemedByCustomer
{
  private readonly customerRepo: CustomerRepository;
  private readonly customerRewardQueryRepo: CustomerRewardQueryRepository;
  private readonly rewardToDtoMapper: Mapper<Reward, RewardDto>;

  constructor(deps: ListRewardsRedeemedByCustomerDep) {
    this.customerRepo = deps.customerRepo;
    this.customerRewardQueryRepo = deps.customerRewardQueryRepo;
    this.rewardToDtoMapper = deps.rewardToDtoMapper;
  }

  async execute(customerId: number): Promise<CustomerRedeemedRewardDto[]> {
    await this.customerRepo.getById(customerId);

    const rewardsRedeemedByCustomer =
      await this.customerRewardQueryRepo.findRewardsRedeemedByCustomer(
        customerId,
      );

    const mapped: CustomerRedeemedRewardDto[] = rewardsRedeemedByCustomer.map(
      (item) => ({
        reward: this.rewardToDtoMapper.map(item.reward),
        redeemedAt: item.redeemedAt.toISOString(),
      }),
    );

    return mapped;
  }
}
