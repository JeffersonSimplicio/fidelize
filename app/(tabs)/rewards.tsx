import { useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Link, useFocusEffect } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useRewards } from "@/ui/hooks/rewards/use-rewards";
import { useRewardList } from "@/ui/hooks/rewards/use-reward-list";

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
    <View className="flex-1 p-4 bg-white">
      {/* Título */}
      <Text className="text-xl font-bold mb-3 text-gray-800">
        Lista de Recompensas
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
      <View className="border border-gray-300 rounded-lg mb-3">
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

      {/* Lista de recompensas */}
      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={({ item }) => (
          <Link href={`/rewards/${item.id}`} asChild>
            <TouchableOpacity className="p-3 mb-2 bg-gray-100 rounded-lg active:bg-gray-200">
              <Text className="text-base font-semibold text-gray-800">
                {item.name}
              </Text>
              <Text className="text-gray-600">
                {item.pointsRequired} pontos necessários
              </Text>
            </TouchableOpacity>
          </Link>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View className="items-center mt-6">
            <Text className="text-gray-600">
              Nenhuma recompensa cadastrada.
            </Text>
          </View>
        )}
      />

      {/* Botão flutuante */}
      <Link href="/rewards/create" asChild>
        <TouchableOpacity
          className="absolute bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-lg active:opacity-80"
          accessibilityLabel="Adicionar recompensa"
        >
          <FontAwesome6 name="plus" size={20} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
