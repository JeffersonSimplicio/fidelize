import { CreateRewardDto, RewardDto } from "@/core/application/dtos/rewards";
import { RegisterReward } from "@/core/application/interfaces/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Validation } from "@/core/domain/validation/validation.interface";

export interface RegisterRewardDep {
  rewardRepo: RewardRepository,
  createRewardValidator: Validation<CreateRewardDto>,
  rewardToDtoMapper: Mapper<Reward, RewardDto>,
}

export class RegisterRewardUseCase implements RegisterReward {
  private readonly rewardRepo: RewardRepository;
  private readonly createRewardValidator: Validation<CreateRewardDto>;
  private readonly rewardToDtoMapper: Mapper<Reward, RewardDto>;

  constructor(deps: RegisterRewardDep) {
    this.rewardRepo = deps.rewardRepo;
    this.createRewardValidator = deps.createRewardValidator;
    this.rewardToDtoMapper = deps.rewardToDtoMapper;
  }

  async execute(data: CreateRewardDto): Promise<RewardDto> {
    const errors = this.createRewardValidator.validate(data);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }

    const rewardCreate = new Reward({
      name: data.name,
      description: data.description,
      pointsRequired: data.pointsRequired,
    })

    const reward = await this.rewardRepo.create(rewardCreate);

    return this.rewardToDtoMapper.map(reward);
  }
}