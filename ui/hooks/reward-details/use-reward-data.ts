import { disableReward, getRewardDetail } from "@/core/composition/rewards";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useRewardData(rewardId: number, onDeleteSuccess: () => void) {
  const [reward, setReward] = useState<Reward | null>(null);

  const fetchReward = useCallback(async () => {
    const fetchedReward = await getRewardDetail.execute(rewardId);
    setReward(fetchedReward ?? null);
  }, [rewardId]);

  const handleDelete = async () => {
    await disableReward.execute(rewardId);
    Alert.alert("Recompensa deletada com sucesso!");
    onDeleteSuccess();
  };

  return { reward, fetchReward, handleDelete }
}