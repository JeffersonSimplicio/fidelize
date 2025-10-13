import { CreateCustomerRewardDto, CustomerRewardDto } from "@/core/application/dtos/customer-rewards";
import { RedeemReward } from "@/core/application/interfaces/customers-rewards";
import { CustomerReward } from "@/core/domain/customer-rewards/customer-reward.entity";
import { CustomerRewardRepository } from "@/core/domain/customer-rewards/customer-reward.repository.interface";
import { CustomerRepository } from "@/core/domain/customers/customer.repository.interface";
import { RewardRepository } from "@/core/domain/rewards/reward.repository.interface";
import { RewardStatus } from "@/core/domain/rewards/reward.status";
import { Mapper } from "@/core/domain/shared/mappers/mapper.interface";

export class RedeemRewardUseCase implements RedeemReward {
  constructor(
    private readonly rewardRepo: RewardRepository,
    private readonly customerRepo: CustomerRepository,
    private readonly customerRewardRepo: CustomerRewardRepository,
    private readonly mapper: Mapper<CustomerReward, CustomerRewardDto>
  ) { }

  async execute({
    customerId,
    rewardId
  }: CreateCustomerRewardDto): Promise<CustomerRewardDto> {
    const customer = await this.customerRepo.getById(customerId);

    const reward = await this.rewardRepo.getById(rewardId);

    if (reward.isActive === RewardStatus.Inactive) throw new Error("Não é possível resgatar uma recompensas desativadas.");

    if (customer.points < reward.pointsRequired) throw new Error(`${customer.name} não tem pontos suficientes para resgatar ${reward.name}.`);

    const hasAlreadyRedeemed = await this.customerRewardRepo.alreadyRedeemed(customerId, rewardId);

    if (hasAlreadyRedeemed) throw new Error(`${customer.name} já resgatou ${reward.name}.`);

    const newCustomerReward = new CustomerReward({ customerId, rewardId });

    const customerReward = await this.customerRewardRepo.create(newCustomerReward);

    return this.mapper.map(customerReward);

  }
}