import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Mock data — replace with your real data ──────────────────────────────────

const ACCOUNTS = [
  { id: 'all', name: 'Всички сметки', emoji: '📋', color: '#3ecf8e' },
  { id: '1',   name: 'Основен',        emoji: '💵', color: '#f5a623' },
  { id: '2',   name: 'Банкова сметка', emoji: '🏦', color: '#007aff' },
  { id: '3',   name: 'Спестявания',    emoji: '🐖', color: '#34c759' },
];

const TRANSFERS = [
  { id: 't1', accountId: '1', accountName: 'Основен',        emoji: '✏️', description: 'Регулиране на баланса', amount: +110,      date: new Date(2024, 4, 8) },
  { id: 't2', accountId: '1', accountName: 'Основен',        emoji: '✏️', description: 'Регулиране на баланса', amount: +21.93,    date: new Date(2024, 3, 2) },
  { id: 't3', accountId: '1', accountName: 'Основен',        emoji: '✏️', description: 'Регулиране на баланса', amount: -134.92,   date: new Date(2024, 3, 2) },
  { id: 't4', accountId: '2', accountName: 'Банкова сметка', emoji: '💲', description: 'Първоначално салдо',    amount: +1305.09,  date: new Date(2024, 1, 21) },
  { id: 't5', accountId: '3', accountName: 'Спестявания',    emoji: '✏️', description: 'Регулиране на баланса', amount: +540.00,   date: new Date(2024, 1, 15) },
  { id: 't6', accountId: '2', accountName: 'Банкова сметка', emoji: '✏️', description: 'Превод към Основен',    amount: -200.00,   date: new Date(2024, 0, 10) },
];

const PERIODS = ['Ден', 'Седмица', 'Месец', 'Година', 'Период'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatAmount(n: number) {
  const sign = n >= 0 ? '+ ' : '- ';
  return sign + Math.abs(n).toLocaleString('bg-BG', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' лв';
}

function formatDateHeader(d: Date) {
  return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
}

function groupByDate(transfers: typeof TRANSFERS) {
  const map = new Map<string, typeof TRANSFERS>();
  for (const t of transfers) {
    const key = t.date.toDateString();
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(t);
  }
  // Sort by date descending
  return Array.from(map.entries())
    .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
    .map(([key, items]) => ({ date: new Date(key), items }));
}

// ─── Account picker modal ─────────────────────────────────────────────────────

function AccountPickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Изберете сметка</Text>
          {ACCOUNTS.map((account, index) => (
            <View key={account.id}>
              <TouchableOpacity
                style={styles.accountRow}
                activeOpacity={0.7}
                onPress={() => { onSelect(account.id); onClose(); }}
              >
                <View style={[styles.accountIcon, { backgroundColor: account.color + '25' }]}>
                  <Text style={styles.accountEmoji}>{account.emoji}</Text>
                </View>
                <Text style={styles.accountName}>{account.name}</Text>
                {selected === account.id && (
                  <Text style={[styles.checkmark, { color: ACCENT }]}>✓</Text>
                )}
              </TouchableOpacity>
              {index < ACCOUNTS.length - 1 && <View style={styles.modalDivider} />}
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function TransfersHistoryScreen() {
  const router = useRouter();

  const [period, setPeriod]           = useState('Период');
  const [selectedAccount, setSelectedAccount] = useState('all');
  const [accountModal, setAccountModal] = useState(false);

  const activeAccount = ACCOUNTS.find(a => a.id === selectedAccount)!;

  const filtered = selectedAccount === 'all'
    ? TRANSFERS
    : TRANSFERS.filter(t => t.accountId === selectedAccount);

  const groups = groupByDate(filtered);

  return (
    <SafeAreaView style={styles.safe}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Преводи</Text>
        {/* Account picker button */}
        <TouchableOpacity
          style={styles.accountPickerBtn}
          onPress={() => setAccountModal(true)}
          activeOpacity={0.75}
        >
          <Text style={styles.accountPickerEmoji}>{activeAccount.emoji}</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT CARD */}
      <View style={styles.contentCard}>

        {/* PERIOD TABS */}
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
              <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
                {p}
              </Text>
              {period === p && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* "Винаги" sub-label when Period is selected */}
        {period === 'Период' && (
          <TouchableOpacity activeOpacity={0.7} style={styles.alwaysRow}>
            <Text style={styles.alwaysText}>Винаги</Text>
          </TouchableOpacity>
        )}

        {/* TRANSFERS LIST */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {groups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>Няма преводи</Text>
            </View>
          ) : (
            groups.map(group => (
              <View key={group.date.toISOString()} style={styles.group}>
                {/* Date header */}
                <Text style={styles.dateHeader}>{formatDateHeader(group.date)}</Text>

                {/* Transfers for this date */}
                {group.items.map(transfer => (
                  <TouchableOpacity
                    key={transfer.id}
                    style={styles.transferRow}
                    activeOpacity={0.7}
                    onPress={() => {/* TODO: open transfer detail */}}
                  >
                    <View style={styles.transferIcon}>
                      <Text style={styles.transferEmoji}>{transfer.emoji}</Text>
                    </View>
                    <View style={styles.transferInfo}>
                      <Text style={styles.transferName}>{transfer.accountName}</Text>
                      <Text style={styles.transferDesc}>{transfer.description}</Text>
                    </View>
                    <Text style={[
                      styles.transferAmount,
                      { color: transfer.amount >= 0 ? ACCENT : '#ff3b30' },
                    ]}>
                      {formatAmount(transfer.amount)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/add-transfer')}
      >
        <Text style={styles.fabIcon}>＋</Text>
      </TouchableOpacity>

      {/* ACCOUNT PICKER MODAL */}
      <AccountPickerModal
        visible={accountModal}
        selected={selectedAccount}
        onSelect={setSelectedAccount}
        onClose={() => setAccountModal(false)}
      />

    </SafeAreaView>
  );
}

const BG     = '#3b6861';
const HEADER = '#3b6861';
const CARD   = '#1e2d22';
const WHITE  = '#ffffff';
const MUTED  = 'rgba(255,255,255,0.45)';
const ACCENT = '#3ecf8e';
const FAB    = '#f5a623';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  // Header
  header: {flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',backgroundColor: HEADER,paddingHorizontal: 16,paddingVertical: 14,},
  backBtn: { width: 40 },
  backArrow: { color: WHITE, fontSize: 22 },
  headerTitle: { color: WHITE, fontSize: 18, fontWeight: '700' },
  accountPickerBtn: {width: 40,height: 40,borderRadius: 20,backgroundColor: 'rgba(0,0,0,0.2)',alignItems: 'center',justifyContent: 'center',},
  accountPickerEmoji: { fontSize: 20 },

  // Content card (full rounded card below header)
  contentCard: {flex: 1,backgroundColor: CARD,borderRadius: 24,margin: 12,marginTop: 12,overflow: 'hidden',paddingBottom: 80,},

  // Period tabs
  tabsScroll: { flexGrow: 0 },
  tabsContent: {flexDirection: 'row',paddingHorizontal: 16,paddingTop: 16,gap: 4,},
  tabBtn: {paddingHorizontal: 12,paddingVertical: 8,alignItems: 'center',position: 'relative',},
  tabText: {color: MUTED,fontSize: 15,fontWeight: '500',},
  tabTextActive: {color: ACCENT,fontWeight: '600',},
  tabUnderline: {position: 'absolute',bottom: 0,left: 12,right: 12,height: 2,backgroundColor: ACCENT,borderRadius: 999,},

  // "Винаги"
  alwaysRow: {alignItems: 'center',paddingVertical: 10,},
  alwaysText: {color: WHITE,fontSize: 15,fontWeight: '600',textDecorationLine: 'underline',},

  // List
  listScroll: { flex: 1 },
  listContent: {paddingHorizontal: 16,paddingTop: 8,paddingBottom: 24,gap: 20,},

  // Group
  group: { gap: 4 },
  dateHeader: {color: MUTED,fontSize: 13,fontWeight: '500',paddingVertical: 6,},

  // Transfer row
  transferRow: {flexDirection: 'row',alignItems: 'center',gap: 14,paddingVertical: 12,},
  transferIcon: {width: 38,height: 38,alignItems: 'center',justifyContent: 'center',},
  transferEmoji: { fontSize: 22, color: MUTED },
  transferInfo: { flex: 1 },
  transferName: { color: WHITE, fontSize: 16, fontWeight: '600' },
  transferDesc: { color: MUTED, fontSize: 13, marginTop: 1 },
  transferAmount: { fontSize: 16, fontWeight: '600' },

  // Empty state
  emptyState: {alignItems: 'center',paddingTop: 60,gap: 12,},
  emptyIcon: { fontSize: 40 },
  emptyText: { color: MUTED, fontSize: 16 },

  // FAB
  fab: {position: 'absolute',bottom: 28,alignSelf: 'center',width: 60,height: 60,borderRadius: 30,backgroundColor: FAB,alignItems: 'center',
    justifyContent: 'center',shadowColor: FAB,shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.4,shadowRadius: 10,elevation: 8,},
  fabIcon: { color: WHITE, fontSize: 28, fontWeight: '300', lineHeight: 32 },

  // Modal
  modalBackdrop: {flex: 1,backgroundColor: 'rgba(0,0,0,0.5)',justifyContent: 'flex-end',},
  modalSheet: {backgroundColor: '#1a2e22',borderTopLeftRadius: 24,borderTopRightRadius: 24,paddingHorizontal: 24,paddingTop: 16,paddingBottom: 40,},
  modalHandle: {width: 36, height: 4,backgroundColor: 'rgba(255,255,255,0.2)',borderRadius: 999,alignSelf: 'center',marginBottom: 20,},
  modalTitle: { color: WHITE, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  accountRow: {flexDirection: 'row',alignItems: 'center',gap: 14,paddingVertical: 14,},
  accountIcon: {width: 44, height: 44, borderRadius: 22,alignItems: 'center', justifyContent: 'center',},
  accountEmoji: { fontSize: 22 },
  accountName: { flex: 1, color: WHITE, fontSize: 16, fontWeight: '500' },
  checkmark: { fontSize: 20, fontWeight: '700' },
  modalDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
});