import { RewardDto } from '@/core/application/dtos/rewards';
import { ListRewards } from '@/core/application/interfaces/rewards';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardQueryRepository } from '@/core/domain/rewards/reward.query.repository.interface';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';

export interface ListRewardsDep {
  rewardQueryRepo: RewardQueryRepository;
  rewardToDtoMapper: Mapper<Reward, RewardDto>;
}

export class ListRewardsUseCase implements ListRewards {
  private readonly rewardQueryRepo: RewardQueryRepository;
  private readonly rewardToDtoMapper: Mapper<Reward, RewardDto>;

  constructor(deps: ListRewardsDep) {
    this.rewardQueryRepo = deps.rewardQueryRepo;
    this.rewardToDtoMapper = deps.rewardToDtoMapper;
  }

  async execute(): Promise<RewardDto[]> {
    const allRewards = await this.rewardQueryRepo.findAll();
    return allRewards.map((r) => this.rewardToDtoMapper.map(r));
  }
}
