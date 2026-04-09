import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Mock data — replace with your real accounts ──────────────────────────────
const ACCOUNTS = [
  { id: '1', name: 'Основен',        balance: 202.58,  emoji: '💵', color: '#f5a623' },
  { id: '2', name: 'Банкова сметка', balance: 1031.00, emoji: '🏦', color: '#007aff' },
  { id: '3', name: 'Спестявания',    balance: 540.00,  emoji: '🐖', color: '#34c759' },
];

function formatAmount(n: number) {
  return n.toLocaleString('bg-BG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatDate(d: Date) {
  return d.toLocaleDateString('bg-BG', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ─── Account picker modal ─────────────────────────────────────────────────────
function AccountPickerModal({
  visible,
  selected,
  exclude,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: string | null;
  exclude: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const options = ACCOUNTS.filter(a => a.id !== exclude);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Изберете сметка</Text>
          {options.map((account, index) => (
            <View key={account.id}>
              <TouchableOpacity
                style={styles.accountRow}
                activeOpacity={0.7}
                onPress={() => { onSelect(account.id); onClose(); }}
              >
                <View style={[styles.accountIcon, { backgroundColor: account.color + '33' }]}>
                  <Text style={styles.accountIconEmoji}>{account.emoji}</Text>
                </View>
                <View style={styles.accountInfo}>
                  <Text style={styles.accountName}>{account.name}</Text>
                  <Text style={styles.accountBalance}>{formatAmount(account.balance)} лв</Text>
                </View>
                {selected === account.id && (
                  <Text style={[styles.checkmark, { color: ACCENT }]}>✓</Text>
                )}
              </TouchableOpacity>
              {index < options.length - 1 && <View style={styles.modalDivider} />}
            </View>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Date picker modal (simple day picker) ────────────────────────────────────
function DatePickerModal({
  visible,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  selected: Date;
  onSelect: (d: Date) => void;
  onClose: () => void;
}) {
  const today = new Date();
  // Build last 30 days + next 7 days
  const days: Date[] = [];
  for (let i = -30; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose}>
        <View style={[styles.modalSheet, { maxHeight: '55%' }]}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Изберете дата</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {days.map((day, index) => {
              const isSelected = day.toDateString() === selected.toDateString();
              const isToday = day.toDateString() === today.toDateString();
              return (
                <View key={day.toISOString()}>
                  <TouchableOpacity
                    style={styles.dateRow}
                    activeOpacity={0.7}
                    onPress={() => { onSelect(day); onClose(); }}
                  >
                    <Text style={[styles.dateRowText, isSelected && { color: ACCENT, fontWeight: '700' }]}>
                      {formatDate(day)}{isToday ? '  •  Днес' : ''}
                    </Text>
                    {isSelected && <Text style={[styles.checkmark, { color: ACCENT }]}>✓</Text>}
                  </TouchableOpacity>
                  {index < days.length - 1 && <View style={styles.modalDivider} />}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function NewTransferScreen() {
  const router = useRouter();

  const [fromId, setFromId]       = useState<string | null>(null);
  const [toId, setToId]           = useState<string | null>(null);
  const [amount, setAmount]       = useState('');
  const [date, setDate]           = useState(new Date());
  const [comment, setComment]     = useState('');

  const [fromModal, setFromModal] = useState(false);
  const [toModal, setToModal]     = useState(false);
  const [dateModal, setDateModal] = useState(false);

  const fromAccount = ACCOUNTS.find(a => a.id === fromId);
  const toAccount   = ACCOUNTS.find(a => a.id === toId);

  const canSubmit = !!fromId && !!toId && parseFloat(amount) > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    Alert.alert(
      'Успех',
      `Преведени ${amount} лв от "${fromAccount?.name}" към "${toAccount?.name}".`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Нов превод</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* AMOUNT */}
        <View style={styles.amountSection}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={MUTED}
            keyboardType="decimal-pad"
            selectionColor={ACCENT}
          />
          <Text style={styles.amountCurrency}>лв</Text>
        </View>
        <View style={styles.amountUnderline} />

        {/* FROM → TO */}
        <View style={styles.transferRow}>
          {/* FROM */}
          <TouchableOpacity
            style={[styles.accountCard, fromAccount && { borderColor: fromAccount.color + '55' }]}
            onPress={() => setFromModal(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.cardDirectionLabel}>От</Text>
            {fromAccount ? (
              <>
                <View style={[styles.cardIcon, { backgroundColor: fromAccount.color + '33' }]}>
                  <Text style={styles.cardEmoji}>{fromAccount.emoji}</Text>
                </View>
                <Text style={styles.cardName} numberOfLines={1}>{fromAccount.name}</Text>
                <Text style={styles.cardBalance}>{formatAmount(fromAccount.balance)} лв</Text>
              </>
            ) : (
              <>
                <View style={styles.cardIconEmpty}>
                  <Text style={styles.cardEmptyPlus}>＋</Text>
                </View>
                <Text style={styles.cardNameEmpty}>Изберете</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Arrow */}
          <View style={styles.arrowContainer}>
            <Text style={styles.arrowIcon}>→</Text>
          </View>

          {/* TO */}
          <TouchableOpacity
            style={[styles.accountCard, toAccount && { borderColor: toAccount.color + '55' }]}
            onPress={() => setToModal(true)}
            activeOpacity={0.75}
          >
            <Text style={styles.cardDirectionLabel}>Към</Text>
            {toAccount ? (
              <>
                <View style={[styles.cardIcon, { backgroundColor: toAccount.color + '33' }]}>
                  <Text style={styles.cardEmoji}>{toAccount.emoji}</Text>
                </View>
                <Text style={styles.cardName} numberOfLines={1}>{toAccount.name}</Text>
                <Text style={styles.cardBalance}>{formatAmount(toAccount.balance)} лв</Text>
              </>
            ) : (
              <>
                <View style={styles.cardIconEmpty}>
                  <Text style={styles.cardEmptyPlus}>＋</Text>
                </View>
                <Text style={styles.cardNameEmpty}>Изберете</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* DETAILS CARD */}
        <View style={styles.detailsCard}>

          {/* Date */}
          <TouchableOpacity style={styles.detailRow} onPress={() => setDateModal(true)} activeOpacity={0.75}>
            <Text style={styles.detailIcon}>📅</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Дата</Text>
              <Text style={styles.detailValue}>{formatDate(date)}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Comment */}
          <View style={styles.detailRow}>
            <Text style={styles.detailIcon}>💬</Text>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Коментар</Text>
              <TextInput
                style={styles.commentInput}
                value={comment}
                onChangeText={setComment}
                placeholder="Добавете бележка (незадължително)"
                placeholderTextColor={MUTED}
                selectionColor={ACCENT}
                multiline
              />
            </View>
          </View>

        </View>

      </ScrollView>

      {/* SUBMIT */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, { opacity: canSubmit ? 1 : 0.4 }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>Потвърди превода</Text>
        </TouchableOpacity>
      </View>

      {/* MODALS */}
      <AccountPickerModal
        visible={fromModal}
        selected={fromId}
        exclude={toId}
        onSelect={setFromId}
        onClose={() => setFromModal(false)}
      />
      <AccountPickerModal
        visible={toModal}
        selected={toId}
        exclude={fromId}
        onSelect={setToId}
        onClose={() => setToModal(false)}
      />
      <DatePickerModal
        visible={dateModal}
        selected={date}
        onSelect={setDate}
        onClose={() => setDateModal(false)}
      />

    </SafeAreaView>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────
const BG    = '#3b6861';
const HEADER = '#3b6861';
const CARD  = 'rgba(255,255,255,0.07)';
const WHITE = '#ffffff';
const MUTED = 'rgba(255,255,255,0.4)';
const ACCENT = '#3ecf8e';

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: HEADER,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 40 },
  backArrow: { color: WHITE, fontSize: 22 },
  headerTitle: { color: WHITE, fontSize: 18, fontWeight: '700' },

  scroll: { flex: 1 },
  content: { padding: 24, paddingBottom: 120, gap: 24 },

  // Amount
  amountSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  amountInput: {
    color: WHITE,
    fontSize: 52,
    fontWeight: '300',
    letterSpacing: -1.5,
    padding: 0,
    minWidth: 80,
    textAlign: 'center',
  },
  amountCurrency: {
    color: ACCENT,
    fontSize: 28,
    fontWeight: '600',
    paddingBottom: 6,
  },
  amountUnderline: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 40,
    marginTop: -14,
  },

  // Transfer row
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  accountCard: {
    flex: 1,
    backgroundColor: CARD,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.08)',
    minHeight: 130,
    justifyContent: 'center',
  },
  cardDirectionLabel: {
    color: MUTED,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    position: 'absolute',
    top: 12,
    left: 14,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  cardEmoji: { fontSize: 24 },
  cardIconEmpty: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  cardEmptyPlus: { color: MUTED, fontSize: 22, fontWeight: '300' },
  cardName: { color: WHITE, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  cardNameEmpty: { color: MUTED, fontSize: 14 },
  cardBalance: { color: MUTED, fontSize: 12, textAlign: 'center' },

  // Arrow
  arrowContainer: { alignItems: 'center', justifyContent: 'center', width: 28 },
  arrowIcon: { color: ACCENT, fontSize: 22 },

  // Details card
  detailsCard: {
    backgroundColor: CARD,
    borderRadius: 20,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  detailIcon: { fontSize: 20, marginTop: 1 },
  detailContent: { flex: 1, gap: 4 },
  detailLabel: { color: MUTED, fontSize: 12, fontWeight: '500' },
  detailValue: { color: WHITE, fontSize: 15, fontWeight: '500' },
  commentInput: {
    color: WHITE,
    fontSize: 15,
    padding: 0,
    lineHeight: 22,
  },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 16 },
  chevron: { color: MUTED, fontSize: 22, fontWeight: '300', alignSelf: 'center' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    padding: 20,
    paddingBottom: 36,
    backgroundColor: BG,
  },
  submitBtn: {
    backgroundColor: ACCENT,
    borderRadius: 999,
    paddingVertical: 17,
    alignItems: 'center',
  },
  submitText: { color: '#0d1a10', fontSize: 17, fontWeight: '700' },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#1a2e22',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 36, height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 999,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: { color: WHITE, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  accountIcon: {
    width: 46, height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountIconEmoji: { fontSize: 22 },
  accountInfo: { flex: 1 },
  accountName: { color: WHITE, fontSize: 16, fontWeight: '600' },
  accountBalance: { color: MUTED, fontSize: 13, marginTop: 2 },
  checkmark: { fontSize: 20, fontWeight: '700' },
  modalDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  dateRowText: { color: WHITE, fontSize: 15 },
});