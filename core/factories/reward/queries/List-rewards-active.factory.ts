import { ListRewardsActive } from "@/core/application/interfaces/rewards";
import { ListRewardsActiveUseCase } from "@/core/application/use-cases/rewards";
import { makeRewardQueryRepositoryDrizzle } from "@/core/factories/repositories";
import { RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeListRewardsActive(): ListRewardsActive {
  const rewardQueryRepo = makeRewardQueryRepositoryDrizzle();
  const mapperToDto = new RewardEntityToDtoMapper();
  return new ListRewardsActiveUseCase(rewardQueryRepo, mapperToDto);
}