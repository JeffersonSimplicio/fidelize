import { IListAvailableRewardsForCustomer } from "@/core/application/interfaces/customer-rewards";
import { ICustomerRewardRepository } from "@/core/domain/customerRewards/customerReward.repository";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";

export class ListAvailableRewardsForCustomerUseCase implements IListAvailableRewardsForCustomer {
  constructor(
    private readonly rewardRepo: IRewardRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly customerRewardRepo: ICustomerRewardRepository,
  ) { }

  async execute(customerId: number): Promise<Reward[]> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) throw new Error("Cliente não encontrado!")

    const activeRewards = await this.rewardRepo.findAllActivated();
    const customerRewards = await this.customerRewardRepo.findByCustomerId(customerId);

    const redeemedRewardIds = new Set(customerRewards.map(cr => cr.rewardId));
    const availableRewards = activeRewards.filter(
      r => !redeemedRewardIds.has(r.id!) && r.pointsRequired <= customer.points
    );

    return availableRewards;
  }
}