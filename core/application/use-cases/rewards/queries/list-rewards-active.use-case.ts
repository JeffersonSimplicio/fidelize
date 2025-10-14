import { RewardDto } from "@/core/application/dtos/rewards";
import { ListRewardsActive } from "@/core/application/interfaces/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardQueryRepository } from "@/core/domain/rewards/reward.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class ListRewardsActiveUseCase implements ListRewardsActive {
  constructor(
    private readonly rewardRepo: RewardQueryRepository,
    private readonly mapper: Mapper<Reward, RewardDto>,
  ) { }

  async execute(): Promise<RewardDto[]> {
    const listRewardsActive = await this.rewardRepo.findAllActive();
    return listRewardsActive.map(this.mapper.map);
  }
}