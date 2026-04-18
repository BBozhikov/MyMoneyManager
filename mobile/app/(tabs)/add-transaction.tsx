import AntDesign from '@expo/vector-icons/AntDesign';
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

export default function AddTransactionScreen() {
  const [type,         setType]         = useState<TxType>('expense');
  const [amount,       setAmount]       = useState('');
  const [category,     setCategory]     = useState('');
  const [account,      setAccount]      = useState('');
  const [date,         setDate]         = useState(new Date());
  const [note,         setNote]         = useState('');
  const [catModal,     setCatModal]     = useState(false);
  const [accModal,     setAccModal]     = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const accentColor = type === 'expense' ? RED : GREEN;

  const formatDate = (d: Date) =>
    d.toLocaleDateString('bg-BG', { day: 'numeric', month: 'long', year: 'numeric' });

  const handleSubmit = () => {
    console.log({ type, amount, category, account, date: date.toISOString(), note });
  };

  return (
    <><SafeAreaView style={{ flex: 1, backgroundColor: '#3b6861' }}>
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
            onPress={() => setType('expense')}
            activeOpacity={0.75}
          >
            <Text style={[styles.typeBtnText, type === 'expense' && { color: RED }]}>
              Разход
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, type === 'income' && { backgroundColor: 'rgba(52,199,89,0.25)', borderRadius: 10 }]}
            onPress={() => setType('income')}
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

        <TouchableOpacity style={styles.card} onPress={() => setCatModal(true)} activeOpacity={0.75}>
          <Text style={styles.label}>Категория</Text>
          <View style={styles.fieldRow}>
            <Text style={[styles.fieldValue, !category && styles.fieldPlaceholder]}>
              {category || 'Избери категория'}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </View>
        </TouchableOpacity>

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

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: accentColor }]}
          activeOpacity={0.75}
          onPress={handleSubmit}
        >
          <Text style={styles.submitBtnText}>
            {type === 'expense' ? 'Добави разход' : 'Добави приход'}
          </Text>
        </TouchableOpacity>

      </ScrollView>

      <Modal visible={catModal} transparent animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setCatModal(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Избери категория</Text>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[styles.sheetOption, category === cat && styles.sheetOptionActive]}
                onPress={() => { setCategory(cat); setCatModal(false); }}
                activeOpacity={0.75}
              >
                <Text style={[styles.sheetOptionText, category === cat && styles.sheetOptionTextActive]}>
                  {cat}
                </Text>
                {category === cat && <Text style={{ color: GREEN }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

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
});
