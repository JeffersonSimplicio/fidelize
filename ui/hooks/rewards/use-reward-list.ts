import { useMemo } from 'react';

import { useListFilter } from '@/ui/hooks/use-list-filter';
import { useRewardSort } from '@/ui/hooks/rewards/use-reward-sort';
import { RewardDto } from '@/core/application/dtos';

export function useRewardList(rewards: RewardDto[]) {
  const { searchTerm, setSearchTerm, filterList } =
    useListFilter<RewardDto>('name');
  const { sortOption, setSortOption, sortRewards } = useRewardSort();

  const filteredAndSorted = useMemo(() => {
    const filtered = filterList(rewards);
    return sortRewards(filtered);
  }, [rewards, filterList, sortRewards]);

  return {
    filteredAndSorted,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
  };
}
