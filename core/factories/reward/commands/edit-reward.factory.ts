import { EditReward } from "@/core/application/interfaces/rewards";
import { EditRewardUseCase } from "@/core/application/use-cases/rewards";
import { db } from "@/core/infrastructure/database/drizzle/db";
import { rewards } from '@/core/infrastructure/database/drizzle/schema';
import { DbRewardToDomainMapper, RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";
import { RewardRepositoryDrizzle } from "@/core/infrastructure/repositories/drizzle/commands";
import { editRewardSchema } from "@/core/infrastructure/validation/zod/schemas/rewards";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";

export function makeEditReward(): EditReward {
  const mapperToDomain = new DbRewardToDomainMapper();
  const rewardRepo = new RewardRepositoryDrizzle(db, rewards, mapperToDomain);
  const validator = new ZodValidation(editRewardSchema);
  const mapperToDto = new RewardEntityToDtoMapper();
  return new EditRewardUseCase(rewardRepo, validator, mapperToDto);
}