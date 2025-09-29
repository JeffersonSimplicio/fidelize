import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IEditRewardDetail } from "@/core/application/interfaces/rewards/edit-reward-detail";
import { UpdateRewardDto } from "@/core/application/dtos/rewards/update-reward.dto";


export class EditRewardDetailUseCase implements IEditRewardDetail {
  constructor(private readonly repo: IRewardRepository) { }

  async execute(id: number, data: UpdateRewardDto): Promise<Reward | null> {
    const reward = await this.repo.findById(id);
    if (!reward) return null;
 
    if (data.name !== undefined) reward.name = data.name;
    if (data.description !== undefined) reward.description = data.description;
    if (data.pointsRequired !== undefined) reward.pointsRequired = data.pointsRequired;

    const updateReward = await this.repo.update(reward);

    return updateReward;
  }
}