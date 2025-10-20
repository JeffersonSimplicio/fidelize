import { ListRewards } from "@/core/application/interfaces/rewards";
import { ListRewardsUseCase } from "@/core/application/use-cases/rewards";
import { makeRewardQueryRepositoryDrizzle } from "@/core/factories/repositories";
import { RewardEntityToDtoMapper } from "@/core/infrastructure/mappers";

export function makeListRewards(): ListRewards {
  const rewardQueryRepo = makeRewardQueryRepositoryDrizzle();
  const mapperToDto = new RewardEntityToDtoMapper();
  return new ListRewardsUseCase(rewardQueryRepo, mapperToDto);
}