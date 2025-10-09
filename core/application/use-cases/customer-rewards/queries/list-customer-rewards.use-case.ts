import { IListCustomerRewards } from "@/core/application/interfaces/customer-rewards";
import { CustomerReward } from "@/core/domain/customerRewards/customerReward.entity";
import { ICustomerRewardRepository } from "@/core/domain/customerRewards/customerReward.repository";

export class ListCustomerRewardsUseCase implements IListCustomerRewards {
  constructor(
    private readonly repo: ICustomerRewardRepository,
  ) { }

  async execute(): Promise<CustomerReward[]> {
    return await this.repo.findAll();
  }
}