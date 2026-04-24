import { useRequireAuth } from '@/hooks/useRequireAuth';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { requireAuth } from '@/utils/auth';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

const COLORS: { id: string; color: string }[] = [
  { id: 'amber', color: '#f5a623' },
  { id: 'cyan', color: '#00d4ff' },
  { id: 'pink', color: '#e91e8c' },
  { id: 'orange', color: '#ff7043' },
  { id: 'dark_green', color: '#4a7c6f' },
  { id: 'light_green', color: '#34c759' },
  { id: 'red', color: '#ff3b30' },
  { id: 'purple', color: '#5856d6' },
  { id: 'yellow', color: '#ffcc00' },
  { id: 'blue', color: '#007aff' },
];
const COLOR_MAP: Record<string, string> = Object.fromEntries(COLORS.map(c => [c.id, c.color]));
const iconSize = 20;
const CATEGORY_ICONS: { id: string; emoji: React.ReactNode }[] = [
  { id: 'receipt',    emoji: <FontAwesome5 name="receipt" size={iconSize} color="white" /> },
  { id: 'plane',      emoji: <FontAwesome name="plane" size={iconSize} color="white" /> },
  { id: 'tag',        emoji: <AntDesign name="tag" size={iconSize} color="white" /> },
  { id: 'pet',        emoji: <MaterialIcons name="pets" size={iconSize} color="white" /> },
  { id: 'monitor',    emoji: <Feather name="monitor" size={iconSize} color="white" /> },
  { id: 'pot',        emoji: <MaterialCommunityIcons name="pot-mix" size={iconSize} color="white" /> },
  { id: 'shopping_cart', emoji: <AntDesign name="shopping-cart" size={iconSize} color="white" /> },
  { id: 'brush',      emoji: <FontAwesome5 name="brush" size={iconSize} color="white" /> },
  { id: 'washing_machine', emoji: <MaterialCommunityIcons name="washing-machine" size={iconSize} color="white" /> },
  { id: 'tent',       emoji: <FontAwesome6 name="tent" size={iconSize} color="white" /> },
  { id: 'controller', emoji: <Ionicons name="game-controller-sharp" size={iconSize} color="white" /> },
  { id: 'car',        emoji: <AntDesign name="car" size={iconSize} color="white" /> },
  { id: 'first_aid',  emoji: <FontAwesome5 name="first-aid" size={iconSize} color="white" /> },
  { id: 'book',       emoji: <Feather name="book-open" size={iconSize} color="white" /> },
  { id: 'tshirt',     emoji: <FontAwesome5 name="tshirt" size={iconSize} color="white" /> },
  { id: 'shoe',       emoji: <MaterialCommunityIcons name="shoe-sneaker" size={iconSize} color="white" /> },
  { id: 'food',       emoji: <MaterialCommunityIcons name="food-variant" size={iconSize} color="white" /> },
  { id: 'restaurant', emoji: <Ionicons name="restaurant" size={iconSize} color="white" /> },
  { id: 'cafe',       emoji: <Ionicons name="cafe" size={iconSize} color="white" /> },
  { id: 'house',      emoji: <FontAwesome6 name="house-chimney" size={iconSize} color="white" /> },
  { id: 'therapy',    emoji: <MaterialIcons name="local-pharmacy" size={iconSize} color="white" /> },
  { id: 'education',  emoji: <FontAwesome name="graduation-cap" size={iconSize} color="white" /> },
  { id: 'gift',       emoji: <Feather name="gift" size={iconSize} color="white" /> },
  { id: 'cleaning',   emoji: <FontAwesome5 name="pump-soap" size={iconSize} color="white" /> },
  { id: 'family',     emoji: <MaterialIcons name="family-restroom" size={iconSize} color="white" /> },
  { id: 'sports',     emoji: <MaterialIcons name="sports-football" size={iconSize} color="white" /> },
  { id: 'transport',  emoji: <MaterialIcons name="emoji-transportation" size={iconSize} color="white" /> },
  { id: 'salary',     emoji: <MaterialCommunityIcons name="account-cash" size={iconSize} color="white" /> },
  { id: 'loan',       emoji: <MaterialIcons name="account-balance" size={iconSize} color="white" /> },
  { id: 'trade',      emoji: <FontAwesome name="handshake-o" size={iconSize} color="white" /> },
  { id: 'others',     emoji: <AntDesign name="question" size={iconSize} color="white" /> },
];
const CATEGORY_ICON_MAP: Record<string, React.ReactNode> = Object.fromEntries(CATEGORY_ICONS.map(i => [i.id, i.emoji]));
const baseUrl = 'http://192.168.0.6:8080';
type CategoryType = 'INCOME' | 'EXPENSE';

interface CategoryStatisticsResponse {
  categoryName: string;
  type: CategoryType;
  icon: string;
  color: string;
  totalAmount: number;
}

function mapToChartItem(item: CategoryStatisticsResponse) {
  return {
    value: item.totalAmount,
    color: COLOR_MAP[item.color.toLowerCase()] ?? '#888888',
    icon: CATEGORY_ICON_MAP[item.icon.toLowerCase()] ?? '',
    text: item.categoryName,
    type: item.type === 'INCOME' ? 'приход' : 'разход',
    strokeWidth: 2,
    strokeColor: '#3b6861',
  };
}

export default function MainScreen() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<'приход' | 'разход'>('разход');

  const [chartData, setChartData] = useState<ReturnType<typeof mapToChartItem>[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const token = await requireAuth();
      if (!token) return;
      
      const response = await axios.get<CategoryStatisticsResponse[]>(
        `${baseUrl}/api/transactions/statistics`, {
          headers: { Authorization: `Bearer ${token}` } 
        });
      setChartData(response.data.map(mapToChartItem));
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchStatistics();
    }, [])
  );
  const filtered = chartData.filter(item => item.type === activeType);
  const total = filtered.reduce((sum, item) => sum + item.value, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3b6861' }} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeType === 'разход' && styles.toggleActiveExpense]}
            onPress={() => setActiveType('разход')}
          >
            <Text style={[styles.toggleText, activeType === 'разход' && styles.toggleTextActive]}>
              Разход
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeType === 'приход' && styles.toggleActive]}
            onPress={() => setActiveType('приход')}
          >
            <Text style={[styles.toggleText, activeType === 'приход' && styles.toggleTextActive]}>
              Приход
            </Text>
          </TouchableOpacity>
        </View>

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
                  {total} €
                </Text>
              </View>
            )}
          />
        </View>

        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/(tabs)/add-transaction')}
          >
            <Text style={styles.primaryButtonIcon}><AntDesign name="plus" size={24} color="greens" /></Text>
            <Text style={styles.primaryButtonText}>Добави транзакция</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            <Text style={styles.secondaryButtonIcon}><AntDesign name="menu" size={24} color="cyan" /></Text>
            <Text style={styles.secondaryButtonText}>История на транзакциите</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            <Text style={styles.secondaryButtonIcon}><AntDesign name="clock-circle" size={24} color="yellow" /></Text>
            <Text style={styles.secondaryButtonText}>Чакащи транзакции</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.legendCard}>
          <Text style={styles.legendTitle}>
            {activeType === 'приход' ? 'Източници на приход' : 'Разбивка по разходи'}
          </Text>
          {filtered.map((item, index) => (
            <View key={index} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]}>
                <Text style={styles.legendIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.legendText}>{item.text}</Text>
              <Text style={styles.legendValue}>{item.value} €</Text>
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

  toggleContainer: {flexDirection: 'row',backgroundColor: 'rgba(0,0,0,0.25)',borderRadius: 14,padding: 4,width: '100%',},
  toggleButton: {flex: 1,paddingVertical: 10,alignItems: 'center',borderRadius: 10,},
  toggleActive: {backgroundColor: '#34C759',},
  toggleActiveExpense: {backgroundColor: '#FF3B30',},
  toggleText: {color: 'rgba(255,255,255,0.55)',fontSize: 15,fontWeight: '600',},
  toggleTextActive: {color: 'white',},

  card: {backgroundColor: '#0000002e',borderRadius: 20,padding: 20,width: '100%',alignItems: 'center',},
  actionsCard: {backgroundColor: 'rgba(0,0,0,0.18)',borderRadius: 20,width: '100%',overflow: 'hidden',},
  primaryButton: {flexDirection: 'row',alignItems: 'center',gap: 12,paddingVertical: 18,paddingHorizontal: 20,},
  primaryButtonIcon: {color: '#34C759',fontSize: 22,fontWeight: '300',width: 28,textAlign: 'center',},
  primaryButtonText: {color: 'white',fontSize: 16,fontWeight: '600',},
  divider: {height: 1,backgroundColor: 'rgba(255,255,255,0.12)',marginHorizontal: 16,},
  secondaryButton: {flexDirection: 'row',alignItems: 'center',gap: 12,paddingVertical: 18,paddingHorizontal: 20,},
  secondaryButtonIcon: {color: '#007AFF',fontSize: 18,width: 28,textAlign: 'center',},
  secondaryButtonText: {color: 'white',fontSize: 16,fontWeight: '600',},

  legendCard: {backgroundColor: 'rgba(0,0,0,0.18)',borderRadius: 20,padding: 20,width: '100%',gap: 12,},
  legendTitle: {color: 'rgba(255,255,255,0.7)',fontSize: 13,fontWeight: '600',textTransform: 'uppercase',letterSpacing: 1,marginBottom: 4,},
  legendRow: {flexDirection: 'row',alignItems: 'center',gap: 12,},
  legendDot: {width: 36,height: 36,borderRadius: 18,alignItems: 'center',justifyContent: 'center',},
  legendIcon: {lineHeight: 36,textAlign: 'center',},
  legendText: {color: 'white',fontSize: 15,fontWeight: '500',flex: 1,},
  legendValue: {color: 'white',fontSize: 15,fontWeight: '600',},
  legendPercent: {color: 'rgba(255,255,255,0.55)',fontSize: 13,width: 38,textAlign: 'right',},
  
});