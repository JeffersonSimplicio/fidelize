import { Reward } from "@/core/domain/rewards/reward.entity";
import { useRewardFilter } from "@/ui/hooks/rewards/use-reward-filter";
import { useRewardSort } from "@/ui/hooks/rewards/use-reward-sort";
import { useMemo } from "react";

export function useRewardList(rewards: Reward[]) {
  const { searchTerm, setSearchTerm, filterRewards } = useRewardFilter();
  const { sortOption, setSortOption, sortRewards } = useRewardSort();

  const filteredAndSorted = useMemo(() => {
    const filtered = filterRewards(rewards);
    return sortRewards(filtered);
  }, [rewards, filterRewards, sortRewards]);

  return {
    filteredAndSorted,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
  };
}