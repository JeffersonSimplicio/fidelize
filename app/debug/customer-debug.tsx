import { Link, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { makeListCustomers } from '@/core/factories/customer';
import { CustomerDto } from '@/core/application/dtos/customers';
import { formatDate } from '@/ui/utils/format-date';

export default function CustomersDebugScreen() {
  const [customers, setCustomers] = useState<CustomerDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCustomers = useCallback(async () => {
    const customers = await makeListCustomers().execute();
    setCustomers(customers);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void fetchCustomers();
    }, [fetchCustomers]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Customers Debug</Text>

      <FlatList
        data={customers}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.field}>ID: {item.id}</Text>
            <Text style={styles.field}>Phone: {item.phone}</Text>
            <Text style={styles.field}>Points: {item.points}</Text>
            <Text style={styles.field}>
              Created At: {formatDate(item.createdAt)}
            </Text>
            <Text style={styles.field}>
              Last Visit: {formatDate(item.lastVisitAt)}
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ color: '#666' }}>Nenhum cliente cadastrado.</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.nav}>
        <Text style={styles.navTitle}>🔗 Navegação</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Link href={'/'} style={styles.navLink}>
            <Text style={styles.navText}>Home</Text>
          </Link>
          <Link href={'/debug/customer-debug'} style={styles.navLink}>
            <Text style={styles.navText}>Customers</Text>
          </Link>
          <Link href={'/debug/reward-debug'} style={styles.navLink}>
            <Text style={styles.navText}>Rewards</Text>
          </Link>
          <Link href={'/debug/customer-rewards-debug'} style={styles.navLink}>
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
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  field: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  nav: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  navLink: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
  },
  navText: {
    fontSize: 14,
    color: '#000',
  },
});
