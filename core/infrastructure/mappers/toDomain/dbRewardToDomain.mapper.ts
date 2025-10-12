import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Reward as RewardEntity } from '@/core/domain/rewards/reward.entity';
import { RewardSelect } from '@/core/infrastructure/database/drizzle/types';
import { RewardStatus } from '@/core/domain/rewards/reward.status';

export class DbRewardToDomainMapper implements Mapper<RewardSelect, RewardEntity> {
  map(input: RewardSelect): RewardEntity {
    const reward = new RewardEntity({
      name: input.name,
      description: input.description,
      pointsRequired: input.pointsRequired,
      isActive: input.isActive === 1 ? RewardStatus.Active : RewardStatus.Inactive,
      createdAt: input.createdAt
    })
    reward.setId(input.id);

    return reward;
  }
}