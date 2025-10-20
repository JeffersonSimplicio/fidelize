import { GetRewardDetail } from "@/core/application/interfaces/rewards";
import { GetRewardDetailUseCase } from "@/core/application/use-cases/rewards";
import { makeRewardRepositoryDrizzle } from "@/core/factories/repositories";
import { RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeGetRewardDetail(): GetRewardDetail {
  const rewardRepo = makeRewardRepositoryDrizzle();
  const mapperToDto = new RewardEntityToDtoMapper();
  return new GetRewardDetailUseCase(rewardRepo, mapperToDto);
}