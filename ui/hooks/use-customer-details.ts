import { useCustomerData } from "@/ui/hooks/use-customer-data";
import { useCustomerRewards } from "@/ui/hooks/use-customer-rewards";
import { useCallback } from "react";

export function useCustomerDetails(customerId: number, onDeleteSuccess: () => void) {
  const { customer, fetchCustomer, handleDelete } = useCustomerData(
    customerId,
    onDeleteSuccess
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
    fetchCustomer();
    fetchAvailableRewards();
    fetchRedeemedRewards();
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