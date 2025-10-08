import { Link, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { FlatList, RefreshControl, Text, TextInput, View } from "react-native";
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
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Lista de Clientes
      </Text>

      {/* Campo de pesquisa */}
      <TextInput
        placeholder="Buscar por nome..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          borderRadius: 6,
          marginBottom: 10,
        }}
      />

      {/* Seletor de ordenação */}
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          marginBottom: 10,
        }}
      >
        <Picker
          selectedValue={sortOption}
          onValueChange={(v) => setSortOption(v)}
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

      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <Link href={`/customers/${item.id}`}>
            <Text>
              {item.name} - {item.points} pontos
            </Text>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Nenhum cliente cadastrado.</Text>
          </View>
        )}
      />
      <Link href={"/customers/create"}>
        <AntDesign name="user-add" size={24} color="black" />
      </Link>
    </View>
  );
}
