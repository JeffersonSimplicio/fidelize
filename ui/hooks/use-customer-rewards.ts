import { listAvailableRewardsForCustomer } from "@/core/composition/customer-rewards/list-available-rewards-customer";
import { listRedeemedRewardsForCustomer } from "@/core/composition/customer-rewards/list-redeemed-rewards-customer";
import { redeemReward } from "@/core/composition/customer-rewards/redeem-reward";
import { undoRedeemReward } from "@/core/composition/customer-rewards/undo-redeem-reward";
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