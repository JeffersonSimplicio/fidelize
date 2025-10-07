import { IRewardRepository } from "@/core/domain/rewards/reward.repository";
import { ICustomerRepository } from "@/core/domain/customers/customer.repository";
import { ICustomerRewardRepository } from "@/core/domain/customerRewards/customerReward.repository";
import { IRedeemReward } from "@/core/application/interfaces/customer-rewards/redeem-reward";
import { CustomerReward } from "@/core/domain/customerRewards/customerReward.entity";
import { RewardStatus } from "@/core/domain/rewards/reward.status";

export class RedeemRewardUseCase implements IRedeemReward {
  constructor(
    private readonly rewardRepo: IRewardRepository,
    private readonly customerRepo: ICustomerRepository,
    private readonly customerRewardRepo: ICustomerRewardRepository,
  ) { }

  async execute(customerId: number, rewardId: number): Promise<CustomerReward> {
    const customer = await this.customerRepo.findById(customerId);
    if (!customer) throw new Error("Usuário não encontrado!");

    const reward = await this.rewardRepo.findById(rewardId);
    if (!reward) throw new Error("Recompensa não encontrada!");

    if (reward.isActive === RewardStatus.Inactive) throw new Error("Não é possível resgatar uma recompensas desativadas.");

    if (customer.points < reward.pointsRequired) throw new Error(`${customer.name} não tem pontos suficientes para resgatar ${reward.name}.`);

    return await this.customerRewardRepo.create(
      new CustomerReward({ customerId, rewardId })
    );
  }
}