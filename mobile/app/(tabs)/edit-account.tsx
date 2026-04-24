import { requireAuth } from '@/utils/auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import axios from 'axios';
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
const baseUrl = 'http://192.168.0.6:8080';
export default function EditAccountScreen() {
  const router = useRouter();
  const {id, currentBalance, name, color, icon, main} = useLocalSearchParams<{
        id: string;
        name: string;
        icon: string;
        color: string;
        currentBalance: string;
        main: string;
    }>();

  const [amountState, setAmount] = useState(currentBalance ?? 0);
  const [nameState, setName] = useState(name ??'');
  const [selectedIcon, setSelectedIcon] = useState(icon ?? ICONS[0].id);
  const [selectedColor, setSelectedColor] = useState(color ?? COLORS[0]);
  const [loading, setLoading] = useState(false);
  const currentColorHex = COLORS.find(c => c.id === selectedColor)?.color ?? COLORS[0].color;
  const canSubmit = nameState.trim().length > 0;

  const isMain = main === 'true';
  useEffect(() => {
    setAmount(currentBalance ?? '0'); 
    setName(name ?? '');
    setSelectedIcon(icon?.toLowerCase() ?? ICONS[0].id); 
    setSelectedColor(color?.toLowerCase() ?? COLORS[0].id); 
  }, [name, color, icon, currentBalance]);

  const DeleteAcc = async () => {
    try {
      setLoading(true);
      const token = await requireAuth();
      if (!token) return;

      await axios.delete(
        `${baseUrl}/api/accounts/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Успех', `Сметката "${nameState}" беше изтрита!`, [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/(tabs)/explore');
          }},
      ]);
    } catch (error: any) {
      console.log('Accounts error:', JSON.stringify(error?.response?.data));
      Alert.alert('Грешка', 'Неуспешно редактиране на сметка.');
    } finally {
      setLoading(false);
    }
  }
  const handleDelete = () => {
      Alert.alert(
        'Изтриване',
        `Сигурни ли сте, че искате да изтриете "${nameState}"?`,
        [
          { text: 'Отказ', style: 'cancel' },
          {
            text: 'Изтрий',
            style: 'destructive',
            onPress: () => DeleteAcc(),
          },
        ]
      );
    };
  const handleSubmit = async () => {
  if (!canSubmit) return;

  const normalizedAmount = amountState.toString().replace(',', '.');
  const parsedAmount = parseFloat(normalizedAmount);

    if (isNaN(parsedAmount)) {
      Alert.alert('Грешка', 'Въведи валидна сума.');
      return;
    }

    try {
      const token = await requireAuth();
      if (!token) return;

      await axios.put(
        `${baseUrl}/api/accounts/${id}`,
        {
          name: nameState,
          icon: selectedIcon.toUpperCase(),
          color: selectedColor.toUpperCase(),
          currentBalance: parsedAmount,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert('Успех', `Сметката "${nameState}" беше променена!`, [
        { text: 'OK', onPress: () => router.replace('/(tabs)/explore') },
      ]);
    } catch (error: any) {
      console.log('Edit account error:', JSON.stringify(error?.response?.data));
      Alert.alert('Грешка', 'Неуспешно редактиране на сметка.');
    }
  };

  const currentIcon = ICONS.find(i => i.id === selectedIcon)?.emoji ?? '';

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/explore")} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}><AntDesign name="arrow-left" size={24} color="white" /></Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Редактиране на сметка</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.amountRow}>
          <TouchableOpacity
            onPress={() => {
              if (amountState === '' || amountState === '0') return;
              setAmount(prev =>
                prev.startsWith('-') ? prev.slice(1) : '-' + prev
              );
            }}
            style={styles.signBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.signBtnText}>+/−</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.amountInput}
            value={amountState}
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
            value={nameState}
            onChangeText={setName}
            //placeholder=""
            placeholderTextColor={MUTED}
            selectionColor={ACCENT}
            editable={!isMain}
          />
          {isMain && (
          <Text style={{ color: MUTED, fontSize: 12, marginTop: 4 }}>
            Името на основната сметка не може да се промени
          </Text>
          )}
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

       {!isMain && (
        <TouchableOpacity onPress={handleDelete} activeOpacity={0.7} style={styles.deleteBtn}>
          <Text style={styles.deleteBtnText}>ИЗТРИЙ</Text>
        </TouchableOpacity>
       )}

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
const RED = '#ff3b30';

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
  
  deleteBtn: { marginTop: 16, paddingVertical: 8 },
  deleteBtnText: { color: RED, fontSize: 16, fontWeight: '700', letterSpacing: 1 },

  signBtn: {paddingHorizontal: 10,paddingVertical: 6,borderRadius: 8,backgroundColor: 'rgba(255,255,255,0.1)',},
  signBtnText: {color: 'rgba(255,255,255,0.7)',fontSize: 16,fontWeight: '600',},
});