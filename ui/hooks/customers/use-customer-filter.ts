import { Customer } from "@/core/domain/customers/customer.entity";
import { useCallback, useState } from "react";

export function useCustomerFilter() {
  const [searchTerm, setSearchTerm] = useState("");

  const filterCustomers = useCallback(
    (list: Customer[]) => {
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
    filterCustomers,
  };
}