import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { IEditRewardDetail } from "@/core/application/interfaces/rewards/edit-reward-detail";
import { UpdateRewardDto } from "@/core/application/dtos/rewards/update-reward.dto";


export class EditRewardDetailUseCase implements IEditRewardDetail {
  constructor(private readonly repo: IRewardRepository) { }

  async execute(id: number, data: UpdateRewardDto): Promise<Reward | null> {
    const customer = await this.repo.findById(id);

    if (!customer) return null;

    const updateData: UpdateRewardDto = { ...data };

    const reward = await this.repo.update(id, updateData);

    return reward;
  }
}