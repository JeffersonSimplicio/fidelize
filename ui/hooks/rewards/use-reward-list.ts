import { Reward } from "@/core/domain/rewards/reward.entity";
import { useListFilter } from "@/ui/hooks/use-list-filter";
import { useRewardSort } from "@/ui/hooks/rewards/use-reward-sort";
import { useMemo } from "react";

export function useRewardList(rewards: Reward[]) {
  const { searchTerm, setSearchTerm, filterList } = useListFilter<Reward>("name");
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