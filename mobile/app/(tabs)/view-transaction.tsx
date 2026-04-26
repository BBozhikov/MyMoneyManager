import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { requireAuth } from '@/utils/auth';
import { useCallback, useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import Feather from '@expo/vector-icons/build/Feather';
import Ionicons from '@expo/vector-icons/build/Ionicons';

const baseUrl = process.env.EXPO_PUBLIC_APP_BASE_URL;

const BG = '#3b6861';
const CARD = '#1e2d22';
const WHITE = '#ffffff';
const MUTED = 'rgba(255,255,255,0.45)';
const ACCENT = '#3ecf8e';
const RED = '#ff3b30';

interface AccountDTO {
  id: number;
  name: string;
  icon: string;
  color: string;
  currentBalance: number;
  main: boolean;
}

interface CategoryDTO {
  id: number;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  icon: string;
  color: string;
  active: boolean;
  default: boolean;
}
const iconSize = 24;
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

const ACCOUNT_ICONS: { id: string; emoji: React.ReactNode }[] = [
  { id: 'cash',       emoji: <FontAwesome name="money" size={iconSize} color="white" /> },
  { id: 'bank',       emoji: <AntDesign name="bank" size={iconSize} color="white" /> },
  { id: 'pound',      emoji: <AntDesign name="pound-circle" size={iconSize} color="white" /> },
  { id: 'card',       emoji: <FontAwesome name="credit-card" size={iconSize} color="white" /> },
  { id: 'wallet',     emoji: <FontAwesome5 name="wallet" size={iconSize} color="white" /> },
  { id: 'savings',    emoji: <FontAwesome5 name="piggy-bank" size={iconSize} color="white" /> },
  { id: 'paypal',     emoji: <FontAwesome name="paypal" size={iconSize} color="white" /> },
  { id: 'safe',       emoji: <MaterialCommunityIcons name="safe" size={iconSize} color="white" /> },
  { id: 'bitcoin',    emoji: <FontAwesome name="bitcoin" size={iconSize} color="white" /> },
  { id: 'ethereum',   emoji: <FontAwesome5 name="ethereum" size={iconSize} color="white" /> },
  { id: 'dollar',     emoji: <FontAwesome name="dollar" size={iconSize} color="white" /> },
  { id: 'euro',       emoji: <FontAwesome name="euro" size={iconSize} color="white" /> },
  { id: 'yen',        emoji: <FontAwesome name="yen" size={iconSize} color="white" /> },
  { id: 'stocks',     emoji: <AntDesign name="stock" size={iconSize} color="white" /> },
  { id: 'bag',        emoji: <FontAwesome6 name="sack-dollar" size={iconSize} color="white" /> },
  { id: 'percent',    emoji: <FontAwesome5 name="percent" size={iconSize} color="white" /> },
  { id: 'finance',    emoji: <MaterialCommunityIcons name="finance" size={iconSize} color="white" /> },
  { id: 'diamond',    emoji: <FontAwesome name="diamond" size={iconSize} color="white" /> },
  { id: 'gold',       emoji: <MaterialCommunityIcons name="gold" size={iconSize} color="white" /> },
  { id: 'coins',      emoji: <FontAwesome5 name="coins" size={iconSize} color="white" /> },
];
const ACCOUNT_ICON_MAP: Record<string, React.ReactNode> = Object.fromEntries(ACCOUNT_ICONS.map(i => [i.id, i.emoji]));
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

function formatAmount(n: number) {
  const sign = n >= 0 ? '+ ' : '- ';
  return sign + Math.abs(n).toLocaleString('bg-BG', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }) + ' €';
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function TransactionDetailsScreen() {
  const { id, accountId, accountName, categoryId, categoryName, amount, note, createdAt } = useLocalSearchParams<{
    id: string;
    accountId: string;
    accountName: string;
    categoryId: string;
    categoryName: string;
    amount: string;
    createdAt: string;
    note: string;
  }>();
  const router = useRouter();
  type TxType = 'all' | 'expense' | 'income';


  const [accounts, setAccounts] = useState<AccountDTO[]>([]);
  const [categories, setCategories] = useState<CategoryDTO[]>([]);;
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
  try {
    setLoading(true);
    const token = await requireAuth();
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const [accRes, catRes] = await Promise.all([
      axios.get(`${baseUrl}/api/accounts`, { headers }),
      axios.get(`${baseUrl}/api/categories`, { headers }),
    ]);

    setAccounts(accRes.data);
    setCategories(catRes.data);

  } catch (error: any) {
    console.log('Fetch error:', error?.response?.data || error.message);
    Alert.alert('Грешка', 'Неуспешно зареждане на данните.');
  } finally {
    setLoading(false);
  }
};
  const account = accounts.find(a => a.id === parseInt(accountId));
  const category = categories.find(c => c.id === parseInt(categoryId));
  const amountNum = parseFloat(amount ?? '0');
  const isIncome = amountNum >= 0;
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const accountIcon   = account  ? ACCOUNT_ICON_MAP[account.icon.toLowerCase()]   : null;
  const categoryIcon  = category ? CATEGORY_ICON_MAP[category.icon.toLowerCase()] : null;
  const accountColor  = account  ? COLOR_MAP[account.color.toLowerCase()]  : '#888888';
  const categoryColor = category ? COLOR_MAP[category.color.toLowerCase()] : '#888888';

  const handleDelete = () => {
    Alert.alert(
      'Изтриване',
      `Сигурни ли сте, че искате да изтриете "${note || categoryName}"?`,
      [
        { text: 'Отказ', style: 'cancel' },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: () => {deleteTransaction()},
        },
      ]
    );
  };

  const deleteTransaction = async () => {
    try {
      setLoading(true);
      const token = await requireAuth();
      if (!token) return;

      await axios.delete(
        `${baseUrl}/api/transactions/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Успех', `Транзакцията "${note ?? categoryName}" беше изтрита!`, [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/(tabs)/transactions');
          }},
      ]);
    } catch (error: any) {
      console.log('Transactions error:', JSON.stringify(error?.response?.data));
      Alert.alert('Грешка', 'Неуспешно изтриване на транзакция.');
    } finally {
      setLoading(false);
    }
  }
  const handleEdit = () => {
    router.push({
      pathname: '/(tabs)/edit-transaction',
      params: {
      id: String(id),
      accountId: String(accountId),
      accountName: String(accountName),
      categoryId: String(categoryId),
      categoryName: String(categoryName),
      amount: String(amount),
      note: String(note),
      createdAt: String(createdAt),
    }});
  }
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/transactions')} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}><AntDesign name="arrow-left" size={24} color="white" /></Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Подробности за транзакция</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.label}>Количество</Text>
          <Text style={[styles.amountText, { color: isIncome ? ACCENT : RED }]}>
            {formatAmount(amountNum)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Сметка</Text>
          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: accountColor }]}>
              <Text style={styles.iconEmoji}>{accountIcon}</Text>
            </View>
            <Text style={styles.fieldValue}>{account?.name ?? accountId}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Категория</Text>
          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: categoryColor }]}>
              <Text style={styles.iconEmoji}>{categoryIcon}</Text>
            </View>
            <Text style={styles.fieldValue}>{category?.name ?? categoryId}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {note ? (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Бележка</Text>
              <Text style={styles.fieldValue}>{note}</Text>
            </View>
            <View style={styles.divider} />
          </>
        ) : null}

        {createdAt ? (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Дата</Text>
              <Text style={styles.fieldValue}>{formatDate(createdAt)}</Text>
            </View>
            <View style={styles.divider} />
          </>
        ) : null}

        <TouchableOpacity onPress={handleEdit} activeOpacity={0.7} style={styles.editBtn}>
          <Text style={styles.editBtnText}>РЕДАКТИРАЙ</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} activeOpacity={0.7} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>ИЗТРИЙ</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',paddingHorizontal: 16, paddingVertical: 14,},
  backBtn: { width: 40 },
  backArrow: { color: WHITE, fontSize: 22 },
  headerTitle: { color: WHITE, fontSize: 17, fontWeight: '700' },

  scroll: { flex: 1 },
  content: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 48 },

  section: { paddingVertical: 18, gap: 8 },
  label: { color: MUTED, fontSize: 13 },
  fieldValue: { color: WHITE, fontSize: 17, fontWeight: '500' },
  amountText: { fontSize: 26, fontWeight: '700' },

  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconCircle: {width: 46, height: 46, borderRadius: 23,alignItems: 'center', justifyContent: 'center',},
  iconEmoji: { fontSize: 22 },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },

  editBtn: { marginTop: 16, paddingVertical: 8 },
  editBtnText: { color: ACCENT, fontSize: 16, fontWeight: '700', letterSpacing: 1 },

  deleteBtn: { marginTop: 16, paddingVertical: 8 },
  deleteBtnText: { color: RED, fontSize: 16, fontWeight: '700', letterSpacing: 1 },

  createdAt: { color: MUTED, fontSize: 12, marginTop: 32 },
});