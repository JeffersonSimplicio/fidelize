import { UpdateRewardDto } from "@/core/application/dtos/rewards/update-reward.dto";
import { IEditRewardDetail } from "@/core/application/interfaces/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { ValidationException } from "@/core/domain/shared/errors/validation-exception.error";
import { IValidation } from "@/core/domain/validation/validation.interface";


export class EditRewardDetailUseCase implements IEditRewardDetail {
  constructor(
    private readonly repo: IRewardRepository,
    private readonly validator: IValidation<UpdateRewardDto>
  ) { }

  async execute(id: number, data: UpdateRewardDto): Promise<Reward | null> {
    const errors = this.validator.validate(data);
    if (errors.length > 0) {
      throw new ValidationException(errors);
    }
    const existing = await this.repo.findById(id);
    if (!existing) return null;

    const newName = data.name ?? existing.name;
    const newPointsRequired = data.pointsRequired ?? existing.pointsRequired;
    const newDescription = data.description ?? existing.description;

    const updateRewards = new Reward({
      name: newName,
      pointsRequired: newPointsRequired,
      description: newDescription,
    })
    updateRewards.setId(existing.id!)

    return await this.repo.update(updateRewards);
  }
}