import { useCallback, useState } from 'react';

import {
  makeRedeemReward,
  makeUndoRedeemReward,
  makeListAvailableRewardsForCustomer,
  makeListRewardsRedeemedByCustomer,
} from '@/core/factories/customer-reward';
import { RewardDto } from '@/core/application/dtos/rewards';
import { CustomerRedeemedRewardDto } from '@/core/application/dtos/customer-rewards';

export function useCustomerRewards(customerId: number) {
  const [availableRewards, setAvailableRewards] = useState<RewardDto[]>([]);
  const [redeemedRewards, setRedeemedRewards] = useState<
    CustomerRedeemedRewardDto[]
  >([]);

  const fetchAvailableRewards = useCallback(async () => {
    const data =
      await makeListAvailableRewardsForCustomer().execute(customerId);
    setAvailableRewards(data);
  }, [customerId]);

  const fetchRedeemedRewards = useCallback(async () => {
    const data = await makeListRewardsRedeemedByCustomer().execute(customerId);
    setRedeemedRewards(data);
  }, [customerId]);

  const redeem = async (rewardId: number) => {
    await makeRedeemReward().execute({ customerId, rewardId });
    await Promise.all([fetchAvailableRewards(), fetchRedeemedRewards()]);
  };

  const undoRedeem = async (rewardId: number) => {
    await makeUndoRedeemReward().execute({ customerId, rewardId });
    await Promise.all([fetchAvailableRewards(), fetchRedeemedRewards()]);
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
