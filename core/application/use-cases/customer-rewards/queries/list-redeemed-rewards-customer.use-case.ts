import { IListRedeemedRewardsForCustomer } from "@/core/application/interfaces/customer-rewards/queries/list-redeemed-rewards-customer";
import { ICustomerRewardRepository } from "@/core/domain/customerRewards/customerReward.repository";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";

export class ListRedeemedRewardsForCustomerUseCase implements IListRedeemedRewardsForCustomer {
  constructor(
    private readonly rewardRepo: IRewardRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly customerRewardRepo: ICustomerRewardRepository,
  ) { }

  async execute(customerId: number): Promise<Reward[]> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) throw new Error("Cliente não encontrado!")

    const allRewards = await this.rewardRepo.findAll();
    const customerRewards = await this.customerRewardRepo.findByCustomerId(customerId);

    const redeemedRewardIds = new Set(customerRewards.map(cr => cr.rewardId));
    const availableRewards = allRewards.filter(
      r => redeemedRewardIds.has(r.id!)
    );

    return availableRewards;
  }
}