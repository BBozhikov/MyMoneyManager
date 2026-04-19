import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ICONS = [
  { id: 'cash',       emoji: <FontAwesome name="money" size={24} color="white" /> },
  { id: 'bank',       emoji: <AntDesign name="bank" size={24} color="white" /> },
  { id: 'pound',      emoji: <AntDesign name="pound-circle" size={24} color="white" /> },
  { id: 'card',       emoji: <FontAwesome name="credit-card" size={24} color="white" /> },
  { id: 'wallet',     emoji: <FontAwesome5 name="wallet" size={24} color="white" /> },
  { id: 'savings',    emoji: <FontAwesome5 name="piggy-bank" size={24} color="white" />  },
  { id: 'paypal',     emoji: <FontAwesome name="paypal" size={24} color="white" /> },
  { id: 'safe',       emoji: <MaterialCommunityIcons name="safe" size={24} color="white" /> },
  { id: 'bitcoin',    emoji: <FontAwesome name="bitcoin" size={24} color="white" /> },
  { id: 'ethereum',   emoji: <FontAwesome5 name="ethereum" size={24} color="white" /> },
  { id: 'dollar',     emoji: <FontAwesome name="dollar" size={24} color="white" /> },
  { id: 'euro',       emoji: <FontAwesome name="euro" size={24} color="white" /> },
  { id: 'yen',        emoji: <FontAwesome name="yen" size={24} color="white" /> },
  { id: 'stocks',     emoji: <AntDesign name="stock" size={24} color="white" /> },
  { id: 'bag',        emoji: <FontAwesome6 name="sack-dollar" size={24} color="white" /> },
  { id: 'percent',    emoji: <FontAwesome5 name="percent" size={24} color="white" /> },
  { id: 'finance',    emoji: <MaterialCommunityIcons name="finance" size={24} color= "white" /> },
  { id: 'diamond',    emoji: <FontAwesome name="diamond" size={24} color="white" /> },
  { id: 'gold',       emoji: <MaterialCommunityIcons name="gold" size={24} color="white" /> },
  { id: 'coins',      emoji: <FontAwesome5 name="coins" size={24} color="white" /> },
];

const COLORS = [
  { id: 'amber',       color: '#f5a623' },
  { id: 'cyan',        color: '#00d4ff' },
  { id: 'pink',        color: '#e91e8c' },
  { id: 'orange',      color: '#ff7043' },
  { id: 'dark_green',  color: '#4a7c6f' },
  { id: 'light_green', color: '#34c759' },
  { id: 'red',         color: '#ff3b30' },
  { id: 'purple',      color: '#5856d6' },
  { id: 'yellow',      color: '#ffcc00' },
  { id: 'blue',        color: '#007aff' },
];

const CURRENCIES = [
  'EUR', 'USD', 'GBP', 'CHF',
  'JPY', 'CAD', 'AUD', 'CNY', 'RUB',
  'TRY', 'NOK', 'SEK', 'DKK', 'PLN',
];

export default function EditAccountScreen() {
  const router = useRouter();
  const {amount, name, colorId, iconId} = useLocalSearchParams<{
      id: string;
      name: string;
      colorId: string;
      iconId: string;
      amount: string;
    }>();
  const [amountState, setAmount] = useState(amount ?? '');
  const [nameState, setName] = useState(name ??'');
  const [selectedIcon, setSelectedIcon] = useState(iconId ?? ICONS[0].id);
  const [selectedColor, setSelectedColor] = useState(colorId ?? COLORS[0]);
  const [currency, setCurrency]       = useState('EUR');
  const [excludeBalance, setExcludeBalance] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);
  const currentColorHex = COLORS.find(c => c.id === selectedColor)?.color ?? COLORS[0].color;
  const canSubmit = nameState.trim().length > 0;

  useEffect(() => {
      setAmount(amount ?? '');
      setName(name ?? '');
      setSelectedIcon(iconId ?? ICONS[0].id);
      setSelectedColor(colorId ?? COLORS[0].id);
  }, [name, colorId, iconId, amount]);

  const handleSubmit = () => {
    if (!canSubmit) return;
   


    Alert.alert('Успех', `Сметката "${name}" беше променена!`, [
      { text: 'OK', onPress: () => router.replace("/(tabs)/explore") },
    ]);
  };

  const currentIcon = ICONS.find(i => i.id === selectedIcon)?.emoji ?? '';

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/explore")} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Редактиране на сметка</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.amountRow}>
          <TextInput
            style={styles.amountInput}
            value={amountState}
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

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Име на сметката</Text>
          <TextInput
            style={styles.nameInput}
            value={nameState}
            onChangeText={setName}
            //placeholder=""
            placeholderTextColor={MUTED}
            selectionColor={ACCENT}
          />
          <View style={styles.nameUnderline} />
        </View>

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
                    { backgroundColor: isSelected ? currentColorHex : ICON_BG },
                    isSelected && { borderWidth: 2.5, borderColor: `${currentColorHex}aa` },
                  ]}
                  onPress={() => setSelectedIcon(icon.id)}
                  activeOpacity={0.75}
                >
                  {icon.emoji}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Цвят</Text>
          <View style={styles.colorsRow}>
            {COLORS.map((color) => {
              const isSelected = color.id === selectedColor;
              return (
                <TouchableOpacity
                  key={color.id}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: color.color },
                    isSelected && styles.colorBtnSelected,
                  ]}
                  onPress={() => setSelectedColor(color.id)}
                  activeOpacity={0.8}
                >
                  {isSelected && <Text style={styles.colorCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Изберете валута</Text>
          <TouchableOpacity onPress={() => setCurrencyModal(true)} activeOpacity={0.75}>
            <Text style={styles.currencyValue}>{currency}</Text>
          </TouchableOpacity>
        </View>

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

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: currentColorHex, opacity: canSubmit ? 1 : 0.45 }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>Запазване</Text>
        </TouchableOpacity>
      </View>

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


  header: {flexDirection: 'row',alignItems: 'center',backgroundColor: HEADER,paddingHorizontal: 16,paddingVertical: 14,justifyContent: 'space-between',},
  backBtn: { width: 40, alignItems: 'flex-start' },
  backArrow: { color: WHITE, fontSize: 22 },
  headerTitle: { color: WHITE, fontSize: 18, fontWeight: '700' },

  scroll: { flex: 1 },
  content: { padding: 24, paddingBottom: 120, gap: 28 },

  amountRow: {flexDirection: 'row',alignItems: 'flex-end',justifyContent: 'center',gap: 12,marginTop: 8,},
  amountInput: {color: WHITE,fontSize: 44,fontWeight: '300',letterSpacing: -1,textAlign: 'center',minWidth: 80,padding: 0,},
  currencyLabel: {color: ACCENT,fontSize: 28,fontWeight: '600',paddingBottom: 4,},
  amountUnderline: {height: 1,backgroundColor: 'rgba(255,255,255,0.2)',marginHorizontal: 40,marginTop: -16,},

  section: { gap: 14 },
  sectionLabel: { color: MUTED, fontSize: 15 },

  nameInput: {color: WHITE,fontSize: 16,paddingBottom: 8,padding: 0,},
  nameUnderline: { height: 1.5, backgroundColor: ACCENT },

  iconsGrid: {flexDirection: 'row',flexWrap: 'wrap',gap: 12,},
  iconBtn: {width: 64,height: 64,borderRadius: 32,alignItems: 'center',justifyContent: 'center',},
  iconEmoji: { fontSize: 26 },

  colorsRow: {flexDirection: 'row',flexWrap: 'wrap',gap: 12,},
  colorBtn: {width: 44,height: 44,borderRadius: 22,alignItems: 'center',justifyContent: 'center',},
  colorBtnSelected: {borderWidth: 3,borderColor: 'rgba(255,255,255,0.6)',},
  colorCheck: { color: WHITE, fontSize: 18, fontWeight: '700' },

  currencyValue: {color: ACCENT,fontSize: 22,fontWeight: '600',},

  toggleRow: {flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingVertical: 4,},
  toggleLabel: { color: WHITE, fontSize: 16, flex: 1 },

  footer: {position: 'absolute',bottom: 0, left: 0, right: 0,padding: 20,paddingBottom: 32,backgroundColor: BG,},
  submitBtn: {borderRadius: 999,paddingVertical: 17,alignItems: 'center',},
  submitText: { color: WHITE, fontSize: 17, fontWeight: '700' },


  modalBackdrop: {flex: 1,backgroundColor: 'rgba(0,0,0,0.5)',justifyContent: 'flex-end',},
  modalSheet: {backgroundColor: '#1a2e22',borderTopLeftRadius: 24,borderTopRightRadius: 24,paddingHorizontal: 24,paddingTop: 16,paddingBottom: 40,maxHeight: '60%',},
  modalHandle: {width: 36, height: 4,backgroundColor: 'rgba(255,255,255,0.2)',borderRadius: 999,alignSelf: 'center',marginBottom: 20,},
  modalTitle: { color: WHITE, fontSize: 18, fontWeight: '700', marginBottom: 16 },
  currencyRow: {flexDirection: 'row',alignItems: 'center',justifyContent: 'space-between',paddingVertical: 14,},
  currencyRowText: { color: WHITE, fontSize: 16 },
  currencyCheck: { fontSize: 18, fontWeight: '700' },
  modalDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
});