import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

const data = [
  // Разходи
  { value: 500, color: '#007AFF', text: 'Храна', type: 'разход', strokeWidth: 2, strokeColor: '#3b6861' },
  { value: 300, color: '#34C759', text: 'Транспорт', type: 'разход', strokeWidth: 2, strokeColor: '#3b6861' },
  { value: 200, color: '#FF9500', text: 'Развлечения', type: 'разход', strokeWidth: 2, strokeColor: '#3b6861' },
  { value: 150, color: '#FF3B30', text: 'Сметки', type: 'разход', strokeWidth: 2, strokeColor: '#3b6861' },
  // Приходи
  { value: 2000, color: '#5AC8FA', text: 'Заплата', type: 'приход', strokeWidth: 2, strokeColor: '#3b6861' },
  { value: 400, color: '#BF5AF2', text: 'Freelance', type: 'приход', strokeWidth: 2, strokeColor: '#3b6861' },
  { value: 150, color: '#FFD60A', text: 'Дивиденти', type: 'приход', strokeWidth: 2, strokeColor: '#3b6861' },
];

export default function MainScreen() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<'приход' | 'разход'>('разход');

  const filtered = data.filter(item => item.type === activeType);
  const total = filtered.reduce((sum, item) => sum + item.value, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3b6861' }} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        {/* Toggle бутони */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeType === 'приход' && styles.toggleActive]}
            onPress={() => setActiveType('приход')}
          >
            <Text style={[styles.toggleText, activeType === 'приход' && styles.toggleTextActive]}>
              ↑ Приход
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeType === 'разход' && styles.toggleActiveExpense]}
            onPress={() => setActiveType('разход')}
          >
            <Text style={[styles.toggleText, activeType === 'разход' && styles.toggleTextActive]}>
              ↓ Разход
            </Text>
          </TouchableOpacity>
        </View>

        {/* Пай чарт */}
        <View style={styles.card}>
          <PieChart
            data={filtered}
            radius={120}
            donut
            innerRadius={80}
            innerCircleColor="#3b6861"
            centerLabelComponent={() => (
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
                  {activeType === 'приход' ? 'Общо приход' : 'Общо разход'}
                </Text>
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
                  {total} лв
                </Text>
              </View>
            )}
          />
        </View>

        {/* Бутони */}
        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(tabs)/add-transaction')}
          >
            <Text style={styles.primaryButtonIcon}>＋</Text>
            <Text style={styles.primaryButtonText}>Добави транзакция</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            <Text style={styles.secondaryButtonIcon}>☰</Text>
            <Text style={styles.secondaryButtonText}>История на транзакциите</Text>
          </TouchableOpacity>
        </View>

        {/* Списък с категории */}
        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>
            {activeType === 'приход' ? 'Източници на приход' : 'Разбивка по разходи'}
          </Text>
          {filtered.map((item, index) => (
            <View key={index} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.text}</Text>
              <Text style={styles.legendValue}>{item.value} лв</Text>
              <Text style={styles.legendPercent}>
                {Math.round((item.value / total) * 100)}%
              </Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: {flex: 1,backgroundColor: '#3b6861',width: '100%',marginTop: 1,marginBottom: 0,},
  content: {padding: 12,alignItems: 'center',gap: 16,},

  // Toggle
  toggleContainer: {flexDirection: 'row',backgroundColor: 'rgba(0,0,0,0.25)',borderRadius: 14,padding: 4,width: '100%',},
  toggleButton: {flex: 1,paddingVertical: 10,alignItems: 'center',borderRadius: 10,},
  toggleActive: {backgroundColor: '#34C759',},
  toggleActiveExpense: {backgroundColor: '#FF3B30',},
  toggleText: {color: 'rgba(255,255,255,0.55)',fontSize: 15,fontWeight: '600',},
  toggleTextActive: {color: 'white',},

  // Карти
  card: {backgroundColor: 'rgba(0,0,0,0.18)',borderRadius: 20,padding: 20,width: '100%',alignItems: 'center',},
  actionsCard: {backgroundColor: 'rgba(0,0,0,0.18)',borderRadius: 20,width: '100%',overflow: 'hidden',},
  primaryButton: {flexDirection: 'row',alignItems: 'center',gap: 12,paddingVertical: 18,paddingHorizontal: 20,},
  primaryButtonIcon: {color: '#34C759',fontSize: 22,fontWeight: '300',width: 28,textAlign: 'center',},
  primaryButtonText: {color: 'white',fontSize: 16,fontWeight: '600',},
  divider: {height: 1,backgroundColor: 'rgba(255,255,255,0.12)',marginHorizontal: 16,},
  secondaryButton: {flexDirection: 'row',alignItems: 'center',gap: 12,paddingVertical: 18,paddingHorizontal: 20,},
  secondaryButtonIcon: {color: '#007AFF',fontSize: 18,width: 28,textAlign: 'center',},
  secondaryButtonText: {color: 'white',fontSize: 16,fontWeight: '600',},

  // Легенда
  legendCard: {backgroundColor: 'rgba(0,0,0,0.18)',borderRadius: 20,padding: 20,width: '100%',gap: 12,},
  legendTitle: {color: 'rgba(255,255,255,0.7)',fontSize: 13,fontWeight: '600',textTransform: 'uppercase',letterSpacing: 1,marginBottom: 4,},
  legendRow: {flexDirection: 'row',alignItems: 'center',gap: 12,},
  legendDot: {width: 12,height: 12,borderRadius: 6,},
  legendText: {color: 'white',fontSize: 15,fontWeight: '500',flex: 1,},
  legendValue: {color: 'white',fontSize: 15,fontWeight: '600',},
  legendPercent: {color: 'rgba(255,255,255,0.55)',fontSize: 13,width: 38,textAlign: 'right',},
});