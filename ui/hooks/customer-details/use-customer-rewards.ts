import {
  listAvailableRewardsForCustomer,
  listRedeemedRewardsForCustomer,
  redeemReward
} from "@/core/composition/customer-rewards";
import { undoRedeemReward } from "@/core/composition/customer-rewards/commands/undo-redeem-reward";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { useCallback, useState } from "react";

export function useCustomerRewards(customerId: number) {
  const [availableRewards, setAvailableRewards] = useState<Reward[] | null>(null);
  const [redeemedRewards, setRedeemedRewards] = useState<Reward[] | null>(null);

  const fetchAvailableRewards = useCallback(async () => {
    const data = await listAvailableRewardsForCustomer
      .execute(customerId);
    setAvailableRewards(data ?? null);
  }, [customerId]);

  const fetchRedeemedRewards = useCallback(async () => {
    const data = await listRedeemedRewardsForCustomer
      .execute(customerId);
    setRedeemedRewards(data ?? null);
  }, [customerId]);

  const redeem = async (rewardId: number) => {
    await redeemReward.execute(customerId, rewardId);
    fetchAvailableRewards();
    fetchRedeemedRewards();
  };

  const undoRedeem = async (rewardId: number) => {
    await undoRedeemReward.execute(customerId, rewardId);
    fetchAvailableRewards();
    fetchRedeemedRewards();
  };

  return {
    availableRewards,
    redeemedRewards,
    fetchAvailableRewards,
    fetchRedeemedRewards,
    redeem,
    undoRedeem,
  };
}