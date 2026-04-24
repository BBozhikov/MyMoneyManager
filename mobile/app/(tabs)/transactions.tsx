import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/build/Feather';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { requireAuth } from '@/utils/auth';

const baseUrl = 'http://192.168.0.6:8080';

const BG     = '#3b6861';
const CARD   = '#1e2d22';
const WHITE  = '#ffffff';
const MUTED  = 'rgba(255,255,255,0.45)';
const ACCENT = '#3ecf8e';
const FAB    = '#f5a623';

type TxType = 'all' | 'expense' | 'income';

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

interface TransactionDTO {
  id: number;
  accountId: number;
  accountName: string;
  categoryId: number;
  categoryName: string;
  amount: number;
  createdAt: string;
  note: string | null;
}

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

const PERIODS = ['Ден', 'Седмица', 'Месец', 'Година', 'Винаги'];

function getDateRange(period: string): { startDate?: string; endDate?: string } {
  const today = new Date();
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  if (period === 'Ден') {
    const s = fmt(today);
    return { startDate: s, endDate: s };
  }
  if (period === 'Седмица') {
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const start = new Date(today);
    start.setDate(today.getDate() - diff);
    return { startDate: fmt(start), endDate: fmt(today) };
  }
  if (period === 'Месец') {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return { startDate: fmt(start), endDate: fmt(today) };
  }
  if (period === 'Година') {
    const start = new Date(today.getFullYear(), 0, 1);
    return { startDate: fmt(start), endDate: fmt(today) };
  }
  return {};
}

function formatAmount(n: number, isExpense: boolean) {
  const sign = isExpense ? '- ' : '+ ';
  return sign + Math.abs(n).toLocaleString('bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function formatDateHeader(dateStr: string) {
  const parts = dateStr.split('-');
  const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
}

function groupByDate(txs: TransactionDTO[], categories: Map<number, CategoryDTO>) {
  const map = new Map<string, TransactionDTO[]>();
  for (const t of txs) {
    const key = t.createdAt;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return Array.from(map.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, items]) => ({ date, items }));
}

function PickerModal({
  visible,
  title,
  items,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  items: { id: string; name: string; emoji: React.ReactNode; color?: string }[];
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
          <ScrollView>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>{title}</Text>
            {items.map((item, index) => (
              <View key={item.id}>
                <TouchableOpacity
                  style={styles.accountRow}
                  onPress={() => { onSelect(item.id); onClose(); }}
                  activeOpacity={0.75}
                >
                  <View style={[styles.accountIcon, { backgroundColor: item.color ? item.color : 'rgba(255,255,255,0.08)' }]}>
                    <Text style={styles.accountEmoji}>{item.emoji}</Text>
                  </View>
                  <Text style={styles.accountName}>{item.name}</Text>
                  {selected === item.id && (
                    <Text style={[styles.checkmark, { color: ACCENT }]}>✓</Text>
                  )}
                </TouchableOpacity>
                {index < items.length - 1 && <View style={styles.modalDivider} />}
              </View>
            ))}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export default function TransactionsScreen() {
  const router = useRouter();

  const [period,          setPeriod]          = useState('Период');
  const [txType,          setTxType]          = useState<TxType>('all');
  const [search,          setSearch]          = useState('');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [selectedCat,     setSelectedCat]     = useState('all');
  const [accountModal,    setAccountModal]    = useState(false);
  const [catModal,        setCatModal]        = useState(false);

  const [accounts,     setAccounts]     = useState<AccountDTO[]>([]);
  const [categories,   setCategories]   = useState<CategoryDTO[]>([]);
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading,      setLoading]      = useState(false);

  const categoryMap = new Map(categories.map(c => [c.id, c]));

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

      await fetchTransactions(token, 'Месец');
    } catch (error: any) {
      console.log('Fetch error:', error?.response?.data || error.message);
      Alert.alert('Грешка', 'Неуспешно зареждане на данните.');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (token?: string, overridePeriod?: string) => {
    try {
      if (!token) {
        token = await requireAuth() ?? undefined;
        if (!token) return;
      }

      const params: Record<string, string> = {};

      if (selectedAccount !== 'all') {
        params.accountId = selectedAccount;
      }
      if (selectedCat !== 'all') {
        params.categoryId = selectedCat;
      } else if (txType !== 'all') {
        params.type = txType === 'expense' ? 'EXPENSE' : 'INCOME';
      }

      const { startDate, endDate } = getDateRange(overridePeriod ?? period);
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      if (search.trim()) {
        params.note = search.trim();
      }

      const res = await axios.get(`${baseUrl}/api/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setTransactions(res.data);
    } catch (error: any) {
      console.log('Transactions error:', error?.response?.data || error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPeriod('Месец');
      setTxType('all');
      setSearch('');
      setSelectedAccount('all');
      setSelectedCat('all');

      fetchData();
    }, [])
  );

  React.useEffect(() => {
    fetchTransactions();
  }, [selectedAccount, selectedCat, txType, period, search]);

  const accountPickerItems = [
    { id: 'all', name: 'Всички сметки', emoji: <FontAwesome5 name="clipboard" size={24} color="white" /> as React.ReactNode },
    ...accounts.map(a => ({
      id: String(a.id),
      name: a.name,
      emoji: (ACCOUNT_ICON_MAP[a.icon.toLowerCase()] ?? <FontAwesome5 name="wallet" size={24} color="white" />) as React.ReactNode,
      color: COLOR_MAP[a.color?.toLowerCase()] ?? undefined,
    })),
  ];

  const categoryPickerItems = [
    { id: 'all', name: 'Всички категории', emoji: <FontAwesome5 name="clipboard" size={24} color="white" /> as React.ReactNode },
    ...categories.filter(c => {
        if (!c.active) return false;
        if (txType === 'expense') return c.type === 'EXPENSE';
        if (txType === 'income')  return c.type === 'INCOME';
        return true;
      }).map(c => ({
      id: String(c.id),
      name: c.name,
      emoji: (CATEGORY_ICON_MAP[c.icon.toLowerCase()] ?? <AntDesign name="question" size={24} color="white" />) as React.ReactNode,
      color: COLOR_MAP[c.color?.toLowerCase()] ?? undefined,
    })),
  ];

  const activeAccount  = accountPickerItems.find(a => a.id === selectedAccount);
  const activeCategory = categoryPickerItems.find(c => c.id === selectedCat);

  const groups = groupByDate(transactions, categoryMap);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/main')} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}><AntDesign name="arrow-left" size={24} color="white" /></Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Транзакции</Text>
        <TouchableOpacity
          style={styles.accountPickerBtn}
          onPress={() => setAccountModal(true)}
          activeOpacity={0.75}
        >
          <Text style={styles.accountPickerEmoji}>{activeAccount?.emoji}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.contentCard}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {PERIODS.map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              activeOpacity={0.75}
              style={styles.tabBtn}
            >
              <Text style={[styles.tabText, period === p && styles.tabTextActive]}>{p}</Text>
              {period === p && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.comboBox}
            onPress={() => setCatModal(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.comboEmoji}>{activeCategory?.emoji}</Text>
            <Text style={styles.comboText} numberOfLines={1}>
              {selectedCat === 'all' ? 'Категория' : activeCategory?.name}
            </Text>
            <Text style={styles.comboChevron}>⌄</Text>
          </TouchableOpacity>

          <View style={styles.typeToggle}>
            {(['all', 'expense', 'income'] as TxType[]).map(t => (
              <TouchableOpacity
                key={t}
                style={[styles.typeBtn, txType === t && {
                  backgroundColor: t === 'expense'
                    ? 'rgba(255,59,48,0.3)'
                    : t === 'income'
                    ? 'rgba(52,199,89,0.3)'
                    : 'rgba(255,255,255,0.12)',
                  borderRadius: 8,
                }]}
                onPress={() => {
                  setTxType(t);
                  setSelectedCat('all');
                }}
                activeOpacity={0.75}
              >
                <Text style={[styles.typeBtnText, txType === t && styles.typeBtnTextActive]}>
                  {t === 'all' ? <FontAwesome6 name="infinity" size={12} color="white" /> : t === 'expense' 
                  ? <FontAwesome6 name="arrow-down" size={12} color="white" /> : <FontAwesome6 name="arrow-up" size={12} color="white" />}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}><Entypo name="magnifying-glass" size={24} color="white" /></Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Търси транзакция по бележка..."
            placeholderTextColor={MUTED}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={ACCENT} style={{ marginTop: 40 }} />
        ) : (
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {groups.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}><AntDesign name="dropbox" size={48} color="white" /></Text>
                <Text style={styles.emptyText}>Няма транзакции</Text>
              </View>
            ) : (
              groups.map(group => (
                <View key={group.date} style={styles.group}>
                  <Text style={styles.dateHeader}>{formatDateHeader(group.date)}</Text>
                  {group.items.map(tx => {
                    const cat = categoryMap.get(tx.categoryId);
                    const catIcon = cat ? CATEGORY_ICON_MAP[cat.icon.toLowerCase()] : null;
                    const catColor = cat ? COLOR_MAP[cat.color.toLowerCase()] : '#888';
                    const isExpense = cat ? cat.type === 'EXPENSE' : tx.amount < 0;

                    return (
                      <TouchableOpacity key={tx.id} style={styles.txRow} activeOpacity={0.75}
                        onPress={() => router.replace({
                          pathname: '/(tabs)/view-transaction',
                          params: {
                            id: String(tx.id),
                            accountId: String(tx.accountId),
                            amount: String(isExpense ? -tx.amount : tx.amount),
                            description: tx.note ?? '',
                            categoryId: String(tx.categoryId),
                            date: tx.createdAt,
                          }
                        })}>
                        <View style={[styles.txIconWrap, { backgroundColor: catColor }]}>
                          <Text style={{ fontSize: 20 }}>{catIcon ?? <AntDesign name="question" size={20} color="white" />}</Text>
                        </View>
                        <View style={styles.txInfo}>
                          <Text style={styles.txName}>{tx.note || tx.categoryName}</Text>
                          <Text style={styles.txMeta}>{tx.categoryName} · {tx.accountName}</Text>
                        </View>
                        <Text style={[styles.txAmount, { color: isExpense ? '#ff3b30' : ACCENT }]}>
                          {formatAmount(tx.amount, isExpense)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/add-transaction')} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <PickerModal
        visible={accountModal}
        title="Изберете сметка"
        items={accountPickerItems}
        selected={selectedAccount}
        onSelect={setSelectedAccount}
        onClose={() => setAccountModal(false)}
      />
      <PickerModal
        visible={catModal}
        title="Изберете категория"
        items={categoryPickerItems}
        selected={selectedCat}
        onSelect={setSelectedCat}
        onClose={() => setCatModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',backgroundColor: BG, paddingHorizontal: 16, paddingVertical: 14,},
  backBtn:           { width: 40 },
  backArrow:         { color: WHITE, fontSize: 22 },
  headerTitle:       { color: WHITE, fontSize: 18, fontWeight: '700' },
  accountPickerBtn:  {width: 40, height: 40, borderRadius: 20,backgroundColor: 'rgba(0,0,0,0.2)',alignItems: 'center', justifyContent: 'center',},
  accountPickerEmoji: { fontSize: 20 },

  contentCard: {flex: 1, backgroundColor: CARD,borderRadius: 24, margin: 12, marginTop: 4,overflow: 'hidden', paddingBottom: 80,},

  tabsScroll:   { flexGrow: 0 },
  tabsContent:  { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, gap: 4 },
  tabBtn:       { paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', position: 'relative' },
  tabText:      { color: MUTED, fontSize: 15, fontWeight: '500' },
  tabTextActive:{ color: ACCENT, fontWeight: '600' },
  tabUnderline: {position: 'absolute', bottom: 0, left: 12, right: 12,height: 2, backgroundColor: ACCENT, borderRadius: 999,},

  filterRow: {flexDirection: 'row', alignItems: 'center',paddingHorizontal: 16, paddingVertical: 10, gap: 8,},
  comboBox: {flex: 1, flexDirection: 'row', alignItems: 'center',backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 9,gap: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',},
  comboEmoji:   { fontSize: 15 },
  comboText:    { flex: 1, color: WHITE, fontSize: 13, fontWeight: '500' },
  comboChevron: { color: MUTED, fontSize: 14 },

  typeToggle: {flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.07)',borderRadius: 10, padding: 3, gap: 2,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  typeBtn:         { paddingHorizontal: 10, paddingVertical: 7, alignItems: 'center' },
  typeBtnText:     { color: MUTED, fontSize: 14, fontWeight: '700' },
  typeBtnTextActive: { color: WHITE },

  searchRow: {flexDirection: 'row', alignItems: 'center',marginHorizontal: 16, marginBottom: 8,backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10, paddingHorizontal: 12,borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', gap: 8,},
  searchIcon:  { fontSize: 13 },
  searchInput: { flex: 1, color: WHITE, fontSize: 14, paddingVertical: 11 },
  clearIcon:   { color: MUTED, fontSize: 15, padding: 4 },

  listScroll:  { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24, gap: 20 },

  group:      { gap: 4 },
  dateHeader: { color: MUTED, fontSize: 13, fontWeight: '500', paddingVertical: 6 },

  txRow: {flexDirection: 'row', alignItems: 'center', gap: 12,paddingVertical: 12, paddingHorizontal: 4,},
  txIconWrap: {width: 40, height: 40, borderRadius: 20,alignItems: 'center', justifyContent: 'center',},
  txInfo:   { flex: 1 },
  txName:   { color: WHITE, fontSize: 15, fontWeight: '600' },
  txMeta:   { color: MUTED, fontSize: 12, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '600' },

  emptyState: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyIcon:  { fontSize: 40 },
  emptyText:  { color: MUTED, fontSize: 16 },

  fab: {position: 'absolute', bottom: 28, alignSelf: 'center',width: 60, height: 60, borderRadius: 30,backgroundColor: FAB, alignItems: 'center',
    justifyContent: 'center',shadowColor: FAB, shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.4, shadowRadius: 10, elevation: 8,
  },
  fabIcon: { color: WHITE, fontSize: 28, fontWeight: '300', lineHeight: 32 },

  modalBackdrop: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end',},
  modalSheet: {backgroundColor: '#1a2e22',borderTopLeftRadius: 24, borderTopRightRadius: 24,paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40,},
  modalHandle: {width: 36, height: 4, backgroundColor: 'rgba(255,255,255,0.2)',borderRadius: 999, alignSelf: 'center', marginBottom: 20,},
  modalTitle:   { color: WHITE, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  accountRow:   { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  accountIcon:  { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  accountEmoji: { fontSize: 22 },
  accountName:  { flex: 1, color: WHITE, fontSize: 16, fontWeight: '500' },
  checkmark:    { fontSize: 20, fontWeight: '700' },
  modalDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
});