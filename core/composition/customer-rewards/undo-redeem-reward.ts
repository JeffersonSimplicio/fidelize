import { db } from "@/core/infrastructure/database/drizzle/db";
import { customerRewards } from '@/core/infrastructure/database/drizzle/schema';
import { CustomerRewardRepositoryDrizzle } from "@/core/infrastructure/repositories/customer-reward.repository";
import { UndoRedeemRewardUseCase } from "@/core/application/use-cases/customer-rewards/undo-redeem-reward.use-case";

const customerRewardRepository = new CustomerRewardRepositoryDrizzle(db, customerRewards);

export const undoRedeemReward = new UndoRedeemRewardUseCase(
  customerRewardRepository
);