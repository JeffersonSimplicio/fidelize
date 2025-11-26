import { DeleteReward } from '@/core/application/interfaces/rewards';
import { RewardNotFoundError } from '@/core/domain/rewards/errors';
import { RewardRepository } from '@/core/domain/rewards/reward.repository.interface';

export interface DeleteRewardDep {
  rewardRepo: RewardRepository;
}

export class DeleteRewardUseCase implements DeleteReward {
  private readonly rewardRepo: RewardRepository;

  constructor(deps: DeleteRewardDep) {
    this.rewardRepo = deps.rewardRepo;
  }

  async execute(id: number): Promise<void> {
    // TODO: Replace this generic error with a custom error.
    if (isNaN(id)) throw new Error('Invalid id');

    const reward = await this.rewardRepo.getById(id);
    if (!reward) throw new RewardNotFoundError();
    return await this.rewardRepo.delete(id);
  }
}
