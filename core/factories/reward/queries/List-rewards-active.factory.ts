import { ListRewardsActive } from "@/core/application/interfaces/rewards";
import { ListRewardsActiveUseCase } from "@/core/application/use-cases/rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import {
  DbRewardToDomainMapper,
  RewardEntityToDtoMapper
} from "@/core/infrastructure/mappers";
import {
  RewardQueryRepositoryDrizzle
} from "@/core/infrastructure/repositories/drizzle";

export function makeListRewardsActive(): ListRewardsActive {
  const mapperToDomain = new DbRewardToDomainMapper();
  const rewardQueryRepo = new RewardQueryRepositoryDrizzle(
    db,
    rewards,
    mapperToDomain
  );
  const mapperToDto = new RewardEntityToDtoMapper();
  return new ListRewardsActiveUseCase(rewardQueryRepo, mapperToDto);
}