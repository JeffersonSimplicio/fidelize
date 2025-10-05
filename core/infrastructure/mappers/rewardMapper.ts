import { RewardStatus } from '@/core/domain/rewards/reward-status';
import { Reward as RewardEntity } from '@/core/domain/rewards/reward.entity';
import { RewardSelect } from '@/core/infrastructure/database/drizzle/types';

export function mapDbRewardToDomain(dbReward: RewardSelect): RewardEntity {
  const reward = new RewardEntity({
    name: dbReward.name,
    description: dbReward.description,
    pointsRequired: dbReward.pointsRequired,
    isActive: dbReward.isActive === 1 ? RewardStatus.Active : RewardStatus.Inactive,
    createdAt: dbReward.createdAt
  })
  reward.setId(dbReward.id);

  return reward;
}