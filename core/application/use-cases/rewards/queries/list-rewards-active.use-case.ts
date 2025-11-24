import { RewardDto } from "@/core/application/dtos/rewards";
import { ListRewardsActive } from "@/core/application/interfaces/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardQueryRepository } from "@/core/domain/rewards/reward.query.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export interface ListRewardsActiveDep {
  rewardQueryRepo: RewardQueryRepository,
  rewardToDtoMapper: Mapper<Reward, RewardDto>,
}

export class ListRewardsActiveUseCase implements ListRewardsActive {
  private readonly rewardQueryRepo: RewardQueryRepository;
  private readonly rewardToDtoMapper: Mapper<Reward, RewardDto>;

  constructor(deps: ListRewardsActiveDep) {
    this.rewardQueryRepo = deps.rewardQueryRepo;
    this.rewardToDtoMapper = deps.rewardToDtoMapper;
  }

  async execute(): Promise<RewardDto[]> {
    const listRewardsActive = await this.rewardQueryRepo.findAllActive();
    return listRewardsActive.map(r => this.rewardToDtoMapper.map(r));
  }
}