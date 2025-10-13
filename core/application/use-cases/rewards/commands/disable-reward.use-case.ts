import { DisableReward } from "@/core/application/interfaces/rewards";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";

export class DisableRewardUseCase implements DisableReward {
  constructor(
    private readonly rewardRepo: RewardRepository,
  ) { }

  async execute(id: number): Promise<void> {
    const existing = await this.rewardRepo.getById(id);

    existing.deactivate()

    await this.rewardRepo.update(existing);
  }
}