import { IGetRewardDetail } from "@/core/application/interfaces/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository.interface";

export class GetRewardDetailUseCase implements IGetRewardDetail {
  constructor(private readonly repo: IRewardRepository) { }

  async execute(id: number): Promise<Reward | null> {
    return await this.repo.findById(id);
  }
}