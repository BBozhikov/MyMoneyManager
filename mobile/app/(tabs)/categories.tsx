import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/build/Feather';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
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
  iconId: string;
  colorId: string;
  type: CategoryType;
}
const iconSize = 46;
const ICONS = [
    { id: 'receipt',    emoji: <FontAwesome5 name="receipt" size={iconSize} color="white" /> },
    { id: 'plane',      emoji: <FontAwesome name="plane" size={iconSize} color="white" /> },
    { id: 'tag',        emoji: <AntDesign name="tag" size={iconSize} color="white" /> },
    { id: 'pet',        emoji: <MaterialIcons name="pets" size={iconSize} color="white" /> },
    { id: 'monitor',    emoji: <Feather name="monitor" size={iconSize} color="white" /> },
    { id: 'pot',        emoji: <MaterialCommunityIcons name="pot-mix" size={iconSize} color="white" />  },
    { id: 'shopping_cart',     emoji: <AntDesign name="shopping-cart" size={iconSize} color="white" /> },
    { id: 'brush',      emoji: <FontAwesome5 name="brush" size={iconSize} color="white" /> },
    { id: 'washing_machine',    emoji: <MaterialCommunityIcons name="washing-machine" size={iconSize} color="white" /> },
    { id: 'tent',   emoji: <FontAwesome6 name="tent" size={iconSize} color="white" /> },
    { id: 'controller',     emoji: <Ionicons name="game-controller-sharp" size={iconSize} color="white" /> },
    { id: 'car',       emoji: <AntDesign name="car" size={iconSize} color="white" /> },
    { id: 'first_aid',        emoji: <FontAwesome5 name="first-aid" size={iconSize} color="white" /> },
    { id: 'book',     emoji: <Feather name="book-open" size={iconSize} color="white" /> },
    { id: 'tshirt',        emoji: <FontAwesome5 name="tshirt" size={iconSize} color="white" /> },
    { id: 'shoe',    emoji: <MaterialCommunityIcons name="shoe-sneaker" size={iconSize} color="white" /> },
    { id: 'food', emoji: <MaterialCommunityIcons name="food-variant" size={iconSize} color="white" />},
    { id: 'restaurant', emoji: <Ionicons name="restaurant" size={iconSize} color="white" />},
    { id: 'cafe', emoji: <Ionicons name="cafe" size={iconSize} color="white" />},
    { id: 'house', emoji: <FontAwesome6 name="house-chimney" size={iconSize} color="white" />},
    { id: 'therapy', emoji: <MaterialIcons name="local-pharmacy" size={iconSize} color="white" />},
    { id: 'education', emoji: <FontAwesome name="graduation-cap" size={iconSize} color="white" />},
    { id: 'gift', emoji: <Feather name="gift" size={iconSize} color="white" />},
    { id: 'cleaning', emoji: <FontAwesome5 name="pump-soap" size={iconSize} color="white" />},
    { id: 'family', emoji: <MaterialIcons name="family-restroom" size={iconSize} color="white" />},
    { id: 'sports', emoji: <MaterialIcons name="sports-football" size={iconSize} color="white" />},
    { id: 'transport', emoji: <MaterialIcons name="emoji-transportation" size={iconSize} color="white" />},
    { id: 'salary', emoji: <MaterialCommunityIcons name="account-cash" size={iconSize} color="white" />},
    { id: 'loan', emoji: <MaterialIcons name="account-balance" size={iconSize} color="white" />},
    { id: 'trade', emoji: <FontAwesome name="handshake-o" size={iconSize} color="white" />},
    { id: 'others', emoji: <AntDesign name="question" size={iconSize} color="white" />},
  ];
const ICON_MAP = Object.fromEntries(ICONS.map(i => [i.id, i.emoji]));
const COLORS = [
  {id: 'amber', color: '#f5a623'}, // amber
  {id: 'cyan', color: '#00d4ff'}, // cyan
  {id: 'pink', color: '#e91e8c'}, // pink
  {id: 'orange', color: '#ff7043'}, // orange
  {id: 'dark_green', color: '#4a7c6f'}, // dark_green
  {id: 'light_green', color: '#34c759'}, // light_green
  {id: 'red', color: '#ff3b30'}, // red
  {id: 'purple', color: '#5856d6'}, // purple
  {id: 'yellow', color: '#ffcc00'}, // yellow
  {id: 'blue', color: '#007aff'}, // blue
];
const COLOR_MAP = Object.fromEntries(COLORS.map(c => [c.id, c.color]));

const categories: Category[] = [
  // Разходи
  { id: '1', name: 'Здраве', iconId: 'first_aid', colorId: 'red', type: 'разход' },
  { id: '2', name: 'Свободно', iconId: 'sports', colorId: 'light_green', type: 'разход' },
  { id: '3', name: 'Къща', iconId: 'house', colorId: 'blue', type: 'разход' },
  { id: '4', name: 'Кафене', iconId: 'cafe', colorId: 'yellow', type: 'разход' },
  { id: '5', name: 'Образование', iconId: 'education', colorId: 'pink', type: 'разход' },
  { id: '6', name: 'Подаръци', iconId: 'gift', colorId: 'amber', type: 'разход' },
  { id: '7', name: 'Хранителни', iconId: 'shopping_cart', colorId: 'cyan', type: 'разход' },
  { id: '8', name: 'Семейство', iconId: 'family', colorId: 'red', type: 'разход' },
  { id: '9', name: 'Тренировки', iconId: 'sports', colorId: 'light_green', type: 'разход' },
  { id: '10', name: 'Транспорт', iconId: 'transport', colorId: 'blue', type: 'разход' },
  { id: '11', name: 'Други', iconId: 'others', colorId: 'red', type: 'разход' },
  { id: '12', name: 'Пазаруване', iconId: 'shopping_cart', colorId: 'red', type: 'разход' },
  { id: '13', name: 'Споделено', iconId: 'car', colorId: 'amber', type: 'разход' },
  { id: '14', name: 'Пране', iconId: 'washing_machine', colorId: 'pink', type: 'разход' },
  { id: '15', name: 'Стол', iconId: 'restaurant', colorId: 'orange', type: 'разход' },
  { id: '16', name: 'Петлето', iconId: 'food', colorId: 'cyan', type: 'разход' },
  { id: '17', name: 'Steam', iconId: 'gift', colorId: 'amber', type: 'разход' },
  { id: '18', name: 'Бръснар', iconId: 'tag', colorId: 'orange', type: 'разход' },
  { id: '19', name: 'Гироланд', iconId: 'cafe', colorId: 'pink', type: 'разход' },

  // Приходи
  { id: '21', name: 'Заплата', iconId: 'salary', colorId: 'light_green', type: 'приход' },
  { id: '23', name: 'Freelance', iconId: 'trade', colorId: 'blue', type: 'приход' },
  { id: '25', name: 'Наем', iconId: 'house', colorId: 'purple', type: 'приход' },
  { id: '27', name: 'Подарък', iconId: 'gift', colorId: 'pink', type: 'приход' },
  { id: '28', name: 'Лихви', iconId: 'loan', colorId: 'cyan', type: 'приход' },
  { id: '29', name: 'Други', iconId: 'others', colorId: 'amber', type: 'приход' },
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
          <TouchableOpacity key={cat.id} style={styles.categoryItem} activeOpacity={0.75} 
          onPress={() => router.replace({ pathname: `/(tabs)/edit-category`, 
          params: { id: cat.id, name: cat.name, colorId : cat.colorId, iconId: cat.iconId, type: cat.type } })}>
            
            <View style={[styles.circle, { backgroundColor: COLOR_MAP[cat.colorId] }]}>
              {ICON_MAP[cat.iconId]}
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
    paddingTop: 12,
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