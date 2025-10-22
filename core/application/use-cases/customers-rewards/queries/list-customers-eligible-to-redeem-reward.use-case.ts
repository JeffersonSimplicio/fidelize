import { ListCustomersEligibleToRedeemReward } from "@/core/application/interfaces/customers-rewards";
import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { CustomerDto } from "@/core/application/dtos/customers";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Customer } from "@/core/domain/customers/customer.entity";

export interface ListCustomersEligibleToRedeemRewardDep {
  rewardRepo: RewardRepository,
  customerRewardQueryRepo: CustomerRewardQueryRepository,
  customerToDtoMapper: Mapper<Customer, CustomerDto>,
}

export class ListEligibleCustomersForRewardUseCase implements ListCustomersEligibleToRedeemReward {
  private readonly rewardRepo: RewardRepository;
  private readonly customerRewardQueryRepo: CustomerRewardQueryRepository;
  private readonly customerToDtoMapper: Mapper<Customer, CustomerDto>;

  constructor(deps: ListCustomersEligibleToRedeemRewardDep) {
    this.rewardRepo = deps.rewardRepo;
    this.customerRewardQueryRepo = deps.customerRewardQueryRepo;
    this.customerToDtoMapper = deps.customerToDtoMapper;
  }

  async execute(rewardId: number): Promise<CustomerDto[]> {
    await this.rewardRepo.getById(rewardId);

    const eligibleCustomers = await this.customerRewardQueryRepo
      .findCustomersEligibleToRedeemReward(rewardId);

    return eligibleCustomers.map(this.customerToDtoMapper.map);
  }
}