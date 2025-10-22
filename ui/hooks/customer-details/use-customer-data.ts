import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { makeDeleteCustomer, makeGetCustomerDetail } from "@/core/factories/customer";
import { CustomerDto } from "@/core/application/dtos/customers";

export function useCustomerData(customerId: number, onDeleteSuccess: () => void) {
  const [customer, setCustomer] = useState<CustomerDto>();

  const fetchCustomer = useCallback(async () => {
    const fetchedCustomer = await makeGetCustomerDetail().execute(customerId);
    setCustomer(fetchedCustomer);
  }, [customerId]);

  const handleDelete = async () => {
    await makeDeleteCustomer().execute(customerId);
    Alert.alert("Cliente deletado com sucesso!");
    onDeleteSuccess();
  };

  return { customer, fetchCustomer, handleDelete };
}