import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IListRewardsActive } from "@/core/application/interfaces/rewards/list-rewards-active";

export class ListRewardsActiveUseCase implements IListRewardsActive {
  constructor(private readonly repo: IRewardRepository) { }

  async execute(): Promise<Reward[]> {
    return await this.repo.findAllActivated();
  }
}