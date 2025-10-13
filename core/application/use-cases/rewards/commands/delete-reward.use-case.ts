import { DeleteReward } from "@/core/application/interfaces/rewards";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";

export class DeleteRewardUseCase implements DeleteReward {
  constructor(private readonly rewardRepo: RewardRepository) { }

  async execute(id: number): Promise<void> {
    return await this.rewardRepo.delete(id);
  }
}