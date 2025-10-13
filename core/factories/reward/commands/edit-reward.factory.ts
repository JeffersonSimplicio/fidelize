import { editRewardSchema } from "@/core/infrastructure/validation/zod/schemas/rewards";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/write/reward.repository";
import { DbRewardToDomainMapper, RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";
import { EditRewardUseCase } from "@/core/application/use-cases/rewards";
import { EditReward } from "@/core/application/interfaces/rewards";

export function makeEditReward(): EditReward {
  const mapperToDomain = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle(db, rewards, mapperToDomain);
  const validator = new ZodValidation(editRewardSchema);
  const mapperToDto = new RewardEntityToDtoMapper();
  return new EditRewardUseCase(rewardRepo, validator, mapperToDto);
}