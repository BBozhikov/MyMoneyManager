import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG     = '#3b6861';
const CARD   = '#1e2d22';
const WHITE  = '#ffffff';
const MUTED  = 'rgba(255,255,255,0.45)';
const ACCENT = '#3ecf8e';
const FAB    = '#f5a623';

type TxType = 'all' | 'expense' | 'income';
type SortKey = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

const ACCOUNTS: {id: string; name: string; emoji: any}[]= [
  { id: 'all', name: 'Всички сметки', emoji: <FontAwesome5 name="clipboard" size={24} color="white" /> },
  { id: '1',   name: 'Кеш',          emoji: <FontAwesome name="money" size={24} color="white" /> },
  { id: '2',   name: 'ДСК',          emoji: <AntDesign name="bank" size={24} color="white" /> },
  { id: '3',   name: 'Revolut',      emoji: <FontAwesome name="credit-card" size={24} color="white" /> },
];

const CATEGORIES: {id: string; name: string; emoji: any}[] = [
  { id: 'all',          name: 'Всички категории', emoji: <FontAwesome5 name="clipboard" size={24} color="white" /> },
  { id: 'food',         name: 'Храна',            emoji: <FontAwesome5 name="hamburger" size={24} color="white" /> },
  { id: 'transport',    name: 'Транспорт',        emoji: <AntDesign name="car" size={24} color="white" /> },
  { id: 'bills',        name: 'Сметки',           emoji: <AntDesign name="audit" size={24} color="white" /> },
  { id: 'fun',          name: 'Развлечения',      emoji: <Ionicons name="game-controller-sharp" size={24} color="white" /> },
  { id: 'health',       name: 'Здраве',           emoji: <FontAwesome5 name="pills" size={24} color="white" /> },
  { id: 'home',         name: 'Жилище',           emoji: <FontAwesome5 name="house-user" size={24} color="white" /> },
  { id: 'salary',       name: 'Заплата',          emoji: <FontAwesome6 name="sack-dollar" size={24} color="white" /> },
  { id: 'freelance',    name: 'Freelance',        emoji: <AntDesign name="laptop" size={24} color="white" /> },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'date_desc',   label: 'Дата (ново → старо)' },
  { key: 'date_asc',    label: 'Дата (старо → ново)' },
  { key: 'amount_desc', label: 'Сума (намаляваща)'   },
  { key: 'amount_asc',  label: 'Сума (нарастваща)'   },
];

const PERIODS = ['Ден', 'Седмица', 'Месец', 'Година', 'Период'];

const TRANSACTIONS = [
  { id: '1',  accountId: '1', categoryId: 'food',      type: 'expense', description: 'Kaufland',          amount: -47.30,  date: new Date(2025, 3, 10) },
  { id: '2',  accountId: '2', categoryId: 'transport', type: 'expense', description: 'Градски транспорт', amount: -3.00,   date: new Date(2025, 3, 10) },
  { id: '3',  accountId: '3', categoryId: 'salary',    type: 'income',  description: 'Заплата Април',     amount: +2000,   date: new Date(2025, 3, 8)  },
  { id: '4',  accountId: '1', categoryId: 'fun',       type: 'expense', description: 'Кино',              amount: -22.00,  date: new Date(2025, 3, 7)  },
  { id: '5',  accountId: '2', categoryId: 'bills',     type: 'expense', description: 'Ток',               amount: -89.50,  date: new Date(2025, 3, 5)  },
  { id: '6',  accountId: '1', categoryId: 'food',      type: 'expense', description: 'Лидл',              amount: -31.20,  date: new Date(2025, 3, 4)  },
  { id: '7',  accountId: '3', categoryId: 'freelance', type: 'income',  description: 'Проект уебсайт',    amount: +450,    date: new Date(2025, 3, 2)  },
  { id: '8',  accountId: '2', categoryId: 'health',    type: 'expense', description: 'Аптека',            amount: -18.70,  date: new Date(2025, 2, 30) },
  { id: '9',  accountId: '1', categoryId: 'home',      type: 'expense', description: 'Наем',              amount: -550.00, date: new Date(2025, 2, 28) },
  { id: '10', accountId: '3', categoryId: 'transport', type: 'expense', description: 'Гориво',            amount: -65.00,  date: new Date(2025, 2, 25) },
];

function formatAmount(n: number) {
  const sign = n >= 0 ? '+ ' : '- ';
  return sign + Math.abs(n).toLocaleString('bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}

function formatDateHeader(d: Date) {
  return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
}

function groupByDate(txs: typeof TRANSACTIONS) {
  const map = new Map<string, typeof TRANSACTIONS>();
  for (const t of txs) {
    const key = t.date.toDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  return Array.from(map.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([key, items]) => ({ date: new Date(key), items }));
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
  items: { id: string; name: string; emoji: string }[];
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{title}</Text>
          {items.map((item, index) => (
            <View key={item.id}>
              <TouchableOpacity
                style={styles.accountRow}
                onPress={() => { onSelect(item.id); onClose(); }}
                activeOpacity={0.75}
              >
                <View style={[styles.accountIcon, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
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
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function SortModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: SortKey;
  onSelect: (k: SortKey) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Сортирай по</Text>
          {SORT_OPTIONS.map((opt, index) => (
            <View key={opt.key}>
              <TouchableOpacity
                style={styles.accountRow}
                onPress={() => { onSelect(opt.key); onClose(); }}
                activeOpacity={0.75}
              >
                <Text style={[styles.accountName, { marginLeft: 4 }]}>{opt.label}</Text>
                {selected === opt.key && (
                  <Text style={[styles.checkmark, { color: ACCENT }]}>✓</Text>
                )}
              </TouchableOpacity>
              {index < SORT_OPTIONS.length - 1 && <View style={styles.modalDivider} />}
            </View>
          ))}
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
  const [sort,            setSort]            = useState<SortKey>('date_desc');
  const [accountModal,    setAccountModal]    = useState(false);
  const [catModal,        setCatModal]        = useState(false);
  const [sortModal,       setSortModal]       = useState(false);

  const activeAccount  = ACCOUNTS.find(a => a.id === selectedAccount)!;
  const activeCategory = CATEGORIES.find(c => c.id === selectedCat)!;

  let filtered = TRANSACTIONS
    .filter(t => selectedAccount === 'all' || t.accountId === selectedAccount)
    .filter(t => selectedCat     === 'all' || t.categoryId === selectedCat)
    .filter(t => txType          === 'all' || (txType === 'expense' ? t.amount < 0 : t.amount > 0))
    .filter(t => search.trim() === '' || t.description.toLowerCase().includes(search.toLowerCase()));

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'date_desc')   return b.date.getTime() - a.date.getTime();
    if (sort === 'date_asc')    return a.date.getTime() - b.date.getTime();
    if (sort === 'amount_desc') return Math.abs(b.amount) - Math.abs(a.amount);
    return Math.abs(a.amount) - Math.abs(b.amount);
  });

  const groups = groupByDate(filtered);
  const catEntry = CATEGORIES.find(c => c.id === selectedCat)!;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/main')} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Транзакции</Text>
        <TouchableOpacity
          style={styles.accountPickerBtn}
          onPress={() => setAccountModal(true)}
          activeOpacity={0.75}
        >
          <Text style={styles.accountPickerEmoji}>{activeAccount.emoji}</Text>
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
            <Text style={styles.comboEmoji}>{activeCategory.emoji}</Text>
            <Text style={styles.comboText} numberOfLines={1}>
              {selectedCat === 'all' ? 'Категория' : activeCategory.name}
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
                onPress={() => setTxType(t)}
                activeOpacity={0.75}
              >
                <Text style={[styles.typeBtnText, txType === t && styles.typeBtnTextActive]}>
                  {t === 'all' ? '∞' : t === 'expense' ? '↓' : '↑'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.sortBtn}
            onPress={() => setSortModal(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.sortIcon}><FontAwesome name="sort" size={24} color="white" /></Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}><Entypo name="magnifying-glass" size={24} color="white" /></Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Търси транзакция…"
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

        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {groups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Няма транзакции</Text>
            </View>
          ) : (
            groups.map(group => (
              <View key={group.date.toDateString()} style={styles.group}>
                <Text style={styles.dateHeader}>{formatDateHeader(group.date)}</Text>
                {group.items.map(tx => {
                  const cat = CATEGORIES.find(c => c.id === tx.categoryId)!;
                  return (
                    <TouchableOpacity key={tx.id} style={styles.txRow} activeOpacity={0.75}>
                      <View style={styles.txIconWrap}>
                        <Text style={{ fontSize: 20 }}>{cat?.emoji ?? '💸'}</Text>
                      </View>
                      <View style={styles.txInfo}>
                        <Text style={styles.txName}>{tx.description}</Text>
                        <Text style={styles.txMeta}>{cat?.name} · {ACCOUNTS.find(a => a.id === tx.accountId)?.name}</Text>
                      </View>
                      <Text style={[styles.txAmount, { color: tx.amount >= 0 ? ACCENT : '#ff3b30' }]}>
                        {formatAmount(tx.amount)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/(tabs)/add-transaction')} activeOpacity={0.85}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <PickerModal
        visible={accountModal}
        title="Изберете сметка"
        items={ACCOUNTS}
        selected={selectedAccount}
        onSelect={setSelectedAccount}
        onClose={() => setAccountModal(false)}
      />
      <PickerModal
        visible={catModal}
        title="Изберете категория"
        items={CATEGORIES}
        selected={selectedCat}
        onSelect={setSelectedCat}
        onClose={() => setCatModal(false)}
      />
      <SortModal
        visible={sortModal}
        selected={sort}
        onSelect={setSort}
        onClose={() => setSortModal(false)}
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

  sortBtn: {width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.07)',borderRadius: 10, alignItems: 'center', 
    justifyContent: 'center',borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',},
  sortIcon: { color: WHITE, fontSize: 18 },

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
  txIconWrap: {width: 40, height: 40, borderRadius: 20,backgroundColor: 'rgba(255,255,255,0.07)',alignItems: 'center', justifyContent: 'center',},
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