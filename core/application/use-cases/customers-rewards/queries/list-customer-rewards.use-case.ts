import { IListCustomerRewards } from "@/core/application/interfaces/customers-rewards";
import { CustomerReward } from "@/core/domain/customer-reward/customer-reward.entity";
import { ICustomerRewardRepository } from "@/core/domain/customer-reward/customer-reward.repository.interface";

export class ListCustomerRewardsUseCase implements IListCustomerRewards {
  constructor(
    private readonly repo: ICustomerRewardRepository,
  ) { }

  async execute(): Promise<CustomerReward[]> {
    return await this.repo.findAll();
  }
}