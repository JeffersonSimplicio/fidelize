import { listRewardsActive } from "@/core/composition/rewards/list-rewards-active";
import { Reward } from "@/core/domain/rewards/reward.entity";
import { useCallback, useState } from "react";

export function useRewards() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRewards = useCallback(async () => {
    const rewards = await listRewardsActive.execute();
    setRewards(rewards);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRewards();
    setRefreshing(false);
  };

  return {
    rewards,
    refreshing,
    onRefresh,
    fetchRewards,
  };
}