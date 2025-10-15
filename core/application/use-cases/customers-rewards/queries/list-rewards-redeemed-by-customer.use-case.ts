import { CustomerRedeemedRewardDto } from "@/core/application/dtos/customer-rewards";
import { ListRewardsRedeemedByCustomer } from "@/core/application/interfaces/customers-rewards/queries";
import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardDto } from "@/core/application/dtos/rewards";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class ListRewardsRedeemedByCustomerUseCase implements ListRewardsRedeemedByCustomer {
  constructor(
    private readonly customerRepo: CustomerRepository,
    private readonly customerRewardRepo: CustomerRewardQueryRepository,
    private readonly mapper: Mapper<Reward, RewardDto>,
  ) { }

  async execute(customerId: number): Promise<CustomerRedeemedRewardDto[]> {
    await this.customerRepo.getById(customerId);

    const rewardsRedeemedByCustomer = await this.customerRewardRepo
      .findRewardsRedeemedByCustomer(customerId)

    const mapped: CustomerRedeemedRewardDto[] = rewardsRedeemedByCustomer
      .map(item => ({
        reward: this.mapper.map(item.reward),
        redeemedAt: item.redeemedAt
      }));

    return mapped;
  }
}