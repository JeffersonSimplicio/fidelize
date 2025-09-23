import { View, Text, StyleSheet } from 'react-native';

export default function Rewards() {
  return (
    <View style={styles.container}>
      <Text>Prêmios</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
