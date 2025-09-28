import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IRegisterReward } from "@/core/application/interfaces/rewards/register-reward";
import { CreateRewardDto } from "@/core/application/dtos/rewards/create-reward.dto";


export class RegisterRewardUseCase implements IRegisterReward {
  constructor(private readonly repo: IRewardRepository) { }

  async execute(data: CreateRewardDto): Promise<Reward> {
    const now = new Date();
    const RewardCreate = {
      name: data.name,
      pointsRequired: data.pointsRequired,
      description: data.description,
      createdAt: now,
    }

    const reward = await this.repo.create(RewardCreate);

    return reward;
  }
}