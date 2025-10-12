import { CreateRewardDto } from "@/core/application/dtos/rewards/create-reward.dto";
import { RewardDto } from "@/core/application/dtos/rewards/reward.dto";
import { RegisterReward } from "@/core/application/interfaces/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";
import { Validation } from "@/core/domain/validation/validation.interface";


export class RegisterRewardUseCase implements RegisterReward {
  constructor(
    private readonly rewardRepo: RewardRepository,
    private readonly validator: Validation<CreateRewardDto>,
    private readonly mapper: Mapper<Reward, RewardDto>,
  ) { }

  async execute(data: CreateRewardDto): Promise<RewardDto> {
    const errors = this.validator.validate(data);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }

    const rewardCreate = new Reward({
      name: data.name,
      description: data.description,
      pointsRequired: data.pointsRequired,
    })

    const reward = await this.rewardRepo.create(rewardCreate);

    return this.mapper.map(reward);
  }
}