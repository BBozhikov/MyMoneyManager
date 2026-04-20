import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/build/Feather';
import FontAwesome from '@expo/vector-icons/build/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/build/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/build/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

//Da gi vzimame ot backend
const CATEGORIES = ['Храна', 'Транспорт', 'Сметки', 'Развлечения', 'Здраве', 'Жилище', 'Заплата', 'Инвестиции', 'Друго'];
const ACCOUNTS   = ['Кеш', 'ДСК', 'Revolut'];

const BG      = '#3b6861';
const SURFACE = 'rgba(0,0,0,0.22)';
const BORDER  = 'rgba(255,255,255,0.1)';
const GREEN   = '#34C759';
const RED     = '#FF6B6B';

type TxType = 'expense' | 'income';

type CategoryType = 'разход' | 'приход';

interface Category {
  id: string;
  name: string;
  iconId: string;
  colorId: string;
  type: CategoryType;
}
const categories: Category[] = [
  // Разходи
  { id: '1', name: 'Здраве', iconId: 'first_aid', colorId: 'red', type: 'разход' },
  { id: '2', name: 'Свободно', iconId: 'sports', colorId: 'light_green', type: 'разход' },
  { id: '3', name: 'Къща', iconId: 'house', colorId: 'blue', type: 'разход' },
  { id: '4', name: 'Кафене', iconId: 'cafe', colorId: 'yellow', type: 'разход' },
  { id: '5', name: 'Образование', iconId: 'education', colorId: 'pink', type: 'разход' },
  { id: '6', name: 'Подаръци', iconId: 'gift', colorId: 'amber', type: 'разход' },
  { id: '7', name: 'Хранителни', iconId: 'shopping_cart', colorId: 'cyan', type: 'разход' },
  { id: '8', name: 'Семейство', iconId: 'family', colorId: 'red', type: 'разход' },
  { id: '9', name: 'Тренировки', iconId: 'sports', colorId: 'light_green', type: 'разход' },
  { id: '10', name: 'Транспорт', iconId: 'transport', colorId: 'blue', type: 'разход' },
  { id: '11', name: 'Други', iconId: 'others', colorId: 'red', type: 'разход' },
  { id: '12', name: 'Пазаруване', iconId: 'shopping_cart', colorId: 'red', type: 'разход' },
  { id: '13', name: 'Споделено', iconId: 'car', colorId: 'amber', type: 'разход' },
  { id: '14', name: 'Пране', iconId: 'washing_machine', colorId: 'pink', type: 'разход' },
  { id: '15', name: 'Стол', iconId: 'restaurant', colorId: 'orange', type: 'разход' },
  { id: '16', name: 'Петлето', iconId: 'food', colorId: 'cyan', type: 'разход' },
  { id: '17', name: 'Steam', iconId: 'gift', colorId: 'amber', type: 'разход' },
  { id: '18', name: 'Бръснар', iconId: 'tag', colorId: 'orange', type: 'разход' },
  { id: '19', name: 'Гироланд', iconId: 'cafe', colorId: 'pink', type: 'разход' },

  // Приходи
  { id: '21', name: 'Заплата', iconId: 'salary', colorId: 'light_green', type: 'приход' },
  { id: '23', name: 'Freelance', iconId: 'trade', colorId: 'blue', type: 'приход' },
  { id: '25', name: 'Наем', iconId: 'house', colorId: 'purple', type: 'приход' },
  { id: '27', name: 'Подарък', iconId: 'gift', colorId: 'pink', type: 'приход' },
  { id: '28', name: 'Лихви', iconId: 'loan', colorId: 'cyan', type: 'приход' },
  { id: '29', name: 'Други', iconId: 'others', colorId: 'amber', type: 'приход' },
];
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
export default function AddTransactionScreen() {
  const [type,         setType]         = useState<TxType>('expense');
  const [amount,       setAmount]       = useState('');
  const [category, setCategory] = useState<Category | null>(null);
  const [account,      setAccount]      = useState('');
  const [date,         setDate]         = useState(new Date());
  const [note,         setNote]         = useState('');
  const [accModal,     setAccModal]     = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const accentColor = type === 'expense' ? RED : GREEN;

  const formatDate = (d: Date) =>
    d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });

  const canSubmit = (): boolean => {
    const hasAmount = amount.trim().length > 0 && parseFloat(amount) > 0;
    const hasCategory = category !== null;
    const hasAccount = account.trim().length > 0;
    return hasAmount && hasCategory && hasAccount;
  };
  const handleSubmit = () => {
    if (!canSubmit()) return;
    console.log({ type, amount, category: category?.name, account, date: date.toISOString(), note });
  };

  const handleTypeChange = (newType: TxType) => {
    setType(newType);
    setCategory(null); 
  };
  return (
    <><SafeAreaView style={{ flex: 1, backgroundColor: '#3b6861' }} edges={['top']}>
      <Stack.Screen options={{
        title: 'Добави транзакция',
        headerStyle: { backgroundColor: BG },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
      }} />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'expense' && { backgroundColor: 'rgba(255,107,107,0.25)', borderRadius: 10 }]}
            onPress={() => handleTypeChange('expense')}
            activeOpacity={0.75}
          >
            <Text style={[styles.typeBtnText, type === 'expense' && { color: RED }]}>
              Разход
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'income' && { backgroundColor: 'rgba(52,199,89,0.25)', borderRadius: 10 }]}
            onPress={() => handleTypeChange('income')}
            activeOpacity={0.75}
          >
            <Text style={[styles.typeBtnText, type === 'income' && { color: GREEN }]}>
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
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Категория</Text>
          <View style={styles.categoryGrid}>
            {categories
              .filter(cat => cat.type === (type === 'expense' ? 'разход' : 'приход'))
              .map((cat) => {
                const isSelected = category?.id === cat.id;
                const color = COLOR_MAP[cat.colorId];
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
                      <Text style={styles.categoryEmoji}>{ICON_MAP[cat.iconId]}</Text>
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
              {account || 'Избери сметка'}
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
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.75} onPress={() => router.replace("/(tabs)/camera")}>
          <Text style={styles.cameraIcon}><AntDesign name="camera" size={24} color="white" /></Text>
          <Text style={styles.cameraBtnText}>Снимай касова бележка</Text>
        </TouchableOpacity>

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
            {type === 'expense' ? 'Добави разход' : 'Добави приход'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal visible={accModal} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setAccModal(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Избери сметка</Text>
            {ACCOUNTS.map(acc => (
              <TouchableOpacity
                key={acc}
                style={[styles.sheetOption, account === acc && styles.sheetOptionActive]}
                onPress={() => { setAccount(acc); setAccModal(false); }}
                activeOpacity={0.75}
              >
                <Text style={[styles.sheetOptionText, account === acc && styles.sheetOptionTextActive]}>
                  {acc}
                </Text>
                {account === acc && <Text style={{ color: GREEN }}>✓</Text>}
              </TouchableOpacity>
            ))}
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

  cameraBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center',gap: 10, backgroundColor: SURFACE, 
    borderRadius: 14,paddingVertical: 14, borderWidth: 1, borderColor: BORDER,borderStyle: 'dashed',},
  cameraIcon:    { fontSize: 20 },
  cameraBtnText: { color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: '600' },

  submitBtn: {borderRadius: 14, paddingVertical: 16,alignItems: 'center', marginTop: 4,},
  submitBtnText: { color: 'white', fontSize: 16, fontWeight: '700' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {backgroundColor: '#2a5248', borderTopLeftRadius: 20,borderTopRightRadius: 20, padding: 20, paddingBottom: 40, gap: 4,},
  sheetTitle:           { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  sheetOption:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10 },
  sheetOptionActive:    { backgroundColor: 'rgba(255,255,255,0.08)' },
  sheetOptionText:      { color: 'rgba(255,255,255,0.7)', fontSize: 16 },
  sheetOptionTextActive:{ color: 'white', fontWeight: '700' },

  footer: {padding: 16,backgroundColor: BG,},

  categoryGrid: {flexDirection: 'row',flexWrap: 'wrap',marginTop: 8},
  categoryItem: {width: '25%',alignItems: 'center',paddingVertical: 8,gap: 4,},
  categoryCircle: {width: 56,height: 56,borderRadius: 28,alignItems: 'center',justifyContent: 'center',shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },shadowOpacity: 0.3,shadowRadius: 16,elevation: 5},
  categoryCircleSelected: {borderWidth: 3,borderColor: 'white',},
  categoryEmoji: {fontSize: 24,},
  categoryName: {color: 'rgba(255,255,255,0.6)',fontSize: 11,textAlign: 'center',lineHeight: 14,},
});
