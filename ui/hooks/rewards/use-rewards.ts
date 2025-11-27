import { useCallback, useState } from 'react';

import { makeListRewardsActive } from '@/core/factories/reward';
import { RewardDto } from '@/core/application/dtos/rewards';

export function useRewards() {
  const [rewards, setRewards] = useState<RewardDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRewards = useCallback(async () => {
    const rewards = await makeListRewardsActive().execute();
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
