import { EditReward } from "@/core/application/interfaces/rewards";
import { EditRewardUseCase } from "@/core/application/use-cases/rewards";
import { makeRewardRepositoryDrizzle } from "@/core/factories/repositories";
import { RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";
import { editRewardSchema } from "@/core/infrastructure/validation/zod/schemas/rewards";
import { ZodValidation } from "@/core/infrastructure/validation/zod/zod.validation";

export function makeEditReward(): EditReward {
  const rewardRepo = makeRewardRepositoryDrizzle();
  const validator = new ZodValidation(editRewardSchema);
  const mapperToDto = new RewardEntityToDtoMapper();
  return new EditRewardUseCase(rewardRepo, validator, mapperToDto);
}