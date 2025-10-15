import { GetRewardDetail } from "@/core/application/interfaces/rewards";
import { GetRewardDetailUseCase } from "@/core/application/use-cases/rewards";
import {
  DbRewardToDomainMapper,
  RewardEntityToDtoMapper
} from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';

export function makeGetRewardDetail(): GetRewardDetail {
  const dbRewardToDomainMapper = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle({
    dbClient: db,
    rewardTable: rewards,
    rewardToDomainMapper: dbRewardToDomainMapper
  });
  const mapperToDto = new RewardEntityToDtoMapper();
  return new GetRewardDetailUseCase(rewardRepo, mapperToDto);
}