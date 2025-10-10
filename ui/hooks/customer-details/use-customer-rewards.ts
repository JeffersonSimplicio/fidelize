import {
  listAvailableRewardsForCustomer,
  listRedeemedRewardsForCustomer,
  redeemReward
} from "@/core/composition/customer-rewards";
import { undoRedeemReward } from "@/core/composition/customer-rewards/commands/undo-redeem-reward";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { useCallback, useState } from "react";

export function useCustomerRewards(customerId: number) {
  const [availableRewards, setAvailableRewards] = useState<Reward[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<Reward[]>([]);

  const fetchAvailableRewards = useCallback(async () => {
    const data = await listAvailableRewardsForCustomer
      .execute(customerId);
    setAvailableRewards(data);
  }, [customerId]);

  const fetchRedeemedRewards = useCallback(async () => {
    const data = await listRedeemedRewardsForCustomer
      .execute(customerId);
    setRedeemedRewards(data);
  }, [customerId]);

  const redeem = async (rewardId: number) => {
    await redeemReward.execute(customerId, rewardId);
    await fetchAvailableRewards();
    await fetchRedeemedRewards();
  };

  const undoRedeem = async (rewardId: number) => {
    await undoRedeemReward.execute(customerId, rewardId);
    await fetchAvailableRewards();
    await fetchRedeemedRewards();
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