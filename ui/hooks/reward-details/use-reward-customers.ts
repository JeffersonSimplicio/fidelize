import { listCustomersWhoRedeemedReward } from "@/core/composition/customer-rewards/list-customers-who-redeemed-reward";
import { listEligibleCustomersForReward } from "@/core/composition/customer-rewards/list-eligible-customers-reward";
import { Customer } from "@/core/domain/customers/customer.entity";
import { useCallback, useState } from "react";

export function useRewardCustomers(rewardId: number) {
  const [eligibleCustomers, setEligibleCustomers] = useState<Customer[]>([]);
  const [customersWhoRedeemed, setCustomersWhoRedeemed] = useState<Customer[]>([]);

  const fetchEligibleCustomers = useCallback(async () => {
    const data = await listEligibleCustomersForReward
      .execute(rewardId);
    setEligibleCustomers(data);
  }, [rewardId]);

  const fetchCustomersWhoRedeemed = useCallback(async () => {
    const data = await listCustomersWhoRedeemedReward
      .execute(rewardId);
    setCustomersWhoRedeemed(data);
  }, [rewardId]);

  return {
    eligibleCustomers,
    fetchEligibleCustomers,
    customersWhoRedeemed,
    fetchCustomersWhoRedeemed,
  };
}