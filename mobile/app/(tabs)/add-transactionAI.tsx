import { requireAuth } from '@/utils/auth';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/build/Feather';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
const baseUrl = 'http://192.168.0.6:8080';

const BG      = '#3b6861';
const SURFACE = 'rgba(0,0,0,0.22)';
const BORDER  = 'rgba(255,255,255,0.1)';
const GREEN   = '#34C759';
const RED     = '#FF6B6B';
const WHITE     = '#ffffff';
const MUTED     = 'rgba(255,255,255,0.55)';
const DIVIDER   = 'rgba(255,255,255,0.08)';

type TxType = 'EXPENSE' | 'INCOME';

interface Category {
  id: number;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  icon: string;
  color: string;
  active: boolean;
  default: boolean;
}
interface Account {
  id: string;
  name: string;
  icon: string;
  color: string;
  currentBalance: number;
  main: boolean;
}

const iconSize = 32;
const ICONS = [
    { id: 'receipt',    emoji: <FontAwesome5 name="receipt" size={iconSize} color="white" /> },
    { id: 'plane',      emoji: <FontAwesome name="plane" size={iconSize} color="white" /> },
    { id: 'tag',        emoji: <AntDesign name="tag" size={iconSize} color="white" /> },
    { id: 'pet',        emoji: <MaterialIcons name="pets" size={iconSize} color="white" /> },
    { id: 'monitor',    emoji: <Feather name="monitor" size={iconSize} color="white" /> },
    { id: 'pot',        emoji: <MaterialCommunityIcons name="pot-mix" size={iconSize} color="white" />  },
    { id: 'shopping_cart',     emoji: <AntDesign name="shopping-cart" size={iconSize} color="white" /> },
    { id: 'brush',      emoji: <FontAwesome5 name="brush" size={iconSize} color="white" /> },
    { id: 'washing_machine',    emoji: <MaterialCommunityIcons name="washing-machine" size={iconSize} color="white" /> },
    { id: 'tent',   emoji: <FontAwesome6 name="tent" size={iconSize} color="white" /> },
    { id: 'controller',     emoji: <Ionicons name="game-controller-sharp" size={iconSize} color="white" /> },
    { id: 'car',       emoji: <AntDesign name="car" size={iconSize} color="white" /> },
    { id: 'first_aid',        emoji: <FontAwesome5 name="first-aid" size={iconSize} color="white" /> },
    { id: 'book',     emoji: <Feather name="book-open" size={iconSize} color="white" /> },
    { id: 'tshirt',        emoji: <FontAwesome5 name="tshirt" size={iconSize} color="white" /> },
    { id: 'shoe',    emoji: <MaterialCommunityIcons name="shoe-sneaker" size={iconSize} color="white" /> },
    { id: 'food', emoji: <MaterialCommunityIcons name="food-variant" size={iconSize} color="white" />},
    { id: 'restaurant', emoji: <Ionicons name="restaurant" size={iconSize} color="white" />},
    { id: 'cafe', emoji: <Ionicons name="cafe" size={iconSize} color="white" />},
    { id: 'house', emoji: <FontAwesome6 name="house-chimney" size={iconSize} color="white" />},
    { id: 'therapy', emoji: <MaterialIcons name="local-pharmacy" size={iconSize} color="white" />},
    { id: 'education', emoji: <FontAwesome name="graduation-cap" size={iconSize} color="white" />},
    { id: 'gift', emoji: <Feather name="gift" size={iconSize} color="white" />},
    { id: 'cleaning', emoji: <FontAwesome5 name="pump-soap" size={iconSize} color="white" />},
    { id: 'family', emoji: <MaterialIcons name="family-restroom" size={iconSize} color="white" />},
    { id: 'sports', emoji: <MaterialIcons name="sports-football" size={iconSize} color="white" />},
    { id: 'transport', emoji: <MaterialIcons name="emoji-transportation" size={iconSize} color="white" />},
    { id: 'salary', emoji: <MaterialCommunityIcons name="account-cash" size={iconSize} color="white" />},
    { id: 'loan', emoji: <MaterialIcons name="account-balance" size={iconSize} color="white" />},
    { id: 'trade', emoji: <FontAwesome name="handshake-o" size={iconSize} color="white" />},
    { id: 'others', emoji: <AntDesign name="question" size={iconSize} color="white" />},
  ];
const ICON_MAP = Object.fromEntries(ICONS.map(i => [i.id, i.emoji]));

const ICONS2 = [
  { id: 'cash',       emoji: <FontAwesome name="money" size={iconSize} color="white" /> },
  { id: 'bank',       emoji: <AntDesign name="bank" size={iconSize} color="white" /> },
  { id: 'pound',      emoji: <AntDesign name="pound-circle" size={iconSize} color="white" /> },
  { id: 'card',       emoji: <FontAwesome name="credit-card" size={iconSize} color="white" /> },
  { id: 'wallet',     emoji: <FontAwesome5 name="wallet" size={iconSize} color="white" /> },
  { id: 'savings',    emoji: <FontAwesome5 name="piggy-bank" size={iconSize} color="white" />  },
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
  { id: 'finance',    emoji: <MaterialCommunityIcons name="finance" size={iconSize} color= "white" /> },
  { id: 'diamond',    emoji: <FontAwesome name="diamond" size={iconSize} color="white" /> },
  { id: 'gold',       emoji: <MaterialCommunityIcons name="gold" size={iconSize} color="white" /> },
  { id: 'coins',      emoji: <FontAwesome5 name="coins" size={iconSize} color="white" /> },
];
const ICON_MAP2 = Object.fromEntries(ICONS2.map(i => [i.id, i.emoji]));
const COLORS = [
  {id: 'amber', color: '#f5a623'}, // amber
  {id: 'cyan', color: '#00d4ff'}, // cyan
  {id: 'pink', color: '#e91e8c'}, // pink
  {id: 'orange', color: '#ff7043'}, // orange
  {id: 'dark_green', color: '#4a7c6f'}, // dark_green
  {id: 'light_green', color: '#34c759'}, // light_green
  {id: 'red', color: '#ff3b30'}, // red
  {id: 'purple', color: '#5856d6'}, // purple
  {id: 'yellow', color: '#ffcc00'}, // yellow
  {id: 'blue', color: '#007aff'}, // blue
];
const COLOR_MAP = Object.fromEntries(COLORS.map(c => [c.id, c.color]));
export default function EditTransactionScreen() {
  const [type,setType] = useState<TxType>('EXPENSE');
  const [amountState,setAmount] = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [date, setDate] = useState(new Date());
  const [noteState, setNote] = useState('');
  const [accModal, setAccModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeType, setActiveType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);

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
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = await requireAuth();
      const response = await axios.get(`${baseUrl}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (error: any) {
      console.log('Categories error:', error?.response?.data || error.message);
      Alert.alert('Грешка', 'Неуспешно зареждане на категории.');
    } finally {
      setLoading(false);
    }
  };
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const token = await requireAuth();
      if (!token) return; 
      
      const response = await axios.get(`${baseUrl}/api/accounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(response.data);
    } catch (error : any) {
      console.log('Accounts error:', error?.response?.data || error.message);
      Alert.alert('Грешка', 'Неуспешно зареждане на сметки.');
    } finally{
      setLoading(false);
    }
  }
  function parseDate(dateStr: string | undefined): Date {
    if (!dateStr) return new Date();
    
    if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateStr.includes('-')) {
        const [day, month, year] = dateStr.split('-');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    } else if (dateStr.includes('.')) {
        const [day, month, year] = dateStr.split('.');
        return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
    }
  useFocusEffect(
    useCallback(() => {
    const init = async () => {
      try {
        setLoading(true);
        const token = await requireAuth();
        if (!token) return;
        const headers = { Authorization: `Bearer ${token}` };

        const [catRes, accRes] = await Promise.all([
          axios.get(`${baseUrl}/api/categories`, { headers }),
          axios.get(`${baseUrl}/api/accounts`, { headers }),
        ]);

        const loadedCategories: Category[] = catRes.data;
        const loadedAccounts: Account[] = accRes.data;

        setCategories(loadedCategories);
        setAccounts(loadedAccounts);

        setAmount(String(Math.abs(parseFloat(amount ?? '0'))));
        setNote(String(note ?? ''));
        setDate(parseDate(createdAt));

        const foundCat = loadedCategories.find(c => c.id === parseInt(categoryId));
        const foundAcc = loadedAccounts.find(a => String(a.id) === String(accountId)) ?? loadedAccounts[0];

        setCategory(foundCat || null);
        setAccount(foundAcc || null);

        if (foundCat) setType(foundCat.type);

      } catch (error: any) {
        Alert.alert('Грешка', 'Неуспешно зареждане на данните.');
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [id, accountId, categoryId, amount, note, createdAt])
  );
  const accentColor = type === 'EXPENSE' ? RED : GREEN;

  const formatDate = (d: Date) =>
    d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });

  const canSubmit = (): boolean => {
    const hasAmount = amountState.trim().length > 0 && parseFloat(amountState) > 0;
    const hasCategory = category !== null;
    const hasAccount = account !== null;
    return hasAmount && hasCategory && hasAccount;
  };
  const handleSubmit = async () => {
    if (!canSubmit) return;

    const normalizedAmount = amount.replace(',', '.');
    const parsedAmount = parseFloat(normalizedAmount);

    if (isNaN(parsedAmount)) {
      Alert.alert('Грешка', 'Въведи валидна сума.');
      return;
    }
      try {
      setLoading(true);
      const token = await requireAuth();
      if (!token) return;

      await axios.post(
        `${baseUrl}/api/transactions`,
        {
          accountId: account?.id,
          categoryId: category?.id,
          amount: parsedAmount,
          createdAt: date.toISOString(),
          note: note.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Успех', `Транзакцията беше създадена!`, [
        {
          text: 'OK',
          onPress: () => {
            router.replace('/(tabs)/main');
          }},
      ]);
    } catch (error: any) {
      console.log('Transaction error:', JSON.stringify(error?.response?.data));
      Alert.alert('Грешка', 'Неуспешно създаване на транзакция.');
    } finally {
      setLoading(false);
    }
  };

  const handleTypeChange = (newType: TxType) => {
    setType(newType);
    setCategory(null); 
  };
  return (
    <><SafeAreaView style={{ flex: 1, backgroundColor: '#3b6861' }} edges={['top']}>
      <Stack.Screen options={{
        title: 'Редактирай транзакция',
        headerStyle: { backgroundColor: BG },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
      }} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'EXPENSE' && { backgroundColor: 'rgba(255,107,107,0.25)', borderRadius: 10 }]}
            onPress={() => handleTypeChange('EXPENSE')}
            activeOpacity={0.75}
          >
            <Text style={[styles.typeBtnText, type === 'EXPENSE' && { color: RED }]}>
              Разход
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'INCOME' && { backgroundColor: 'rgba(52,199,89,0.25)', borderRadius: 10 }]}
            onPress={() => handleTypeChange('INCOME')}
            activeOpacity={0.75}
          >
            <Text style={[styles.typeBtnText, type === 'INCOME' && { color: GREEN }]}>
              Приход
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Сума</Text>
          <View style={styles.amountRow}>
            <Text style={[styles.currency, { color: accentColor }]}>€</Text>
            <TextInput
              style={[styles.amountInput, { color: accentColor }]}
              placeholder="0.00"
              placeholderTextColor="rgba(255,255,255,0.2)"
              value={amountState}
              onChangeText={text => {
                const clean = text.replace('-', '');
                setAmount(clean);
              }}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Категория</Text>
          <View style={styles.categoryGrid}>
            {categories
              .filter(cat => cat.type === (type === 'EXPENSE' ? 'EXPENSE' : 'INCOME'))
              .map((cat) => {
                const isSelected = category?.id === cat.id;
                const color = COLOR_MAP[cat.color.toLowerCase()];
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryItem}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.75}
                  >
                    <View style={[
                      styles.categoryCircle,
                      { backgroundColor: color },
                      isSelected && styles.categoryCircleSelected,
                    ]}>
                      <Text style={styles.categoryEmoji}>{ICON_MAP[cat.icon.toLocaleLowerCase()]}</Text>
                    </View>
                    <Text style={[
                      styles.categoryName,
                      isSelected && { color: 'white', fontWeight: '700' },
                    ]}>
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        <TouchableOpacity style={styles.card} onPress={() => setAccModal(true)} activeOpacity={0.75}>
          <Text style={styles.label}>Сметка</Text>
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldValue, !account && styles.fieldPlaceholder]}>
              {account?.name || 'Избери сметка'}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setShowDatePicker(true)} activeOpacity={0.75}>
          <Text style={styles.label}>Дата</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.fieldValue}><AntDesign name="calendar" size={24} color="white"></AntDesign>  {formatDate(date)}</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selected) => {
              setShowDatePicker(false);
              if (selected) setDate(selected);
            }}
            maximumDate={new Date()}
          />
        )}

        <View style={styles.card}>
          <Text style={styles.label}>Бележка</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Добави бележка (по желание)..."
            placeholderTextColor="rgba(255,255,255,0.3)"
            value={noteState}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            styles.submitBtn,
            { 
              backgroundColor: accentColor,
              opacity: canSubmit() ? 1 : 0.35,
            },
          ]}
          activeOpacity={0.85}
          disabled={!canSubmit()}
        >
          <Text style={styles.submitBtnText}>
            {type === 'EXPENSE' ? 'Добави разход' : 'Добави приход'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={accModal} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setAccModal(false)}>
          <View style={styles.sheet}>
            <ScrollView>
              <Text style={styles.sheetTitle}>Избери сметка</Text>
              {accounts.map((account, index) => (
                <View key={account.id}>
                  <TouchableOpacity
                    style={styles.accountRow}
                    activeOpacity={0.7}
                    onPress={() => { setAccount(account); setAccModal(false); }}>
    
                    <View style={[styles.accountIcon, { backgroundColor: COLOR_MAP[account.color.toLowerCase()] }]}>
                      <Text style={styles.accountIconText}>{ICON_MAP2[account.icon.toLowerCase()]}</Text>
                    </View>
                    <Text style={styles.accountName}>{account.name}</Text>
                  </TouchableOpacity>
                  {index < accounts.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView></>
  );
}

const styles = StyleSheet.create({
  scroll:  { flex: 1, backgroundColor: BG },
  content: { padding: 16, gap: 12, paddingBottom: 48 },

  typeToggle: {flexDirection: 'row', backgroundColor: SURFACE,borderRadius: 14, padding: 4, gap: 4,borderWidth: 1, borderColor: BORDER,},
  typeBtn:     { flex: 1, paddingVertical: 11, alignItems: 'center' },
  typeBtnText: { color: 'rgba(255,255,255,0.4)', fontSize: 15, fontWeight: '700' },

  card: {backgroundColor: SURFACE, borderRadius: 14,paddingHorizontal: 16, paddingVertical: 14,borderWidth: 1, borderColor: BORDER, gap: 8,},
  label: { color: 'rgba(255,255,255,0.5)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.8 },

  amountRow:   { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currency:    { fontSize: 24, fontWeight: '700' },
  amountInput: { flex: 1, fontSize: 36, fontWeight: '700', paddingVertical: 0 },

  fieldRow:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  fieldValue:      { color: 'white', fontSize: 16, fontWeight: '500' },
  fieldPlaceholder:{ color: 'rgba(255,255,255,0.3)' },
  chevron:         { color: 'rgba(255,255,255,0.3)', fontSize: 22, lineHeight: 26 },

  noteInput: {color: 'white', fontSize: 15, paddingVertical: 0,minHeight: 64, textAlignVertical: 'top',},

  submitBtn: {borderRadius: 14, paddingVertical: 16,alignItems: 'center', marginTop: 4,},
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {backgroundColor: '#2a5248', borderTopLeftRadius: 20,borderTopRightRadius: 20, padding: 20, paddingBottom: 40, gap: 4,},
  sheetTitle:           { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },

  footer: {padding: 16,backgroundColor: BG,},

  categoryGrid: {flexDirection: 'row',flexWrap: 'wrap',marginTop: 8},
  categoryItem: {width: '25%',alignItems: 'center',paddingVertical: 8,gap: 4,},
  categoryCircle: {width: 56,height: 56,borderRadius: 28,alignItems: 'center',justifyContent: 'center'},
  categoryCircleSelected: {borderWidth: 3,borderColor: 'white',},
  categoryEmoji: {fontSize: 24,},
  categoryName: {color: 'rgba(255,255,255,0.6)',fontSize: 11,textAlign: 'center',lineHeight: 14,},

  accountRow: {flexDirection: 'row',alignItems: 'center',gap: 14,paddingVertical: 16,paddingHorizontal: 18,},
  accountIcon: {width: 44,height: 44,borderRadius: 999,backgroundColor: 'rgba(255,255,255,0.1)',alignItems: 'center',justifyContent: 'center',},
  accountIconText: {fontSize: 22,},
  accountName: {flex: 1,color: WHITE,fontSize: 16,fontWeight: '500',},

  divider: {height: 1,backgroundColor: DIVIDER,marginHorizontal: 16,},
});
