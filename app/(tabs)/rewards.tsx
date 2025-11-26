import { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { useRewards } from '@/ui/hooks/rewards/use-rewards';
import { useRewardList } from '@/ui/hooks/rewards/use-reward-list';
import { ListItemCard } from '@/ui/components/list-item-card';

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
      void fetchRewards();
    }, [fetchRewards]),
  );

  return (
    <View className="flex-1 bg-white p-4">
      {/* Título */}
      <Text className="mb-3 text-xl font-bold text-gray-800">
        Lista de Recompensas
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
      <View className="mb-3 rounded-lg border border-gray-300">
        <Picker
          selectedValue={sortOption}
          onValueChange={(v) => setSortOption(v)}
          style={{ color: 'black' }}
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
          <ListItemCard
            href={`/rewards/${item.id}`}
            title={item.name}
            subtitle={`${item.pointsRequired} pontos necessários`}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() => (
          <View className="mt-6 items-center">
            <Text className="text-gray-600">
              Nenhuma recompensa cadastrada.
            </Text>
          </View>
        )}
      />

      {/* Botão flutuante */}
      <Link href="/rewards/create" asChild>
        <TouchableOpacity
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg active:opacity-80"
          accessibilityLabel="Adicionar recompensa"
        >
          <FontAwesome6 name="plus" size={24} color="white" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
