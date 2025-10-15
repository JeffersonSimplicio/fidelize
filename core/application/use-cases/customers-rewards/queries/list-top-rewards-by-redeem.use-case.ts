import { ListTopRewardsByRedeem } from "@/core/application/interfaces/customers-rewards";
import { CustomerRewardQueryRepository } from "@/core/domain/customer-rewards/customer-reward.query.repository.interface";
import { TopRewardDto } from "@/core/application/dtos/customer-rewards";
import { RewardDto } from "@/core/application/dtos/rewards";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";

export class ListTopRewardsByRedeemUseCase implements ListTopRewardsByRedeem {
  private static MIN_LIMIT = 1;

  constructor(
    private readonly customerRewardRepo: CustomerRewardQueryRepository,
    private readonly mapper: Mapper<Reward, RewardDto>,
  ) { }

  async execute(limit: number = 3): Promise<TopRewardDto[]> {
    const effectiveLimit = Math.max(limit, ListTopRewardsByRedeemUseCase.MIN_LIMIT);

    const topRewards = await this.customerRewardRepo.findTopRewardsByRedeem(
      effectiveLimit
    );

    const mapped: TopRewardDto[] = topRewards.map(item => ({
      reward: this.mapper.map(item.reward),
      redeemedCount: item.redeemedCount
    }));

    return mapped
  }
}