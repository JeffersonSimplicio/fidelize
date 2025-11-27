import { Link, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AntDesign from '@expo/vector-icons/AntDesign';

import { useCustomers } from '@/ui/hooks/customers/use-customers';
import { useCustomerList } from '@/ui/hooks/customers/use-customer-list';
import { ListItemCard } from '@/ui/components/list-item-card';

export default function CustomersScreen() {
  const { customers, refreshing, onRefresh, fetchCustomers } = useCustomers();
  const {
    filteredAndSorted,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
  } = useCustomerList(customers);

  useFocusEffect(
    useCallback(() => {
      void fetchCustomers();
    }, [fetchCustomers]),
  );

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <Text className="mb-3 text-xl font-semibold text-gray-900">
        Lista de Clientes
      </Text>

      {/* Campo de pesquisa */}
      <TextInput
        placeholder="Buscar por nome..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        className="mb-3 rounded-lg border border-gray-300 p-2 text-gray-800"
        placeholderTextColor="#888"
      />

      {/* Seletor de ordenação */}
      <View className="mb-3 overflow-hidden rounded-md border border-gray-300">
        <Picker
          selectedValue={sortOption}
          onValueChange={(v) => setSortOption(v)}
          style={{ color: 'black' }}
        >
          <Picker.Item label="Mais novo" value="createdAt-desc" />
          <Picker.Item label="Mais antigo" value="createdAt-asc" />
          <Picker.Item label="Visita mais recente" value="lastVisitAt-desc" />
          <Picker.Item label="Visita mais antiga" value="lastVisitAt-asc" />
          <Picker.Item label="Nome (A-Z)" value="name-asc" />
          <Picker.Item label="Nome (Z-A)" value="name-desc" />
          <Picker.Item label="Pontos (menor → maior)" value="points-asc" />
          <Picker.Item label="Pontos (maior → menor)" value="points-desc" />
        </Picker>
      </View>

      {/* Lista de clientes */}
      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <ListItemCard
            href={`/customers/${item.id}`}
            title={item.name}
            subtitle={`${item.points} pontos`}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View className="mt-6 items-center">
            <Text className="text-gray-500">Nenhum cliente cadastrado.</Text>
          </View>
        )}
      />

      {/* Botão flutuante de adicionar cliente */}
      <Link href="/customers/create" asChild>
        <TouchableOpacity
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg active:opacity-80"
          accessibilityLabel="Adicionar cliente"
        >
          <AntDesign name="user-add" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
