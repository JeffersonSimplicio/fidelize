import { RewardDto } from "@/core/application/dtos/rewards";
import { GetRewardDetail } from "@/core/application/interfaces/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class GetRewardDetailUseCase implements GetRewardDetail {
  constructor(
    private readonly rewardRepo: RewardRepository,
    private readonly mapper: Mapper<Reward, RewardDto>,
  ) { }

  async execute(id: number): Promise<RewardDto> {
    const reward = await this.rewardRepo.getById(id);
    return this.mapper.map(reward);
  }
}