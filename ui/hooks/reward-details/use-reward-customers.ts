import { useCallback, useState } from 'react';

import {
  makeRedeemReward,
  makeUndoRedeemReward,
  makeListCustomersEligibleToRedeemReward,
  makeListCustomersWhoRedeemedReward,
} from '@/core/factories/customer-reward';
import { CustomerDto } from '@/core/application/dtos/customers';
import { CustomerRewardRedemptionDto } from '@/core/application/dtos/customer-rewards';

export function useRewardCustomers(rewardId: number) {
  const [eligibleCustomers, setEligibleCustomers] = useState<CustomerDto[]>([]);
  const [customersWhoRedeemed, setCustomersWhoRedeemed] = useState<
    CustomerRewardRedemptionDto[]
  >([]);

  const fetchEligibleCustomers = useCallback(async () => {
    const data =
      await makeListCustomersEligibleToRedeemReward().execute(rewardId);
    setEligibleCustomers(data);
  }, [rewardId]);

  const fetchCustomersWhoRedeemed = useCallback(async () => {
    const data = await makeListCustomersWhoRedeemedReward().execute(rewardId);
    setCustomersWhoRedeemed(data);
  }, [rewardId]);

  const redeem = async (customerId: number) => {
    await makeRedeemReward().execute({ customerId, rewardId });
    await Promise.all([fetchEligibleCustomers(), fetchCustomersWhoRedeemed()]);
  };

  const undoRedeem = async (customerId: number) => {
    await makeUndoRedeemReward().execute({ customerId, rewardId });
    await Promise.all([fetchEligibleCustomers(), fetchCustomersWhoRedeemed()]);
  };

  return {
    eligibleCustomers,
    fetchEligibleCustomers,
    customersWhoRedeemed,
    fetchCustomersWhoRedeemed,
    redeem,
    undoRedeem,
  };
}
