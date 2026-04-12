import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

const data = [
  { value: 500, color: '#007AFF', text: 'Храна', strokeWidth: 2, strokeColor: '#3b6861' },
  { value: 300, color: '#34C759', text: 'Транспорт', strokeWidth: 2, strokeColor: '#3b6861' },
  { value: 200, color: '#FF9500', text: 'Развлечения', strokeWidth: 2, strokeColor: '#3b6861' },
  { value: 150, color: '#FF3B30', text: 'Сметки', strokeWidth: 2, strokeColor: '#3b6861' },
];

export default function MainScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3b6861' }} edges={['top', 'bottom']}>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <PieChart
          data={data}
          radius={120}
          centerLabelComponent={() => (
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              1150 лв
            </Text>
          )}
          donut
          innerRadius={80}
          innerCircleColor="#3b6861"
          showText
          textColor="white"
          textSize={14}
        />
      </View>

      <View style={styles.actionsCard}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.75}
          onPress={() => router.push('/(tabs)/add-transaction')}
        >
          <Text style={styles.primaryButtonIcon}>＋</Text>
          <Text style={styles.primaryButtonText}>Добави транзакция</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.75}
          onPress={() => router.push('/(tabs)/transactions')}
        >
          <Text style={styles.secondaryButtonIcon}>☰</Text>
          <Text style={styles.secondaryButtonText}>История на транзакциите</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#3b6861',
    width: '100%',
    marginTop: 20,
  },
  content: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignItems: 'center',
  },
  actionsCard: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    width: '100%',
    overflow: 'hidden',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  primaryButtonIcon: {
    color: '#34C759',
    fontSize: 22,
    fontWeight: '300',
    width: 28,
    textAlign: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginHorizontal: 16,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  secondaryButtonIcon: {
    color: '#007AFF',
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});