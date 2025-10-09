import { listCustomerRewards } from "@/core/composition/customer-rewards/queries/list-customer-rewards";
import { CustomerReward } from "@/core/domain/customerRewards/customerReward.entity";
import { Link, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CustomerRewardsDebugScreen() {
  const [customerRewards, setCustomerRewards] = useState<CustomerReward[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomerRewards = useCallback(async () => {
    const rewards = await listCustomerRewards.execute();
    setCustomerRewards(rewards);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCustomerRewards();
    }, [fetchCustomerRewards])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCustomerRewards();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Customer Rewards Debug</Text>

      <FlatList
        data={customerRewards}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardId}>#{item.id}</Text>
              <Text style={styles.date}>
                {item.redeemedAt
                  ? item.redeemedAt.toISOString()
                  : "Not redeemed"}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>👤 Customer</Text>
              <Text style={styles.field}>ID: {item.customerId}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🏆 Reward</Text>
              <Text style={styles.field}>ID: {item.rewardId}</Text>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text style={{ color: "#666" }}>
              Nenhuma relação de recompensa encontrada.
            </Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.nav}>
        <Text style={styles.navTitle}>🔗 Navegação</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Link href={"/"} style={styles.navLink}>
            <Text style={styles.navText}>Home</Text>
          </Link>
          <Link href={"/debug/customer-debug"} style={styles.navLink}>
            <Text style={styles.navText}>Customers</Text>
          </Link>
          <Link href={"/debug/reward-debug"} style={styles.navLink}>
            <Text style={styles.navText}>Rewards</Text>
          </Link>
          <Link href={"/debug/customer-rewards-debug"} style={styles.navLink}>
            <Text style={styles.navText}>CustomerRewards</Text>
          </Link>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardId: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  section: {
    marginTop: 6,
    backgroundColor: "#f1f3f5",
    padding: 8,
    borderRadius: 6,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
    color: "#333",
  },
  field: {
    fontSize: 13,
    color: "#444",
  },
  nav: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  navLink: {
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  navText: {
    fontSize: 14,
    color: "#000",
  },
});
