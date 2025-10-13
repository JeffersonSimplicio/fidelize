import { IListCustomersWhoRedeemedReward } from "@/core/application/interfaces/customers-rewards";
import { ICustomerRewardRepository } from "@/core/domain/customer-reward/customer-reward.repository.interface";
import { Customer } from "@/core/domain/customers/customer.entity";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository.interface";

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