import { ListCustomerRewards } from "@/core/application/interfaces/customers-rewards";
import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { CustomerRewardDto } from "@/core/application/dtos/customer-rewards";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";

export class ListCustomerRewardsUseCase implements ListCustomerRewards {
  constructor(
    private readonly customerRewardRepo: CustomerRewardQueryRepository,
    private readonly customerRewardMapper: Mapper<CustomerReward, CustomerRewardDto>
  ) { }

  async execute(): Promise<CustomerRewardDto[]> {
    const customerRewards = await this.customerRewardRepo.findAll();
    return customerRewards.map(reward => this.customerRewardMapper.map(reward));
  }
}