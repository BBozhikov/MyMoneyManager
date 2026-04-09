import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Modal, Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
type TxType = 'all' | 'expense' | 'income';
type SortKey = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc';

const ACCOUNTS   = ['Всички сметки', 'Кеш', 'ДСК', 'Revolut'];
const CATEGORIES = ['Всички', 'Храна', 'Транспорт', 'Сметки', 'Развлечения', 'Здраве', 'Жилище'];
const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'date_desc',   label: 'Дата (ново → старо)' },
  { key: 'date_asc',    label: 'Дата (старо → ново)'  },
  { key: 'amount_desc', label: 'Сума (намаляваща)'    },
  { key: 'amount_asc',  label: 'Сума (нарастваща)'    },
];

const BG      = '#3b6861';
const SURFACE = 'rgba(0,0,0,0.22)';
const BORDER  = 'rgba(255,255,255,0.1)';

const PLACEHOLDER_ROWS = Array.from({ length: 6 }, (_, i) => ({ id: String(i) }));

// Връща bg цвят за активния type бутон — извън StyleSheet
function typeBtnActiveBg(t: TxType): string {
  if (t === 'expense') return 'rgba(255,107,107,0.25)';
  if (t === 'income')  return 'rgba(52,199,89,0.25)';
  return 'rgba(255,255,255,0.12)';
}
export default function TransactionsScreen() {
  const [account,   setAccount]   = useState(ACCOUNTS[0]);
  const [txType,    setTxType]    = useState<TxType>('all');
  const [search,    setSearch]    = useState('');
  const [category,  setCategory]  = useState('Всички');
  const [sort,      setSort]      = useState<SortKey>('date_desc');
  const [sortModal, setSortModal] = useState(false);

  return (
    <>
      <Stack.Screen options={{
        title: 'Транзакции',
        headerStyle: { backgroundColor: BG },
        headerTintColor: 'white',
        headerTitleStyle: { fontWeight: 'bold' },
      }} />
    <SafeAreaView style={{ flex: 1, backgroundColor: '#3b6861' }}>
      <FlatList
        style={styles.list}
        data={PLACEHOLDER_ROWS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}

        renderItem={() => (
          <View style={styles.txRow}>
            <View style={styles.txIconWrap}>
              <View style={styles.txIconPlaceholder} />
            </View>
            <View style={styles.txInfo}>
              <View style={styles.skeletonTitle} />
              <View style={styles.skeletonMeta} />
            </View>
            <View style={styles.skeletonAmount} />
          </View>
        )}

        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}

        ListHeaderComponent={
          <View style={{ gap: 12, marginBottom: 16 }}>

            {/* Сметки */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
              {ACCOUNTS.map(acc => (
                <TouchableOpacity
                  key={acc}
                  style={[styles.pill, account === acc && styles.pillActive]}
                  onPress={() => setAccount(acc)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.pillText, account === acc && styles.pillTextActive]}>
                    {acc}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Всички / Разходи / Приходи */}
            <View style={styles.typeToggle}>
              {(['all', 'expense', 'income'] as TxType[]).map(t => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.typeBtn,
                    txType === t && { backgroundColor: typeBtnActiveBg(t), borderRadius: 9 },
                  ]}
                  onPress={() => setTxType(t)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.typeBtnText, txType === t && styles.typeBtnTextActive]}>
                    {t === 'all' ? 'Всички' : t === 'expense' ? 'Разходи' : 'Приходи'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Search + Sort */}
            <View style={styles.searchRow}>
              <View style={styles.searchWrap}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Търси транзакция..."
                  placeholderTextColor="rgba(255,255,255,0.35)"
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Text style={styles.clearIcon}>✕</Text>
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={styles.sortBtn} onPress={() => setSortModal(true)} activeOpacity={0.75}>
                <Text style={styles.sortIcon}>⇅</Text>
              </TouchableOpacity>
            </View>

            {/* Категории */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catChip, category === cat && styles.catChipActive]}
                  onPress={() => setCategory(cat)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.catChipText, category === cat && styles.catChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.listHeader}>Транзакции</Text>
          </View>
        }

        ListFooterComponent={
          <TouchableOpacity style={styles.loadMore} activeOpacity={0.75}>
            <Text style={styles.loadMoreText}>Зареди още</Text>
          </TouchableOpacity>
        }
      />

      {/* Sort Modal */}
      <Modal visible={sortModal} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setSortModal(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Сортирай по</Text>
            {SORT_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sheetOption, sort === opt.key && styles.sheetOptionActive]}
                onPress={() => { setSort(opt.key); setSortModal(false); }}
                activeOpacity={0.75}
              >
                <Text style={[styles.sheetOptionText, sort === opt.key && styles.sheetOptionTextActive]}>
                  {opt.label}
                </Text>
                {sort === opt.key && <Text style={{ color: '#34C759' }}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  list:        { flex: 1, backgroundColor: BG },
  listContent: { padding: 16, paddingBottom: 40 },
  pillsRow:    { gap: 8, paddingVertical: 2 },

  pill: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, backgroundColor: SURFACE,
    borderWidth: 1, borderColor: BORDER,
  },
  pillActive:     { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.4)' },
  pillText:       { color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: '600' },
  pillTextActive: { color: 'white' },

  typeToggle: {
    flexDirection: 'row', backgroundColor: SURFACE,
    borderRadius: 12, padding: 4, gap: 4,
  },
  typeBtn: {
    flex: 1, paddingVertical: 9, alignItems: 'center',
  },
  typeBtnText:       { color: 'rgba(255,255,255,0.4)', fontSize: 14, fontWeight: '600' },
  typeBtnTextActive: { color: 'white' },

  searchRow: { flexDirection: 'row', gap: 8 },
  searchWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: SURFACE, borderRadius: 12,
    paddingHorizontal: 12, borderWidth: 1, borderColor: BORDER, gap: 8,
  },
  searchIcon:  { fontSize: 14 },
  searchInput: { flex: 1, color: 'white', fontSize: 14, paddingVertical: 11 },
  clearIcon:   { color: 'rgba(255,255,255,0.4)', fontSize: 16, padding: 4 },
  sortBtn: {
    width: 46, height: 46, backgroundColor: SURFACE,
    borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: BORDER,
  },
  sortIcon: { color: 'white', fontSize: 20 },

  catChip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 16, backgroundColor: SURFACE,
    borderWidth: 1, borderColor: BORDER,
  },
  catChipActive:     { backgroundColor: 'rgba(255,255,255,0.15)', borderColor: 'rgba(255,255,255,0.35)' },
  catChipText:       { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  catChipTextActive: { color: 'white', fontWeight: '600' },

  listHeader: { color: 'rgba(255,255,255,0.45)', fontSize: 12, marginLeft: 2, marginTop: 4 },

  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: SURFACE, paddingVertical: 14, paddingHorizontal: 14,
    borderRadius: 14, borderWidth: 1, borderColor: BORDER,
  },
  txIconWrap: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center', justifyContent: 'center',
  },
  txIconPlaceholder: { width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)' },
  txInfo:         { flex: 1, gap: 6 },
  skeletonTitle:  { height: 13, width: '55%', borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)' },
  skeletonMeta:   { height: 10, width: '35%', borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.06)' },
  skeletonAmount: { height: 13, width: 60,    borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)' },

  loadMore: {
    marginTop: 8, alignItems: 'center', paddingVertical: 14,
    backgroundColor: SURFACE, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER,
  },
  loadMoreText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600' },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#2a5248', borderTopLeftRadius: 20,
    borderTopRightRadius: 20, padding: 20, gap: 4, paddingBottom: 36,
  },
  sheetTitle:           { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  sheetOption:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10 },
  sheetOptionActive:    { backgroundColor: 'rgba(255,255,255,0.08)' },
  sheetOptionText:      { color: 'rgba(255,255,255,0.7)', fontSize: 15 },
  sheetOptionTextActive:{ color: 'white', fontWeight: '700' },
});