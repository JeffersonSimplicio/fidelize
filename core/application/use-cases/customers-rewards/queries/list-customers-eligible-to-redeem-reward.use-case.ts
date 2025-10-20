import { ListCustomersEligibleToRedeemReward } from "@/core/application/interfaces/customers-rewards";
import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { CustomerDto } from "@/core/application/dtos/customers";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Customer } from "@/core/domain/customers/customer.entity";

export class ListEligibleCustomersForRewardUseCase implements ListCustomersEligibleToRedeemReward {
  constructor(
    private readonly rewardRepo: RewardRepository,
    private readonly customerRewardQueryRepo: CustomerRewardQueryRepository,
    private readonly mapper: Mapper<Customer, CustomerDto>,
  ) { }

  async execute(rewardId: number): Promise<CustomerDto[]> {
    await this.rewardRepo.getById(rewardId);

    const eligibleCustomers = await this.customerRewardQueryRepo
      .findCustomersEligibleToRedeemReward(rewardId);

    return eligibleCustomers.map(this.mapper.map);
  }
}