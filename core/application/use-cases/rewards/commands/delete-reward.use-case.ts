import { DeleteReward } from "@/core/application/interfaces/rewards";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";

export interface DeleteRewardDep {
  rewardRepo: RewardRepository
}

export class DeleteRewardUseCase implements DeleteReward {
  private readonly rewardRepo: RewardRepository;

  constructor(deps: DeleteRewardDep) {
    this.rewardRepo = deps.rewardRepo
  }

  async execute(id: number): Promise<void> {
    return await this.rewardRepo.delete(id);
  }
}