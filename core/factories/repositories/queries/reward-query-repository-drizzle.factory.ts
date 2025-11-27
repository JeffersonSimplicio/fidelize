import { RewardQueryRepository } from '@/core/domain/rewards/reward.query.repository.interface';
import { db } from '@/core/infrastructure/database/drizzle/db';
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { DbRewardToDomainMapper } from '@/core/infrastructure/mappers';
import { RewardQueryRepositoryDrizzle } from '@/core/infrastructure/repositories/drizzle';

export function makeRewardQueryRepositoryDrizzle(): RewardQueryRepository {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  return new RewardQueryRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    rewardToDomainMapper: dbRewardToDomainMapper,
  });
}
