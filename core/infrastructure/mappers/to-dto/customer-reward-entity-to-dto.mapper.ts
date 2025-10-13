import { CustomerRewardDto } from "@/core/application/dtos/customer-rewards";
import { CustomerReward as CustomerRewardEntity } from "@/core/domain/customer-rewards/customer-reward.entity";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class CustomerRewardEntityToDtoMapper implements Mapper<
  CustomerRewardEntity,
  CustomerRewardDto
> {
  map(input: CustomerRewardEntity): CustomerRewardDto {
    return {
      id: input.id!,
      customerId: input.customerId,
      rewardId: input.rewardId,
      redeemedAt: input.redeemedAt.toISOString(),
    }
  }
}