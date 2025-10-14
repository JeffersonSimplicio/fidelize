import { RewardDto } from "@/core/application/dtos/rewards";
import { ListRewards } from "@/core/application/interfaces/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardQueryRepository } from "@/core/domain/rewards/reward.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class ListRewardsUseCase implements ListRewards {
  constructor(
    private readonly rewardRepo: RewardQueryRepository,
    private readonly mapper: Mapper<Reward, RewardDto>,
  ) { }

  async execute(): Promise<RewardDto[]> {
    const allRewards = await this.rewardRepo.findAll();
    return allRewards.map(this.mapper.map);
  }
}