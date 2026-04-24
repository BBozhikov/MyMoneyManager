import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { useState } from 'react';
import { Alert, FlatList, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { requireAuth } from '@/utils/auth';

const baseUrl = 'http://192.168.0.6:8080';
const ICONS = [
    { id: 'receipt',    emoji: <FontAwesome5 name="receipt" size={24} color="white" /> },
    { id: 'plane',      emoji: <FontAwesome name="plane" size={24} color="white" /> },
    { id: 'tag',        emoji: <AntDesign name="tag" size={24} color="white" /> },
    { id: 'pet',        emoji: <MaterialIcons name="pets" size={24} color="white" /> },
    { id: 'monitor',    emoji: <Feather name="monitor" size={24} color="white" /> },
    { id: 'pot',        emoji: <MaterialCommunityIcons name="pot-mix" size={24} color="white" />  },
    { id: 'shopping_cart',     emoji: <AntDesign name="shopping-cart" size={24} color="white" /> },
    { id: 'brush',      emoji: <FontAwesome5 name="brush" size={24} color="white" /> },
    { id: 'washing_machine',    emoji: <MaterialCommunityIcons name="washing-machine" size={24} color="white" /> },
    { id: 'tent',   emoji: <FontAwesome6 name="tent" size={24} color="white" /> },
    { id: 'controller',     emoji: <Ionicons name="game-controller-sharp" size={24} color="white" /> },
    { id: 'car',       emoji: <AntDesign name="car" size={24} color="white" /> },
    { id: 'first_aid',        emoji: <FontAwesome5 name="first-aid" size={24} color="white" /> },
    { id: 'book',     emoji: <Feather name="book-open" size={24} color="white" /> },
    { id: 'tshirt',        emoji: <FontAwesome5 name="tshirt" size={24} color="white" /> },
    { id: 'shoe',    emoji: <MaterialCommunityIcons name="shoe-sneaker" size={24} color="white" /> },
    { id: 'food', emoji: <MaterialCommunityIcons name="food-variant" size={24} color="white" />},
    { id: 'restaurant', emoji: <Ionicons name="restaurant" size={24} color="white" />},
    { id: 'cafe', emoji: <Ionicons name="cafe" size={24} color="white" />},
    { id: 'house', emoji: <FontAwesome6 name="house-chimney" size={24} color="white" />},
    { id: 'therapy', emoji: <MaterialIcons name="local-pharmacy" size={24} color="white" />},
    { id: 'education', emoji: <FontAwesome name="graduation-cap" size={24} color="white" />},
    { id: 'gift', emoji: <Feather name="gift" size={24} color="white" />},
    { id: 'cleaning', emoji: <FontAwesome5 name="pump-soap" size={24} color="white" />},
    { id: 'family', emoji: <MaterialIcons name="family-restroom" size={24} color="white" />},
    { id: 'sports', emoji: <MaterialIcons name="sports-football" size={24} color="white" />},
    { id: 'transport', emoji: <MaterialIcons name="emoji-transportation" size={24} color="white" />},
    { id: 'salary', emoji: <MaterialCommunityIcons name="account-cash" size={24} color="white" />},
    { id: 'loan', emoji: <MaterialIcons name="account-balance" size={24} color="white" />},
    { id: 'trade', emoji: <FontAwesome name="handshake-o" size={24} color="white" />},
    { id: 'others', emoji: <AntDesign name="question" size={24} color="white" />},
  ];


const COLORS = [
  { id: 'amber', color: '#f5a623' },
  { id: 'cyan', color: '#00d4ff' },
  { id: 'pink', color: '#e91e8c' },
  { id: 'orange', color: '#ff7043' },
  { id: 'dark_green', color: '#4a7c6f' },
  { id: 'light_green', color: '#34c759' },
  { id: 'red', color: '#ff3b30' },
  { id: 'purple', color: '#5856d6' },
  { id: 'yellow', color: '#ffcc00' },
  { id: 'blue', color: '#007aff' },
];

export default function NewCategoryScreen() {
  const router = useRouter();

  const [name, setName]               = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0].id);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [type, setType] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const transactionTypes = [
  { label: "Приход", value: "INCOME" },
  { label: "Разход", value: "EXPENSE" },
  ];

  const canSubmit = (): boolean => {
    const hasName = name.trim().length > 0;
    const hasType = type !== null;
    return hasName && hasType;
  };
  const resetForm = () => {
    setName('');
    setType(null);
    setSelectedIcon(ICONS[0].id);
    setSelectedColor(COLORS[0]);
  };
  const handleSubmit = async () => {
  if (!canSubmit()) return;
  try {
    setLoading(true);
    const token = await requireAuth();
    if (!token) return;

    await axios.post(
      `${baseUrl}/api/categories`,
      {
        name,
        type,
        icon: selectedIcon.toUpperCase(),
        color: selectedColor.id.toUpperCase(), 
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Alert.alert('Успех', `Категорията "${name}" беше създадена!`, [
      {
        text: 'OK',
        onPress: () => {
          resetForm();
          router.replace('/(tabs)/categories');
        }},
    ]);
  } catch (error: any) {
    console.log('Categories error:', JSON.stringify(error?.response?.data));
    Alert.alert('Грешка', 'Неуспешно създаване на категория.');
  } finally {
    setLoading(false);
  }
};

  const currentIcon = ICONS.find(i => i.id === selectedIcon)?.emoji ?? <FontAwesome5 name="receipt" size={24} color="white" />;

  return (
    <SafeAreaView style={styles.safe}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/categories")} style={styles.backBtn} activeOpacity={0.7}>
          <Text style={styles.backArrow}><AntDesign name="arrow-left" size={24} color="white" /></Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Добавяне на категория</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Име на категорията</Text>
          <TextInput
            style={styles.nameInput}
            value={name}
            onChangeText={setName}
            selectionColor={ACCENT}
          />
          <View style={styles.nameUnderline} />
        </View>

        <View style={styles.radioContainer}>
          {transactionTypes.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={styles.radioRow}
              onPress={() => setType(option.value)}
            >
              <View style={styles.radioOuter}>
                {type === option.value && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.radioLabel}>{option.label}</Text>
            </TouchableOpacity>
          ))}
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
                    { backgroundColor: isSelected ? selectedColor.color : ICON_BG },
                    isSelected && { borderWidth: 2.5, borderColor: selectedColor.color + 'aa' },
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
                  key={color.color}
                  style={[
                    styles.colorBtn,
                    { backgroundColor: color.color },
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

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: selectedColor.color, opacity: canSubmit() ? 1 : 0.45 }]}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={!canSubmit()}
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

  section: { gap: 14 },
  sectionLabel: { color: MUTED, fontSize: 15 },

  nameInput: {color: WHITE,fontSize: 16,paddingBottom: 2,padding: 0,},
  nameUnderline: { height: 1.5, backgroundColor: ACCENT },

  iconsGrid: {flexDirection: 'row',flexWrap: 'wrap',gap: 12,},
  iconBtn: {width: 64,height: 64,borderRadius: 32,alignItems: 'center',justifyContent: 'center',},
  iconEmoji: { fontSize: 26 },

  colorsRow: {flexDirection: 'row',flexWrap: 'wrap',gap: 12,},
  colorBtn: {width: 44,height: 44,borderRadius: 22,alignItems: 'center',justifyContent: 'center',},
  colorBtnSelected: {borderWidth: 3,borderColor: 'rgba(255,255,255,0.6)',},
  colorCheck: { color: WHITE, fontSize: 18, fontWeight: '700' },

  currencyValue: {color: ACCENT,fontSize: 22,fontWeight: '600',},

  footer: {position: 'absolute',bottom: 0, left: 0, right: 0,padding: 20,paddingBottom: 32,backgroundColor: BG,},
  submitBtn: {borderRadius: 999,paddingVertical: 17,alignItems: 'center',},
  submitText: { color: WHITE, fontSize: 17, fontWeight: '700' },

  radioContainer: { flexDirection: "row", gap: 24, marginBottom: 10 },
  radioRow: { flexDirection: "row", alignItems: "center" },
  radioOuter: {width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: ACCENT,
    alignItems: "center", justifyContent: "center", marginRight: 8,},
  radioInner: {width: 11, height: 11, borderRadius: 6,backgroundColor: ACCENT,},
  radioLabel: { fontSize: 16, color:"white" },
});