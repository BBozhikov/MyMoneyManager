import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ICONS = [
  { id: 'receipt',          emoji: <FontAwesome5 name="receipt" size={24} color="white" /> },
  { id: 'plane',            emoji: <FontAwesome name="plane" size={24} color="white" /> },
  { id: 'tag',              emoji: <AntDesign name="tag" size={24} color="white" /> },
  { id: 'pet',              emoji: <MaterialIcons name="pets" size={24} color="white" /> },
  { id: 'monitor',          emoji: <Feather name="monitor" size={24} color="white" /> },
  { id: 'pot',              emoji: <MaterialCommunityIcons name="pot-mix" size={24} color="white" /> },
  { id: 'shopping_cart',    emoji: <AntDesign name="shopping-cart" size={24} color="white" /> },
  { id: 'brush',            emoji: <FontAwesome5 name="brush" size={24} color="white" /> },
  { id: 'washing_machine',  emoji: <MaterialCommunityIcons name="washing-machine" size={24} color="white" /> },
  { id: 'tent',             emoji: <FontAwesome6 name="tent" size={24} color="white" /> },
  { id: 'controller',       emoji: <Ionicons name="game-controller-sharp" size={24} color="white" /> },
  { id: 'car',              emoji: <AntDesign name="car" size={24} color="white" /> },
  { id: 'first_aid',        emoji: <FontAwesome5 name="first-aid" size={24} color="white" /> },
  { id: 'book',             emoji: <Feather name="book-open" size={24} color="white" /> },
  { id: 'tshirt',           emoji: <FontAwesome5 name="tshirt" size={24} color="white" /> },
  { id: 'shoe',             emoji: <MaterialCommunityIcons name="shoe-sneaker" size={24} color="white" /> },
  { id: 'food',             emoji: <MaterialCommunityIcons name="food-variant" size={24} color="white" /> },
  { id: 'restaurant',       emoji: <Ionicons name="restaurant" size={24} color="white" /> },
  { id: 'cafe',             emoji: <Ionicons name="cafe" size={24} color="white" /> },
  { id: 'house',            emoji: <FontAwesome6 name="house-chimney" size={24} color="white" /> },
  { id: 'therapy',          emoji: <MaterialIcons name="local-pharmacy" size={24} color="white" /> },
  { id: 'education',        emoji: <FontAwesome name="graduation-cap" size={24} color="white" /> },
  { id: 'gift',             emoji: <Feather name="gift" size={24} color="white" /> },
  { id: 'cleaning',         emoji: <FontAwesome5 name="pump-soap" size={24} color="white" /> },
  { id: 'family',           emoji: <MaterialIcons name="family-restroom" size={24} color="white" /> },
  { id: 'sports',           emoji: <MaterialIcons name="sports-football" size={24} color="white" /> },
  { id: 'transport',        emoji: <MaterialIcons name="emoji-transportation" size={24} color="white" /> },
  { id: 'salary',           emoji: <MaterialCommunityIcons name="account-cash" size={24} color="white" /> },
  { id: 'loan',             emoji: <MaterialIcons name="account-balance" size={24} color="white" /> },
  { id: 'trade',            emoji: <FontAwesome name="handshake-o" size={24} color="white" /> },
  { id: 'others',           emoji: <AntDesign name="question" size={24} color="white" /> },
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

const BG      = '#3b6861';
const HEADER  = '#3b6861';
const ICON_BG = 'rgba(255,255,255,0.12)';
const WHITE   = '#ffffff';
const MUTED   = 'rgba(255,255,255,0.45)';
const ACCENT  = '#3ecf8e';

export default function EditCategoryScreen() {
  const router = useRouter();

  const { name, colorId, iconId, type } = useLocalSearchParams<{
    id: string;
    name: string;
    colorId: string;
    iconId: string;
    type: string;
  }>();

  const [nameState, setName]           = useState(name ?? '');
  const [selectedIcon, setSelectedIcon] = useState(iconId ?? ICONS[0].id);
  const [selectedColor, setSelectedColor] = useState(colorId ?? COLORS[0].id);
  const typeState = type ?? '';

  const currentColorHex = COLORS.find(c => c.id === selectedColor)?.color ?? COLORS[0].color;
  const canSubmit = nameState.trim().length > 0;

  useEffect(() => {
    setName(name ?? '');
    setSelectedIcon(iconId ?? ICONS[0].id);
    setSelectedColor(colorId ?? COLORS[0].id);
    }, [name, colorId, iconId]);
  const handleSubmit = () => {
    if (!canSubmit) return;
    Alert.alert('Успех', `Категорията "${nameState}" беше променена!`, [
      { text: 'OK', onPress: () => router.replace('/(tabs)/categories') },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)/categories')} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Редактиране на категория</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        {/* Име */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Име на категорията</Text>
          <TextInput
            style={styles.nameInput}
            value={nameState}
            onChangeText={setName}
            selectionColor={ACCENT}
          />
          <View style={styles.nameUnderline} />
        </View>

        {/* Тип — само показва, не се редактира */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Тип: <Text style={{ color: WHITE }}>{typeState}</Text></Text>
        </View>

        {/* Икони */}
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

        {/* Цветове */}
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: HEADER, paddingHorizontal: 16, paddingVertical: 14, justifyContent: 'space-between' },
  backBtn: { width: 40, alignItems: 'flex-start' },
  backArrow: { color: WHITE, fontSize: 22 },
  headerTitle: { color: WHITE, fontSize: 18, fontWeight: '700' },
  scroll: { flex: 1 },
  content: { padding: 24, paddingBottom: 120, gap: 28 },
  section: { gap: 14 },
  sectionLabel: { color: MUTED, fontSize: 15 },
  nameInput: { color: WHITE, fontSize: 16, paddingBottom: 2, padding: 0 },
  nameUnderline: { height: 1.5, backgroundColor: ACCENT },
  iconsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  iconBtn: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  colorsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  colorBtnSelected: { borderWidth: 3, borderColor: 'rgba(255,255,255,0.6)' },
  colorCheck: { color: WHITE, fontSize: 18, fontWeight: '700' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingBottom: 32, backgroundColor: BG },
  submitBtn: { borderRadius: 999, paddingVertical: 17, alignItems: 'center' },
  submitText: { color: WHITE, fontSize: 17, fontWeight: '700' },
});