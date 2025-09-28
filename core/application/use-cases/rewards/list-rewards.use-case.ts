import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IListRewards } from "@/core/application/interfaces/rewards/list-rewards";

export class ListRewardsUseCase implements IListRewards {
  constructor(private readonly repo: IRewardRepository) { }

  async execute(): Promise<Reward[]> {
    return await this.repo.findAll();
  }
}