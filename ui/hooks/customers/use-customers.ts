import { Customer } from "@/core/domain/customers/customer.entity";
import { useCallback, useState } from "react";
import { listCustomers } from "@/core/composition/customers/list-customers";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomers = useCallback(async () => {
    const customers = await listCustomers.execute();
    setCustomers(customers);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  return {
    customers,
    refreshing,
    onRefresh,
    fetchCustomers,
  };
}