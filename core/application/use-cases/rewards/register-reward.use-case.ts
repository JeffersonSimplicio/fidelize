import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IRegisterReward } from "@/core/application/interfaces/rewards/register-reward";
import { CreateRewardDto } from "@/core/application/dtos/rewards/create-reward.dto";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { IValidation } from "@/core/domain/validation/validation";


export class RegisterRewardUseCase implements IRegisterReward {
  constructor(
    private readonly repo: IRewardRepository,
    private readonly validator: IValidation<CreateRewardDto>
  ) { }

  async execute(data: CreateRewardDto): Promise<Reward> {
    const errors = this.validator.validate(data);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }

    const rewardCreate = new Reward({
      name: data.name,
      description: data.description,
      pointsRequired: data.pointsRequired,
    })

    const reward = await this.repo.create(rewardCreate);

    return reward;
  }
}