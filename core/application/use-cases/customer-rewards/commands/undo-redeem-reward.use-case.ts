import { IUndoRedeemReward } from "@/core/application/interfaces/customer-rewards";
import { ICustomerRewardRepository } from "@/core/domain/customerRewards/customerReward.repository";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { RewardStatus } from "@/core/domain/rewards/reward.status";

export class UndoRedeemRewardUseCase implements IUndoRedeemReward {
  constructor(
    private readonly rewardRepo: IRewardRepository,
    private readonly customerRewardRepo: ICustomerRewardRepository,
  ) { }

  async execute(customerId: number, rewardId: number): Promise<boolean> {
    const customerRewards = await this.customerRewardRepo.findByCustomerId(customerId);
    const customerReward = customerRewards.find((r) => r.rewardId === rewardId);

    if (!customerReward) return false;

    const reward = await this.rewardRepo.findById(customerReward.rewardId);

    if (reward!.isActive === RewardStatus.Inactive) {
      throw new Error("Não é possível reverter o resgate de uma recompensa desativada.")
    }

    return this.customerRewardRepo.delete(customerReward.id!)
  }
}