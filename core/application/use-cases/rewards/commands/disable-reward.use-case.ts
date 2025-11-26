import { DisableReward } from '@/core/application/interfaces/rewards';
import { RewardRepository } from '@/core/domain/rewards/reward.repository.interface';

export interface DisableRewardDep {
  rewardRepo: RewardRepository;
}

export class DisableRewardUseCase implements DisableReward {
  private readonly rewardRepo: RewardRepository;

  constructor(deps: DisableRewardDep) {
    this.rewardRepo = deps.rewardRepo;
  }

  async execute(id: number): Promise<void> {
    const existing = await this.rewardRepo.getById(id);
    existing.deactivate();
    await this.rewardRepo.update(existing);
  }
}
