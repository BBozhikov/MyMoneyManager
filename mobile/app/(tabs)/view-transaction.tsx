import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BG = '#3b6861';
const CARD = '#1e2d22';
const WHITE = '#ffffff';
const MUTED = 'rgba(255,255,255,0.45)';
const ACCENT = '#3ecf8e';
const RED = '#ff3b30';

const ACCOUNTS = [
  { id: '1', name: 'Кеш',    emoji: <FontAwesome5 name="receipt" size={24} color="white" /> },
  { id: '2', name: 'ДСК',    emoji: <FontAwesome5 name="receipt" size={24} color="white" /> },
  { id: '3', name: 'Revolut', emoji: <FontAwesome5 name="receipt" size={24} color="white" /> },
];

const CATEGORIES = [
  { id: 'food',      name: 'Храна',        emoji: <FontAwesome5 name="receipt" size={24} color="white" />, color: '#ff7043' },
  { id: 'transport', name: 'Транспорт',    emoji: <FontAwesome5 name="bus" size={24} color="white" />, color: '#007aff' },
  { id: 'bills',     name: 'Сметки',       emoji: <FontAwesome5 name="file-invoice" size={24} color="white" />, color: '#5856d6' },
  { id: 'fun',       name: 'Развлечения',  emoji: <FontAwesome5 name="film" size={24} color="white" />, color: '#e91e8c' },
  { id: 'health',    name: 'Здраве',       emoji: <FontAwesome5 name="pills" size={24} color="white" />, color: '#ff3b30' },
  { id: 'home',      name: 'Жилище',       emoji: <FontAwesome5 name="home" size={24} color="white" />, color: '#4a7c6f' },
  { id: 'salary',    name: 'Заплата',      emoji: <FontAwesome5 name="money-bill" size={24} color="white" />, color: '#34c759' },
  { id: 'freelance', name: 'Freelance',    emoji: <FontAwesome5 name="laptop" size={24} color="white" />, color: '#007aff' },
];

function formatAmount(n: number) {
  const sign = n >= 0 ? '+ ' : '- ';
  return sign + Math.abs(n).toLocaleString('bg-BG', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }) + ' лв';
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });
}

function formatDateTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('bg-BG') + ' г. ' +
    d.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' }) + ' ч.';
}

export default function TransactionDetailsScreen() {
  const { id, accountId, amount, description, categoryId, date } = useLocalSearchParams<{
    id: string;
    accountId: string;
    amount: string;
    description: string;
    categoryId: string;
    date: string;
  }>();

  const account = ACCOUNTS.find(a => a.id === accountId);
  const category = CATEGORIES.find(c => c.id === categoryId);
  const amountNum = parseFloat(amount ?? '0');
  const isIncome = amountNum >= 0;

  const handleDelete = () => {
    Alert.alert(
      'Изтриване',
      `Сигурни ли сте, че искате да изтриете "${description}"?`,
      [
        { text: 'Отказ', style: 'cancel' },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: () => router.replace('/(tabs)/transactions'),
        },
      ]
    );
  };

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
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.12)' }]}>
              <Text style={styles.iconEmoji}>{account?.emoji ?? '💳'}</Text>
            </View>
            <Text style={styles.fieldValue}>{account?.name ?? accountId}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.label}>Категория</Text>
          <View style={styles.iconRow}>
            <View style={[styles.iconCircle, { backgroundColor: category?.color ?? '#888' }]}>
              <Text style={styles.iconEmoji}>{category?.emoji ?? '💸'}</Text>
            </View>
            <Text style={styles.fieldValue}>{category?.name ?? categoryId}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {description ? (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Бележка</Text>
              <Text style={styles.fieldValue}>{description}</Text>
            </View>
            <View style={styles.divider} />
          </>
        ) : null}

        {date ? (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Дата</Text>
              <Text style={styles.fieldValue}>{formatDate(date)}</Text>
            </View>
            <View style={styles.divider} />
          </>
        ) : null}

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

  deleteBtn: { marginTop: 16, paddingVertical: 8 },
  deleteBtnText: { color: RED, fontSize: 16, fontWeight: '700', letterSpacing: 1 },

  createdAt: { color: MUTED, fontSize: 12, marginTop: 32 },
});