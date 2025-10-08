import { Link, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AntDesign from "@expo/vector-icons/AntDesign";
import { listCustomers } from "@/core/composition/customers/list-customers";
import { Customer } from "@/core/domain/customers/customer.entity";

type SortOption =
  | "name-asc"
  | "name-desc"
  | "points-asc"
  | "points-desc"
  | "createdAt-asc"
  | "createdAt-desc"
  | "lastVisitAt-asc"
  | "lastVisitAt-desc";

export default function CustomersScreen() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("createdAt-desc");

  const fetchCustomers = useCallback(async () => {
    const customers = await listCustomers.execute();
    setCustomers(customers);
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCustomers();
    }, [fetchCustomers])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  };

  const filterCustomers = useCallback(
    (list: Customer[]) => {
      if (!searchTerm.trim()) return list;
      return list.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [searchTerm]
  );

  const sortCustomers = useCallback(
    (list: Customer[]) => {
      const sorted = [...list];
      switch (sortOption) {
        case "name-asc":
          return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case "name-desc":
          return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case "points-asc":
          return sorted.sort((a, b) => a.points - b.points);
        case "points-desc":
          return sorted.sort((a, b) => b.points - a.points);
        case "createdAt-asc":
          return sorted.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
          );
        case "createdAt-desc":
          return sorted.sort(
            (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
          );
        case "lastVisitAt-asc":
          return sorted.sort(
            (a, b) => a.lastVisitAt.getTime() - b.lastVisitAt.getTime()
          );
        case "lastVisitAt-desc":
          return sorted.sort(
            (a, b) => b.lastVisitAt.getTime() - a.lastVisitAt.getTime()
          );
        default:
          return sorted;
      }
    },
    [sortOption]
  );

  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = filterCustomers(customers);
    return sortCustomers(filtered);
  }, [customers, filterCustomers, sortCustomers]);

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
        data={filteredAndSortedCustomers}
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
