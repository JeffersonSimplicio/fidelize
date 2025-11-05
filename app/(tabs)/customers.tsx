import { Link, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCustomers } from "@/ui/hooks/customers/use-customers";
import { useCustomerList } from "@/ui/hooks/customers/use-customer-list";

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
      fetchCustomers();
    }, [fetchCustomers])
  );

  return (
    <View className="flex-1 bg-white px-4 pt-4">
      <Text className="text-xl font-semibold mb-3 text-gray-900">
        Lista de Clientes
      </Text>

      {/* Campo de pesquisa */}
      <TextInput
        placeholder="Buscar por nome..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        className="border border-gray-300 p-2 rounded-lg mb-3 text-gray-800"
        placeholderTextColor="#888"
      />

      {/* Seletor de ordenação */}
      <View className="border border-gray-300 rounded-md mb-3 overflow-hidden">
        <Picker
          selectedValue={sortOption}
          onValueChange={(v) => setSortOption(v)}
          dropdownIconColor="#2563EB"
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
          <Link href={`/customers/${item.id}`} asChild>
            <TouchableOpacity className="p-3 mb-2 bg-gray-100 rounded-lg active:bg-gray-200">
              <Text className="text-base font-semibold text-gray-800">
                {item.name}
              </Text>
              <Text className="text-gray-600">{item.points} pontos</Text>
            </TouchableOpacity>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View className="items-center mt-6">
            <Text className="text-gray-500">Nenhum cliente cadastrado.</Text>
          </View>
        )}
      />

      {/* Botão flutuante de adicionar cliente */}
      <Link href="/customers/create" asChild>
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-600 w-14 h-14 rounded-full items-center justify-center shadow-lg active:opacity-80"
          accessibilityLabel="Adicionar cliente"
        >
          <AntDesign name="user-add" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
