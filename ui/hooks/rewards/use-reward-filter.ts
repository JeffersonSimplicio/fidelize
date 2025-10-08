import { Reward } from "@/core/domain/rewards/reward.entity";
import { useCallback, useState } from "react";

export function useRewardFilter() {
  const [searchTerm, setSearchTerm] = useState("");

  const filterRewards = useCallback(
    (list: Reward[]) => {
      if (!searchTerm.trim()) return list;
      return list.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [searchTerm]
  );

  return {
    searchTerm,
    setSearchTerm,
    filterRewards,
  };
}