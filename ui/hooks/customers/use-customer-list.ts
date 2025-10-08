import { Customer } from "@/core/domain/customers/customer.entity";
import { useCustomerFilter } from "@/ui/hooks/customers/use-customer-filter";
import { useCustomerSort } from "@/ui/hooks/customers/use-customer-sort";
import { useMemo } from "react";

export function useCustomerList(customers: Customer[]) {
  const { searchTerm, setSearchTerm, filterCustomers } = useCustomerFilter();
  const { sortOption, setSortOption, sortCustomers } = useCustomerSort();

  const filteredAndSorted = useMemo(() => {
    const filtered = filterCustomers(customers);
    return sortCustomers(filtered);
  }, [customers, filterCustomers, sortCustomers]);

  return {
    filteredAndSorted,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
  };
}