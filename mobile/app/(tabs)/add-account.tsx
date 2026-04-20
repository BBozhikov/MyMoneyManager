import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
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
  '#f5a623', 
  '#00d4ff',
  '#e91e8c', 
  '#ff7043',
  '#4a7c6f',
  '#34c759',
  '#ff3b30',
  '#5856d6',
  '#ffcc00',
  '#007aff',
];

export default function NewAccountScreen() {
  const router = useRouter();

  const [amount, setAmount]           = useState('');
  const [name, setName]               = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [currency, setCurrency]       = useState('EUR');
  const [excludeBalance, setExcludeBalance] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);

  const canSubmit = name.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
   


    Alert.alert('Успех', `Сметката "${name}" беше създадена!`, [
      { text: 'OK', onPress: () => router.replace("/(tabs)/explore") },
    ]);
  };

  const currentIcon = ICONS.find(i => i.id === selectedIcon)?.emoji ?? '💵';

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/explore")} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Добавяне на сметка</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

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
            <Text style={styles.currencyLabel}>EUR</Text>
        </View>
        <View style={styles.amountUnderline} />

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Име на сметката</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
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
          style={[styles.submitBtn, { backgroundColor: selectedColor, opacity: canSubmit ? 1 : 0.45 }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!canSubmit}
        >
          <Text style={styles.submitText}>Добавяне</Text>
        </TouchableOpacity>
      </View>

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