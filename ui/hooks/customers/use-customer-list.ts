import { Customer } from "@/core/domain/customers/customer.entity";
import { useListFilter } from "@/ui/hooks/use-list-filter";
import { useCustomerSort } from "@/ui/hooks/customers/use-customer-sort";
import { useMemo } from "react";

export function useCustomerList(customers: Customer[]) {
  const { searchTerm, setSearchTerm, filterList } = useListFilter<Customer>("name");
  const { sortOption, setSortOption, sortCustomers } = useCustomerSort();

  const filteredAndSorted = useMemo(() => {
    const filtered = filterList(customers);
    return sortCustomers(filtered);
  }, [customers, filterList, sortCustomers]);

  return {
    filteredAndSorted,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
  };
}