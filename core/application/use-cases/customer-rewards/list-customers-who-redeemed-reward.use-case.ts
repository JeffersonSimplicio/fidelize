import { ICustomerRewardRepository } from "@/core/domain/customerRewards/customerReward.repository";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IListCustomersWhoRedeemedReward } from "@/core/application/interfaces/customer-rewards/list-customers-who-redeemed-reward"
import { Customer } from "@/core/domain/customers/customer.entity";

export class ListCustomersWhoRedeemedRewardUseCase implements IListCustomersWhoRedeemedReward {
  constructor(
    private readonly rewardRepo: IRewardRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly customerRewardRepo: ICustomerRewardRepository,
  ) { }

  async execute(rewardId: number): Promise<Customer[]> {
    const reward = await this.rewardRepo.findById(rewardId);
    if (!reward) throw new Error("Recompensa não encontrada!")

    const [allCustomers, customerRewards] = await Promise.all([
      this.customerRepo.findAll(),
      this.customerRewardRepo.findByRewardId(rewardId),
    ]);

    const customerRedeemedIds = new Set(customerRewards.map(cr => cr.customerId));

    const customersWhoRedeemed = allCustomers.filter(r => customerRedeemedIds.has(r.id!));

    return customersWhoRedeemed;
  }
}