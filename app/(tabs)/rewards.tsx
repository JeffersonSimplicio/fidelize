import { FlatList, RefreshControl, Text, TextInput, View } from "react-native";
import { useCallback } from "react";
import { Link, useFocusEffect } from "expo-router";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRewards } from "@/ui/hooks/rewards/use-rewards";
import { useRewardList } from "@/ui/hooks/rewards/use-reward-list";
import { Picker } from "@react-native-picker/picker";

export default function RewardsScreen() {
  const { rewards, refreshing, onRefresh, fetchRewards } = useRewards();
  const {
    filteredAndSorted,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
  } = useRewardList(rewards);

  useFocusEffect(
    useCallback(() => {
      fetchRewards();
    }, [fetchRewards])
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Lista de Recompensas
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
          <Picker.Item label="Nome (A-Z)" value="name-asc" />
          <Picker.Item label="Nome (Z-A)" value="name-desc" />
          <Picker.Item
            label="Pontos Necessários (menor → maior)"
            value="points-asc"
          />
          <Picker.Item
            label="Pontos Necessários (maior → menor)"
            value="points-desc"
          />
        </Picker>
      </View>

      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <Link href={`/rewards/${item.id}`}>
            <Text>
              {item.name} - {item.pointsRequired} pontos necessários
            </Text>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <Text>Nenhuma recompensa cadastrada.</Text>
          </View>
        )}
      />
      <Link href="/rewards/create">
        <FontAwesome6 name="add" size={24} color="black" />
      </Link>
    </View>
  );
}
