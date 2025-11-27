import { RewardDto, UpdateRewardDto } from '@/core/application/dtos/rewards';
import { EditReward } from '@/core/application/interfaces/rewards';
import { Reward } from '@/core/domain/rewards/reward.entity';
import { RewardRepository } from '@/core/domain/rewards/reward.repository.interface';
import { ValidationException } from '@/core/domain/shared/errors/validation-exception.error';
import { Mapper } from '@/core/domain/shared/mappers/mapper.interface';
import { Validation } from '@/core/domain/validation/validation.interface';

export interface EditRewardDep {
  rewardRepo: RewardRepository;
  editRewardValidator: Validation<UpdateRewardDto>;
  rewardToDtoMapper: Mapper<UpdateRewardDto, RewardDto>;
}

export class EditRewardUseCase implements EditReward {
  private readonly rewardRepo: RewardRepository;
  private readonly editRewardValidator: Validation<UpdateRewardDto>;
  private readonly rewardToDtoMapper: Mapper<Reward, RewardDto>;

  constructor(deps: EditRewardDep) {
    this.rewardRepo = deps.rewardRepo;
    this.editRewardValidator = deps.editRewardValidator;
    this.rewardToDtoMapper = deps.rewardToDtoMapper;
  }

  async execute(id: number, data: UpdateRewardDto): Promise<RewardDto> {
    const errors = this.editRewardValidator.validate(data);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }

    const existing = await this.rewardRepo.getById(id);

    const newName = data.name ?? existing.name;
    const newPointsRequired = data.pointsRequired ?? existing.pointsRequired;
    const newDescription = data.description ?? existing.description;

    const updateRewards = new Reward({
      name: newName,
      pointsRequired: newPointsRequired,
      description: newDescription,
    });
    updateRewards.setId(existing.id!);

    const reward = await this.rewardRepo.update(updateRewards);

    return this.rewardToDtoMapper.map(reward);
  }
}
