import { useCallback } from 'react';

import { useRewardData } from '@/ui/hooks/reward-details/use-reward-data';
import { useRewardCustomers } from '@/ui/hooks/reward-details/use-reward-customers';

export function useRewardDetails(
  rewardId: number,
  onDeleteSuccess: () => void,
) {
  const { reward, fetchReward, handleDelete } = useRewardData(
    rewardId,
    onDeleteSuccess,
  );

  const {
    eligibleCustomers,
    fetchEligibleCustomers,
    customersWhoRedeemed,
    fetchCustomersWhoRedeemed,
    redeem,
    undoRedeem,
  } = useRewardCustomers(rewardId);

  const reloadAll = useCallback(() => {
    void fetchReward();
    void fetchEligibleCustomers();
    void fetchCustomersWhoRedeemed();
  }, [fetchReward, fetchEligibleCustomers, fetchCustomersWhoRedeemed]);

  return {
    reward,
    eligibleCustomers,
    customersWhoRedeemed,
    reloadAll,
    handleDelete,
    redeem,
    undoRedeem,
  };
}
