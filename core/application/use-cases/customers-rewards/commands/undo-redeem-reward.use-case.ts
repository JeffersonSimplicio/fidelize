import { UndoRedeemReward } from "@/core/application/interfaces/customers-rewards";
import { CustomerRewardRepository } from "@/core/domain/customer-rewards/customer-reward.repository.interface";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { RewardStatus } from "@/core/domain/rewards/reward.status";

export interface UndoRedeemRewardDep {
  rewardRepo: RewardRepository,
  customerRewardRepo: CustomerRewardRepository,
}

export class UndoRedeemRewardUseCase implements UndoRedeemReward {
  private readonly rewardRepo: RewardRepository;
  private readonly customerRewardRepo: CustomerRewardRepository;

  constructor(deps: UndoRedeemRewardDep) {
    this.rewardRepo = deps.rewardRepo;
    this.customerRewardRepo = deps.customerRewardRepo;
  }

  async execute(customerId: number, rewardId: number): Promise<void> {
    const hasAlreadyRedeemed = await this.customerRewardRepo.alreadyRedeemed(
      customerId,
      rewardId
    );

    if (!hasAlreadyRedeemed) throw new Error("Não é possível desfazer um resgate que não existe");

    const reward = await this.rewardRepo.getById(rewardId);
    if (reward.isActive === RewardStatus.Inactive) {
      throw new Error(
        "Não é possível reverter o resgate de uma recompensa desativada."
      )
    }

    this.customerRewardRepo.delete(hasAlreadyRedeemed.id!)
  }
}