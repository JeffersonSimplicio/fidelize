import { RewardDto } from "@/core/application/dtos/rewards";
import { Reward as RewardEntity } from "@/core/domain/rewards/reward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class RewardEntityToDtoMapper implements Mapper<
  RewardEntity,
  RewardDto
> {
  map(input: RewardEntity): RewardDto {
    return {
      id: input.id!,
      name: input.name,
      description: input.description,
      pointsRequired: input.pointsRequired,
      isActive: input.isActive === RewardStatus.Active,
      createAt: input.createdAt.toISOString(),
    }
  }
}