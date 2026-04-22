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
import axios from 'axios';
import { Alert, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requireAuth } from '@/utils/auth';

type CategoryType = 'разход' | 'приход';
const baseUrl = 'http://192.168.0.6:8080';
interface Category {
  id: number;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  icon: string;
  color: string;
  active: boolean;
  default: boolean;
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

const FAB_COLOR = '#f5a623'; 
const WHITE     = '#ffffff';
const BG_COLOR = '#3b6861';

export default function CategoriesScreen() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = await requireAuth();
      const response = await axios.get(`${baseUrl}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error: any) {
      console.log('Categories error:', error?.response?.data || error.message);
      Alert.alert('Грешка', 'Неуспешно зареждане на категории.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = categories.filter((c) => c.type === activeType);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3b6861' }} edges={['top']}>
      {loading ? (
        <ActivityIndicator size="large" color="#3ecf8e" style={{ marginTop: 40 }} />
      ) : (
      <ScrollView style={styles.scroll} contentContainerStyle={styles.grid}>

        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, activeType === 'EXPENSE' && styles.toggleActiveExpense]}
            onPress={() => setActiveType('EXPENSE')}
          >
            <Text style={[styles.toggleText, activeType === 'EXPENSE' && styles.toggleTextActive]}>
              Разход
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, activeType === 'INCOME' && styles.toggleActive]}
            onPress={() => setActiveType('INCOME')}
          >
            <Text style={[styles.toggleText, activeType === 'INCOME' && styles.toggleTextActive]}>
              Приход
            </Text>
          </TouchableOpacity>
        </View>

        {filtered.map((cat) => (
          <TouchableOpacity
            key={cat.id} style={styles.categoryItem}
            onPress={() => {
                if (cat.default) {
                  Alert.alert('Системна категория', 'Тази категория не може да бъде редактирана.');
                  return;}
                router.replace({
                  pathname: '/(tabs)/edit-category',
                  params: {
                    id: cat.id,
                    name: cat.name,
                    colorId: cat.color.toLowerCase(),
                    iconId: cat.icon.toLowerCase(),
                    type: cat.type,}});
          }}>
            <View style={[styles.circle, { backgroundColor: COLOR_MAP[cat.color.toLowerCase()] }]}>
              <Text>{ICON_MAP[cat.icon.toLowerCase()]}</Text>
            </View>
            <Text style={styles.categoryName}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      )}
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

  grid: {flexDirection: 'row',flexWrap: 'wrap',paddingHorizontal: 12,paddingTop: 12,paddingBottom: 20,},
  categoryItem: {width: `${100 / COLUMN_COUNT}%`,alignItems: 'center',paddingVertical: 10,paddingHorizontal: 4,gap: 8,},
  circle: {width: CIRCLE_SIZE,height: CIRCLE_SIZE,borderRadius: CIRCLE_SIZE / 2,alignItems: 'center',justifyContent: 'center',
    shadowColor: '#000',shadowOffset: { width: 0, height: 3 },shadowOpacity: 0.3,shadowRadius: 6,elevation: 5,},
  categoryName: {color: '#fff',fontSize: 11,fontWeight: '500',textAlign: 'center',lineHeight: 15,},

  fab: {position: 'absolute',bottom: 32,alignSelf: 'center',width: 60,height: 60,borderRadius: 30,backgroundColor: FAB_COLOR,
    alignItems: 'center',justifyContent: 'center',shadowColor: FAB_COLOR, shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.4, shadowRadius: 10,elevation: 8,borderColor:'black'
  , borderWidth:1},
  fabIcon: {color: WHITE,fontSize: 28,fontWeight: '300',lineHeight: 32,},
});