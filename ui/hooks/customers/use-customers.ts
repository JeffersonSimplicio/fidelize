import { useCallback, useState } from 'react';

import { makeListCustomers } from '@/core/factories/customer';
import { CustomerDto } from '@/core/application/dtos/customers';

export function useCustomers() {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomers = useCallback(async () => {
    const customers = await makeListCustomers().execute();
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
