import { useCallback } from 'react';

import { useCustomerData } from '@/ui/hooks/customer-details/use-customer-data';
import { useCustomerRewards } from '@/ui/hooks/customer-details/use-customer-rewards';

export function useCustomerDetails(
  customerId: number,
  onDeleteSuccess: () => void,
) {
  const { customer, fetchCustomer, handleDelete } = useCustomerData(
    customerId,
    onDeleteSuccess,
  );
  const {
    availableRewards,
    redeemedRewards,
    fetchAvailableRewards,
    fetchRedeemedRewards,
    redeem,
    undoRedeem,
  } = useCustomerRewards(customerId);

  const reloadAll = useCallback(() => {
    void fetchCustomer();
    void fetchAvailableRewards();
    void fetchRedeemedRewards();
  }, [fetchCustomer, fetchAvailableRewards, fetchRedeemedRewards]);

  return {
    customer,
    availableRewards,
    redeemedRewards,
    reloadAll,
    handleDelete,
    redeem,
    undoRedeem,
  };
}
