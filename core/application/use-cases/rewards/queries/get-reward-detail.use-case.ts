import { RewardDto } from "@/core/application/dtos/rewards";
import { GetRewardDetail } from "@/core/application/interfaces/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export interface GetRewardDetailDep {
  rewardRepo: RewardRepository,
  rewardToDtoMapper: Mapper<Reward, RewardDto>,
}

export class GetRewardDetailUseCase implements GetRewardDetail {
  private readonly rewardRepo: RewardRepository;
  private readonly rewardToDtoMapper: Mapper<Reward, RewardDto>;

  constructor(deps: GetRewardDetailDep) {
    this.rewardRepo = deps.rewardRepo;
    this.rewardToDtoMapper = deps.rewardToDtoMapper;
  }

  async execute(id: number): Promise<RewardDto> {
    const reward = await this.rewardRepo.getById(id);
    return this.rewardToDtoMapper.map(reward);
  }
}