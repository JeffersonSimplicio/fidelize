import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IDisableReward } from "@/core/application/interfaces/rewards/disable-reward";

export class DisableRewardUseCase implements IDisableReward {
  constructor(
    private readonly repo: IRewardRepository,
  ) { }

  async execute(id: number): Promise<Reward | null> {
    const existing = await this.repo.findById(id);
    if (!existing) return null;

    existing.deactivate()

    return await this.repo.update(existing);
  }
}