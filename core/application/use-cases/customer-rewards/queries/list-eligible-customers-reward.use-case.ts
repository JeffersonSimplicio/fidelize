import { IListEligibleCustomersForReward } from "@/core/application/interfaces/customer-rewards";
import { ICustomerRewardRepository } from "@/core/domain/customerRewards/customerReward.repository";
import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";

export class ListEligibleCustomersForRewardUseCase implements IListEligibleCustomersForReward {
  constructor(
    private readonly rewardRepo: IRewardRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly customerRewardRepo: ICustomerRewardRepository,
  ) { }

  async execute(rewardId: number): Promise<Customer[]> {
    const reward = await this.rewardRepo.findById(rewardId);
    if (!reward) throw new Error("Recompensa não encontrada!");

    const customers = await this.customerRepo.findAll();
    const customerRewards = await this.customerRewardRepo.findByRewardId(rewardId);

    const customerRedeemedIds = new Set(customerRewards.map(cr => cr.customerId));
    const eligibleCustomers = customers.filter(
      c => !customerRedeemedIds.has(c.id!) && c.points >= reward.pointsRequired
    );

    return eligibleCustomers;
  }
}