import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';
import { SafeAreaView } from 'react-native-safe-area-context';

type CategoryType = 'разход' | 'приход';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  type: CategoryType;
}
const iconSize = 46;
const categories: Category[] = [
  // Разходи
  { id: '1', name: 'Здраве', icon: <MaterialIcons name="favorite" size={iconSize} color="#fff" />, color: '#E53935', type: 'разход' },
  { id: '2', name: 'Свободно', icon: <MaterialIcons name="account-balance-wallet" size={iconSize} color="#fff" />, color: '#43A047', type: 'разход' },
  { id: '3', name: 'Къща', icon: <MaterialIcons name="home" size={iconSize} color="#fff" />, color: '#1E88E5', type: 'разход' },
  { id: '4', name: 'Кафене', icon: <MaterialIcons name="restaurant" size={iconSize} color="#fff" />, color: '#F9A825', type: 'разход' },
  { id: '5', name: 'Образование', icon: <MaterialIcons name="school" size={iconSize} color="#fff" />, color: '#D81B60', type: 'разход' },
  { id: '6', name: 'Подаръци', icon: <MaterialIcons name="card-giftcard" size={iconSize} color="#fff" />, color: '#8E99A4', type: 'разход' },
  { id: '7', name: 'Хранителни', icon: <MaterialIcons name="shopping-basket" size={iconSize} color="#fff" />, color: '#64B5F6', type: 'разход' },
  { id: '8', name: 'Семейство', icon: <MaterialIcons name="people" size={iconSize} color="#fff" />, color: '#E53935', type: 'разход' },
  { id: '9', name: 'Тренировки', icon: <MaterialIcons name="fitness-center" size={iconSize} color="#fff" />, color: '#66BB6A', type: 'разход' },
  { id: '10', name: 'Транспорт', icon: <MaterialIcons name="directions-bus" size={iconSize} color="#fff" />, color: '#1E88E5', type: 'разход' },
  { id: '11', name: 'Други', icon: <MaterialIcons name="help" size={iconSize} color="#fff" />, color: '#E53935', type: 'разход' },
  { id: '12', name: 'Пазаруване', icon: <MaterialIcons name="shopping-cart" size={iconSize} color="#fff" />, color: '#E53935', type: 'разход' },
  { id: '13', name: 'Споделено', icon: <MaterialIcons name="directions-car" size={iconSize} color="#fff" />, color: '#8E99A4', type: 'разход' },
  { id: '14', name: 'Пране', icon: <MaterialIcons name="local-laundry-service" size={iconSize} color="#fff" />, color: '#EC407A', type: 'разход' },
  { id: '15', name: 'Стол', icon: <MaterialIcons name="soup-kitchen" size={iconSize} color="#fff" />, color: '#FF7043', type: 'разход' },
  { id: '16', name: 'Петлето', icon: <FontAwesome5 name="drumstick-bite" size={iconSize} color="#fff" />, color: '#F9A825', type: 'разход' },
  { id: '17', name: 'Steam', icon: <FontAwesome5 name="steam" size={iconSize} color="#fff" />, color: '#546E7A', type: 'разход' },
  { id: '18', name: 'Бръснар', icon: <MaterialIcons name="content-cut" size={iconSize} color="#fff" />, color: '#FF7043', type: 'разход' },
  { id: '19', name: 'Гироланд', icon: <Ionicons name="fast-food" size={iconSize} color="#fff" />, color: '#EC407A', type: 'разход' },
  { id: '20', name: 'Козметика', icon: <MaterialIcons name="face" size={iconSize} color="#fff" />, color: '#00ACC1', type: 'разход' },
  { id: '21', name: 'Протеин', icon: <MaterialIcons name="local-cafe" size={iconSize} color="#fff" />, color: '#F9A825', type: 'разход' },

  // Приходи
  { id: '22', name: 'Заплата', icon: <MaterialIcons name="work" size={iconSize} color="#fff" />, color: '#43A047', type: 'приход' },
  { id: '23', name: 'Freelance', icon: <MaterialIcons name="laptop" size={iconSize} color="#fff" />, color: '#1E88E5', type: 'приход' },
  { id: '24', name: 'Дивиденти', icon: <MaterialIcons name="trending-up" size={iconSize} color="#fff" />, color: '#F9A825', type: 'приход' },
  { id: '25', name: 'Наем', icon: <MaterialIcons name="home" size={iconSize} color="#fff" />, color: '#8E24AA', type: 'приход' },
  { id: '26', name: 'Бонус', icon: <MaterialIcons name="star" size={iconSize} color="#fff" />, color: '#E53935', type: 'приход' },
  { id: '27', name: 'Подарък', icon: <MaterialIcons name="card-giftcard" size={iconSize} color="#fff" />, color: '#EC407A', type: 'приход' },
  { id: '28', name: 'Лихви', icon: <MaterialIcons name="account-balance" size={iconSize} color="#fff" />, color: '#00ACC1', type: 'приход' },
  { id: '29', name: 'Други', icon: <MaterialIcons name="help" size={iconSize} color="#fff" />, color: '#546E7A', type: 'приход' },
];

const FAB_COLOR = '#f5a623'; 
const WHITE     = '#ffffff';
const BG_COLOR = '#3b6861';

export default function CategoriesScreen() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<CategoryType>('разход');

  const filtered = categories.filter((c) => c.type === activeType);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3b6861' }} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.grid}>

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
        {filtered.map((cat) => (
          <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.75}>
            <View style={[styles.circle, { backgroundColor: cat.color }]}>
              {cat.icon}
            </View>
            <Text style={styles.categoryName} numberOfLines={2}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/add-category')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
const CIRCLE_SIZE = 70;
const COLUMN_COUNT = 4;

const styles = StyleSheet.create({
  scroll: {flex: 1,backgroundColor: '#3b6861',width: '100%',marginTop: 1,marginBottom: 0,},
  content: {padding: 12,alignItems: 'center',gap: 16,},

  toggleContainer: {flexDirection: 'row',backgroundColor: 'rgba(0,0,0,0.25)',borderRadius: 14,padding: 4,width: '100%',},
  toggleButton: {flex: 1,paddingVertical: 10,alignItems: 'center',borderRadius: 10,},
  toggleActive: {backgroundColor: '#34C759',},
  toggleActiveExpense: {backgroundColor: '#FF3B30',},
  toggleText: {color: 'rgba(255,255,255,0.55)',fontSize: 15,fontWeight: '600',},
  toggleTextActive: {color: 'white',},

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 20,
  },
  categoryItem: {width: `${100 / COLUMN_COUNT}%`,alignItems: 'center',paddingVertical: 10,paddingHorizontal: 4,gap: 8,},
  circle: {width: CIRCLE_SIZE,height: CIRCLE_SIZE,borderRadius: CIRCLE_SIZE / 2,alignItems: 'center',justifyContent: 'center',
    shadowColor: '#000',shadowOffset: { width: 0, height: 3 },shadowOpacity: 0.3,shadowRadius: 6,elevation: 5,},
  categoryName: {color: '#fff',fontSize: 11,fontWeight: '500',textAlign: 'center',lineHeight: 15,},

  fab: {position: 'absolute',bottom: 32,alignSelf: 'center',width: 60,height: 60,borderRadius: 30,backgroundColor: FAB_COLOR,
    alignItems: 'center',justifyContent: 'center',shadowColor: FAB_COLOR, shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.4, shadowRadius: 10,elevation: 8,borderColor:'black'
  , borderWidth:1},
  fabIcon: {color: WHITE,fontSize: 28,fontWeight: '300',lineHeight: 32,},
});