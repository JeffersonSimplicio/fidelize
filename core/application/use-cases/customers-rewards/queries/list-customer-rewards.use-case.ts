import { ListCustomerRewards } from '@/core/application/interfaces/customers-rewards';
import { CustomerRewardQueryRepository } from '@/core/domain/customer-rewards/customer-reward.query.repository.interface';
import { CustomerRewardDto } from '@/core/application/dtos/customer-rewards';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { CustomerReward } from '@/core/domain/customer-rewards/customer-reward.entity';

export interface ListCustomerRewardsDep {
  customerRewardQueryRepo: CustomerRewardQueryRepository;
  customerRewardToDtoMapper: Mapper<CustomerReward, CustomerRewardDto>;
}

export class ListCustomerRewardsUseCase implements ListCustomerRewards {
  private readonly customerRewardQueryRepo: CustomerRewardQueryRepository;
  private readonly customerRewardToDtoMapper: Mapper<
    CustomerReward,
    CustomerRewardDto
  >;

  constructor(deps: ListCustomerRewardsDep) {
    this.customerRewardQueryRepo = deps.customerRewardQueryRepo;
    this.customerRewardToDtoMapper = deps.customerRewardToDtoMapper;
  }

  async execute(): Promise<CustomerRewardDto[]> {
    const customerRewards = await this.customerRewardQueryRepo.findAll();
    return customerRewards.map((reward) =>
      this.customerRewardToDtoMapper.map(reward),
    );
  }
}
