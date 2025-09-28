import { Reward as DomainReward } from '@/core/domain/rewards/reward.entity';
import { RewardSelect } from '@/core/infrastructure/database/drizzle/types';

export function mapDbRewardToDomain(dbReward: RewardSelect): DomainReward {
  return {
    id: dbReward.id,
    name: dbReward.name,
    pointsRequired: dbReward.pointsRequired,
    description: dbReward.description,
    createdAt: dbReward.createdAt instanceof Date
      ? dbReward.createdAt
      : new Date(dbReward.createdAt),
  }
}