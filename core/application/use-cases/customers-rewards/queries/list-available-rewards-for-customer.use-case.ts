import { RewardDto } from "@/core/application/dtos";
import { ListAvailableRewardsForCustomer } from "@/core/application/interfaces/customers-rewards";
import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class ListAvailableRewardsForCustomerUseCase implements ListAvailableRewardsForCustomer {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly customerRewardQueryRepo: CustomerRewardQueryRepository,
    private readonly mapper: Mapper<Reward, RewardDto>
  ) { }

  async execute(customerId: number): Promise<RewardDto[]> {
    await this.customerRepo.getById(customerId);

    const rewards = await this.customerRewardQueryRepo
      .findAvailableRewardsForCustomer(customerId);

    return rewards.map(this.mapper.map);
  }
}