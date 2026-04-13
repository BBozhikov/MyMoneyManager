import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Data ─────────────────────────────────────────────────────────────────────

const ICONS = [
  { id: 'cash',       emoji: '💵' },
  { id: 'bank',       emoji: '🏦' },
  { id: 'pound',      emoji: '💷' },
  { id: 'card',       emoji: '💳' },
  { id: 'wallet',     emoji: '👛' },
  { id: 'savings',    emoji: '🐖' },
  { id: 'paypal',     emoji: '🅿️' },
  { id: 'safe',       emoji: '🔐' },
  { id: 'bitcoin',    emoji: '₿' },
  { id: 'ethereum',   emoji: '⟠' },
  { id: 'dollar',     emoji: '💲' },
  { id: 'euro',       emoji: '€' },
  { id: 'yen',        emoji: '¥' },
  { id: 'chart',      emoji: '📊' },
  { id: 'bag',        emoji: '💰' },
  { id: 'percent',    emoji: '％' },
  { id: 'invest',     emoji: '📈' },
  { id: 'diamond',    emoji: '💎' },
  { id: 'gold',       emoji: '🥇' },
  { id: 'coins',      emoji: '🪙' },
];

const COLORS = [
  '#f5a623', // amber
  '#00d4ff', // cyan
  '#e91e8c', // pink
  '#ff7043', // orange
  '#4a7c6f', // teal-dark
  '#34c759', // green
  '#ff3b30', // red
  '#5856d6', // purple
  '#ffcc00', // yellow
  '#007aff', // blue
];

const CURRENCIES = [
  'BGN', 'EUR', 'USD', 'GBP', 'CHF',
  'JPY', 'CAD', 'AUD', 'CNY', 'RUB',
  'TRY', 'NOK', 'SEK', 'DKK', 'PLN',
];

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function NewAccountScreen() {
  const router = useRouter();

  const [amount, setAmount]           = useState('');
  const [name, setName]               = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [currency, setCurrency]       = useState('BGN');
  const [excludeBalance, setExcludeBalance] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    // TODO: save account to your store/db
    Alert.alert('Успех', `Сметката "${name}" беше създадена!`, [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const currentIcon = ICONS.find(i => i.id === selectedIcon)?.emoji ?? '💵';

  return (
    <SafeAreaView style={styles.safe}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Добавяне на сметка</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* AMOUNT + CURRENCY */}
        <View style={styles.amountRow}>
          <TextInput
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
            placeholder="0"
            placeholderTextColor={MUTED}
            keyboardType="decimal-pad"
            selectionColor={ACCENT}
          />
          <TouchableOpacity onPress={() => setCurrencyModal(true)} activeOpacity={0.75}>
            <Text style={styles.currencyLabel}>{currency}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.amountUnderline} />

        {/* NAME */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Име на сметката</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            placeholder="Въведете име на сметката"
            placeholderTextColor={MUTED}
            selectionColor={ACCENT}
          />
          <View style={styles.nameUnderline} />
        </View>

        {/* ICON PICKER */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Икони</Text>
          <View style={styles.iconsGrid}>
            {ICONS.map((icon) => {
              const isSelected = icon.id === selectedIcon;
              return (
                <TouchableOpacity
                  key={icon.id}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: isSelected ? selectedColor : ICON_BG },
                    isSelected && { borderWidth: 2.5, borderColor: selectedColor + 'aa' },
                  ]}
                  onPress={() => setSelectedIcon(icon.id)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.iconEmoji}>{icon.emoji}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* COLOR PICKER */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Цвят</Text>
          <View style={styles.colorsRow}>
            {COLORS.map((color) => {
              const isSelected = color === selectedColor;
              return (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: color },
                    isSelected && styles.colorBtnSelected,
                  ]}
                  onPress={() => setSelectedColor(color)}
                  activeOpacity={0.8}
                >
                  {isSelected && <Text style={styles.colorCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* CURRENCY (tap opens modal) */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Изберете валута</Text>
          <TouchableOpacity onPress={() => setCurrencyModal(true)} activeOpacity={0.75}>
            <Text style={styles.currencyValue}>{currency}</Text>
          </TouchableOpacity>
        </View>

        {/* EXCLUDE FROM BALANCE */}
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Не включвай в общия баланс</Text>
          <Switch
            value={excludeBalance}
            onValueChange={setExcludeBalance}
            trackColor={{ false: 'rgba(255,255,255,0.15)', true: ACCENT }}
            thumbColor={excludeBalance ? '#fff' : 'rgba(255,255,255,0.6)'}
          />
        </View>

      </ScrollView>

      {/* SUBMIT BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: selectedColor, opacity: canSubmit ? 1 : 0.45 }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>Добавяне</Text>
        </TouchableOpacity>
      </View>

      {/* CURRENCY MODAL */}
      <Modal visible={currencyModal} transparent animationType="slide" onRequestClose={() => setCurrencyModal(false)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setCurrencyModal(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Валута</Text>
            <FlatList
              data={CURRENCIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.currencyRow}
                  activeOpacity={0.7}
                  onPress={() => { setCurrency(item); setCurrencyModal(false); }}
                >
                  <Text style={styles.currencyRowText}>{item}</Text>
                  {item === currency && <Text style={[styles.currencyCheck, { color: ACCENT }]}>✓</Text>}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
            />
          </View>
        </TouchableOpacity>
      </Modal>

    </SafeAreaView>
  );
}

const BG      = '#3b6861';
const HEADER  = '#3b6861';
const CARD    = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.12)';
const WHITE   = '#ffffff';
const MUTED   = 'rgba(255,255,255,0.45)';
const ACCENT  = '#3ecf8e';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  // Header
  header: {flexDirection: 'row',alignItems: 'center',backgroundColor: HEADER,paddingHorizontal: 16,paddingVertical: 14,justifyContent: 'space-between',},
  backBtn: { width: 40, alignItems: 'flex-start' },
  backArrow: { color: WHITE, fontSize: 22 },
  headerTitle: { color: WHITE, fontSize: 18, fontWeight: '700' },

  // Scroll
  scroll: { flex: 1 },
  content: { padding: 24, paddingBottom: 120, gap: 28 },

  // Amount
  amountRow: {flexDirection: 'row',alignItems: 'flex-end',justifyContent: 'center',gap: 12,marginTop: 8,},
  amountInput: {color: WHITE,fontSize: 44,fontWeight: '300',letterSpacing: -1,textAlign: 'center',minWidth: 80,padding: 0,},
  currencyLabel: {color: ACCENT,fontSize: 28,fontWeight: '600',paddingBottom: 4,},
  amountUnderline: {height: 1,backgroundColor: 'rgba(255,255,255,0.2)',marginHorizontal: 40,marginTop: -16,},

  // Section
  section: { gap: 14 },
  sectionLabel: { color: MUTED, fontSize: 15 },

  // Name input
  nameInput: {color: WHITE,fontSize: 16,paddingBottom: 8,padding: 0,},
  nameUnderline: { height: 1.5, backgroundColor: ACCENT },

  // Icons grid
  iconsGrid: {flexDirection: 'row',flexWrap: 'wrap',gap: 12,},
  iconBtn: {width: 64,height: 64,borderRadius: 32,alignItems: 'center',justifyContent: 'center',},
  iconEmoji: { fontSize: 26 },

  // Colors row
  colorsRow: {flexDirection: 'row',flexWrap: 'wrap',gap: 12,},
  colorBtn: {width: 44,height: 44,borderRadius: 22,alignItems: 'center',justifyContent: 'center',},
  colorBtnSelected: {borderWidth: 3,borderColor: 'rgba(255,255,255,0.6)',},
  colorCheck: { color: WHITE, fontSize: 18, fontWeight: '700' },

  // Currency value
  currencyValue: {color: ACCENT,fontSize: 22,fontWeight: '600',},

  // Toggle
  toggleRow: {flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingVertical: 4,},
  toggleLabel: { color: WHITE, fontSize: 16, flex: 1 },

  // Footer
  footer: {position: 'absolute',bottom: 0, left: 0, right: 0,padding: 20,paddingBottom: 32,backgroundColor: BG,},
  submitBtn: {borderRadius: 999,paddingVertical: 17,alignItems: 'center',},
  submitText: { color: WHITE, fontSize: 17, fontWeight: '700' },

  // Currency modal
  modalBackdrop: {flex: 1,backgroundColor: 'rgba(0,0,0,0.5)',justifyContent: 'flex-end',},
  modalSheet: {backgroundColor: '#1a2e22',borderTopLeftRadius: 24,borderTopRightRadius: 24,paddingHorizontal: 24,paddingTop: 16,paddingBottom: 40,maxHeight: '60%',},
  modalHandle: {width: 36, height: 4,backgroundColor: 'rgba(255,255,255,0.2)',borderRadius: 999,alignSelf: 'center',marginBottom: 20,},
  modalTitle: { color: WHITE, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  currencyRow: {flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingVertical: 14,},
  currencyRowText: { color: WHITE, fontSize: 16 },
  currencyCheck: { fontSize: 18, fontWeight: '700' },
  modalDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
});