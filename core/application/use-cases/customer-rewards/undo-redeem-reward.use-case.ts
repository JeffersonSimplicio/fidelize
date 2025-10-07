import { ICustomerRewardRepository } from "@/core/domain/customerRewards/customerReward.repository";
import { IUndoRedeemReward } from "@/core/application/interfaces/customer-rewards/undo-redeem-reward";

export class UndoRedeemRewardUseCase implements IUndoRedeemReward {
  constructor(
    private readonly repo: ICustomerRewardRepository,
  ) { }

  async execute(customerId: number, rewardId: number): Promise<boolean> {
    const customerRewards = await this.repo.findByCustomerId(customerId);
    const customerReward = customerRewards.find((r) => r.rewardId === rewardId);

    if (!customerReward) return false;

    return this.repo.delete(customerReward.id!)
  }
}