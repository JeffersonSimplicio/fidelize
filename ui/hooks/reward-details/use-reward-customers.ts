import { listEligibleCustomersForReward } from "@/core/composition/customer-rewards/list-eligible-customers-reward";
import { Customer } from "@/core/domain/customers/customer.entity";
import { useCallback, useState } from "react";

export function useRewardCustomers(rewardId: number) {
  const [eligibleCustomers, setEligibleCustomers] = useState<Customer[]>([]);

  const fetchRewardCustomers = useCallback(async () => {
    const data = await listEligibleCustomersForReward
      .execute(rewardId);
    setEligibleCustomers(data);
  }, [rewardId]);

  return {
    eligibleCustomers,
    fetchRewardCustomers,
  };
}