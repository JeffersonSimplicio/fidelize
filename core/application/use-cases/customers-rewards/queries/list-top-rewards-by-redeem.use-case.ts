import { IListTopRewardsByRedeem } from "@/core/application/interfaces/customers-rewards";
import { ICustomerRewardRepository } from "@/core/domain/customer-reward/customer-reward.repository.interface";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { IRewardRepository } from "@/core/domain/rewards/reward.repository.interface";

export class ListTopRewardsByRedeemUseCase implements IListTopRewardsByRedeem {
  private static MIN_LIMIT = 1;

  constructor(
    private readonly rewardRepo: IRewardRepository,
    private readonly customerRewardRepo: ICustomerRewardRepository,
  ) { }

  async execute(limit: number): Promise<{ reward: Reward; amount: number; }[]> {
    const listCR = await this.customerRewardRepo.findAll();

    const countMap = new Map<number, number>(); //<id, amount>

    for (const cr of listCR) {
      const id = cr.rewardId;
      countMap.set(id, (countMap.get(id) ?? 0) + 1);
    }

    const sorted = Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1]);

    const effectiveLimit = Math.max(limit, ListTopRewardsByRedeemUseCase.MIN_LIMIT);

    const topCR = sorted.slice(0, effectiveLimit);

    const result = await Promise.all(
      topCR.map(async ([rewardId, amount]) => {
        const reward = await this.rewardRepo.findById(rewardId);
        if (!reward) throw new Error(`Reward ${rewardId} não encontrado`);
        return {
          reward,
          amount,
        };
      })
    );

    return result;
  }
}