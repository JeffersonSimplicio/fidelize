import { useRewardData } from "@/ui/hooks/reward-details/use-reward-data";
import { useRewardCustomers } from "@/ui/hooks/reward-details/use-reward-customers";
import { useCallback } from "react";

export function useRewardDetails(rewardId: number, onDeleteSuccess: () => void) {
  const { reward, fetchReward, handleDelete } = useRewardData(
    rewardId,
    onDeleteSuccess
  );

  const {
    eligibleCustomers,
    fetchEligibleCustomers,
    customersWhoRedeemed,
    fetchCustomersWhoRedeemed,
    redeem,
    undoRedeem
  } = useRewardCustomers(rewardId);

  const reloadAll = useCallback(() => {
    fetchReward();
    fetchEligibleCustomers();
    fetchCustomersWhoRedeemed();
  }, [fetchReward, fetchEligibleCustomers, fetchCustomersWhoRedeemed]);

  return {
    reward,
    eligibleCustomers,
    customersWhoRedeemed,
    reloadAll,
    handleDelete,
    redeem,
    undoRedeem
  };
}