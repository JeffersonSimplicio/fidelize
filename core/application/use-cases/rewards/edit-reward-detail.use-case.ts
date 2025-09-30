import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IEditRewardDetail } from "@/core/application/interfaces/rewards/edit-reward-detail";
import { UpdateRewardDto } from "@/core/application/dtos/rewards/update-reward.dto";


export class EditRewardDetailUseCase implements IEditRewardDetail {
  constructor(private readonly repo: IRewardRepository) { }

  async execute(id: number, data: UpdateRewardDto): Promise<Reward | null> {
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