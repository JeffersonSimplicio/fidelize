import { RewardDto } from '@/core/application/dtos';
import { ListAvailableRewardsForCustomer } from '@/core/application/interfaces/customers-rewards';
import { CustomerRewardQueryRepository } from '@/core/domain/customer-rewards/customer-reward.query.repository.interface';
import { CustomerRepository } from '@/core/domain/customers/customer.repository.interface';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';

export interface ListAvailableRewardsForCustomerDep {
  customerRepo: CustomerRepository;
  customerRewardQueryRepo: CustomerRewardQueryRepository;
  rewardToDtoMapper: Mapper<Reward, RewardDto>;
}

export class ListAvailableRewardsForCustomerUseCase
  implements ListAvailableRewardsForCustomer
{
  private readonly customerRepo: CustomerRepository;
  private readonly customerRewardQueryRepo: CustomerRewardQueryRepository;
  private readonly rewardToDtoMapper: Mapper<Reward, RewardDto>;

  constructor(deps: ListAvailableRewardsForCustomerDep) {
    this.customerRepo = deps.customerRepo;
    this.customerRewardQueryRepo = deps.customerRewardQueryRepo;
    this.rewardToDtoMapper = deps.rewardToDtoMapper;
  }

  async execute(customerId: number): Promise<RewardDto[]> {
    await this.customerRepo.getById(customerId);

    const rewards =
      await this.customerRewardQueryRepo.findAvailableRewardsForCustomer(
        customerId,
      );

    return rewards.map((r) => this.rewardToDtoMapper.map(r));
  }
}
