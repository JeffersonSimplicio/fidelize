import { useListFilter } from "@/ui/hooks/use-list-filter";
import { useCustomerSort } from "@/ui/hooks/customers/use-customer-sort";
import { useMemo } from "react";
import { CustomerDto } from "@/core/application/dtos/customers";

export function useCustomerList(customers: CustomerDto[]) {
  const { searchTerm, setSearchTerm, filterList } = useListFilter<CustomerDto>("name");
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