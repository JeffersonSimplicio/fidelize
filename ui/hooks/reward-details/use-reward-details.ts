import { useRewardData } from "@/ui/hooks/reward-details/use-reward-data";
import { useRewardCustomers } from "@/ui/hooks/reward-details/use-reward-customers";
import { useCallback } from "react";

export function useRewardDetails(rewardId: number, onDeleteSuccess: () => void) {
  const { reward, fetchReward, handleDelete } = useRewardData(
    rewardId,
    onDeleteSuccess
  );

  const { eligibleCustomers, fetchRewardCustomers } = useRewardCustomers(rewardId);

  const reloadAll = useCallback(() => {
    fetchReward();
    fetchRewardCustomers();
  }, [fetchReward, fetchRewardCustomers]);

  return {
    reward,
    eligibleCustomers,
    reloadAll,
    handleDelete,
  };
}