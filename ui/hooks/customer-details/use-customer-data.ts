import { deleteCustomer } from "@/core/composition/customers/delete-customer";
import { getCustomerDetail } from "@/core/composition/customers/get-customer-detail";
import { Customer } from "@/core/domain/customers/customer.entity";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export function useCustomerData(customerId: number, onDeleteSuccess: () => void) {
  const [customer, setCustomer] = useState<Customer | null>(null);

  const fetchCustomer = useCallback(async () => {
    const fetchedCustomer = await getCustomerDetail.execute(customerId);
    setCustomer(fetchedCustomer ?? null);
  }, [customerId]);

  const handleDelete = async () => {
    await deleteCustomer.execute(customerId);
    Alert.alert("Cliente deletado com sucesso!");
    onDeleteSuccess();
  };

  return { customer, fetchCustomer, handleDelete };
}