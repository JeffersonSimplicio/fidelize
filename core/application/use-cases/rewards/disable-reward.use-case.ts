import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IDisableReward } from "@/core/application/interfaces/rewards/disable-reward";

export class DisableRewardUseCase implements IDisableReward {
  constructor(
    private readonly repo: IRewardRepository,
  ) { }

  async execute(id: number): Promise<boolean> {
    const existing = await this.repo.findById(id);
    if (!existing) return false;

    existing.deactivate()

    const updated = await this.repo.update(existing);
    return !!updated;
  }
}