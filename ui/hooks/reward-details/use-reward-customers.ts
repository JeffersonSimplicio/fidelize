import {
  listCustomersWhoRedeemedReward,
  listEligibleCustomersForReward,
  redeemReward,
  undoRedeemReward
} from "@/core/composition/customer-rewards";
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

  const redeem = async (customerId: number) => {
    await redeemReward.execute(customerId, rewardId);
    await Promise.all([
      fetchEligibleCustomers(),
      fetchCustomersWhoRedeemed()
    ]);
  };

  const undoRedeem = async (customerId: number) => {
    await undoRedeemReward.execute(customerId, rewardId);
    await Promise.all([
      fetchEligibleCustomers(),
      fetchCustomersWhoRedeemed()
    ]);
  };

  return {
    eligibleCustomers,
    fetchEligibleCustomers,
    customersWhoRedeemed,
    fetchCustomersWhoRedeemed,
    redeem,
    undoRedeem
  };
}