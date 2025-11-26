import { useCallback, useState } from 'react';

export function useListFilter<T>(key: keyof T) {
  const [searchTerm, setSearchTerm] = useState('');

  const filterList = useCallback(
    (list: T[]) => {
      if (!searchTerm.trim()) return list;
      return list.filter((item) => {
        const value = item[key];
        return (
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    },
    [searchTerm, key],
  );

  return {
    searchTerm,
    setSearchTerm,
    filterList,
  };
}
