import { ListCustomersWhoRedeemedReward } from "@/core/application/interfaces/customers-rewards";
import { Customer } from "@/core/domain/customers/customer.entity";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { CustomerRewardRedemptionDto } from "@/core/application/dtos/customer-rewards";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { CustomerDto } from "@/core/application/dtos/customers";

export class ListCustomersWhoRedeemedRewardUseCase implements ListCustomersWhoRedeemedReward {
  constructor(
    private readonly rewardRepo: RewardRepository,
    private readonly customerRewardQueryRepo: CustomerRewardQueryRepository,
    private readonly mapper: Mapper<Customer, CustomerDto>
  ) { }

  async execute(rewardId: number): Promise<CustomerRewardRedemptionDto[]> {
    await this.rewardRepo.getById(rewardId);

    const abc = await this.customerRewardQueryRepo
      .findCustomersWhoRedeemedReward(rewardId);

    const mapped: CustomerRewardRedemptionDto[] = abc.map(item => ({
      customer: this.mapper.map(item.customer),
      redeemedAt: item.redeemedAt.toISOString(),
    }))

    return mapped;
  }
}