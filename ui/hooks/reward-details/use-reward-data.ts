import { useCallback, useState } from 'react';
import { Alert } from 'react-native';

import {
  makeDisableReward,
  makeGetRewardDetail,
} from '@/core/factories/reward/';
import { RewardDto } from '@/core/application/dtos/rewards';

export function useRewardData(rewardId: number, onDeleteSuccess: () => void) {
  const [reward, setReward] = useState<RewardDto | null>(null);

  const fetchReward = useCallback(async () => {
    const fetchedReward = await makeGetRewardDetail().execute(rewardId);
    setReward(fetchedReward ?? null);
  }, [rewardId]);

  const handleDelete = async () => {
    await makeDisableReward().execute(rewardId);
    Alert.alert('Recompensa deletada com sucesso!');
    onDeleteSuccess();
  };

  return { reward, fetchReward, handleDelete };
}
