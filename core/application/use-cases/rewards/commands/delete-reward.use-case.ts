import { IDeleteReward } from "@/core/application/interfaces/rewards";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository.interface";

export class DeleteRewardUseCase implements IDeleteReward {
  constructor(private readonly repo: IRewardRepository) { }

  async execute(id: number): Promise<boolean> {
    return await this.repo.delete(id);
  }
}