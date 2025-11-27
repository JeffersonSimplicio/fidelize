import { useCallback, useState } from 'react';

import { RewardDto } from '@/core/application/dtos';

type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'points-required-asc'
  | 'points-required-desc'
  | 'createdAt-asc'
  | 'createdAt-desc';

export function useRewardSort() {
  const [sortOption, setSortOption] = useState<SortOption>('createdAt-desc');

  const sortRewards = useCallback(
    (list: RewardDto[]) => {
      const sorted = [...list].map((c) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      }));
      switch (sortOption) {
        case 'name-asc':
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name-desc':
          return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'points-required-asc':
          return sorted.sort((a, b) => a.pointsRequired - b.pointsRequired);
        case 'points-required-desc':
          return sorted.sort((a, b) => b.pointsRequired - a.pointsRequired);
        case 'createdAt-asc':
          return sorted.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
          );
        case 'createdAt-desc':
          return sorted.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
          );
        default:
          return sorted;
      }
    },
    [sortOption],
  );

  return {
    sortOption,
    setSortOption,
    sortRewards,
  };
}
