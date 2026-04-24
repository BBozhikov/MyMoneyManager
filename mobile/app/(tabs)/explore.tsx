// !!!! IMPORTRANT - explore = accounts
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { requireAuth } from '@/utils/auth';
import { use, useCallback, useState } from 'react';

const baseUrl = 'http://192.168.0.6:8080';
const iconSize = 24;
const ICONS = [
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

interface Account {
  id: string;
  name: string;
  icon: string;
  color: string;
  currentBalance: number;
  main: boolean;
}

function formatAmount(amount: number) {
  return amount.toLocaleString('bg-BG', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' €';
}

export default function AccountsScreen() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);


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
  useFocusEffect(
    useCallback(() => {
      fetchAccounts();
    }, [])
  );
  const total = accounts.reduce((sum, a) => sum + a.currentBalance, 0);
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Общо:</Text>
          <Text style={styles.totalAmount}>{formatAmount(total)}</Text>
        </View>

        <View style={styles.accountsList}>
          {accounts.map((account, index) => (
            <View key={account.id}>
              <TouchableOpacity
                style={styles.accountRow}
                activeOpacity={0.7}
                onPress={() => router.replace({ pathname: `/(tabs)/edit-account`, 
                params: { id: account.id, currentBalance: account.currentBalance, name: account.name, color: account.color, 
                icon: account.icon, main: account.main.toString(),} })}>

                <View style={[styles.accountIcon, { backgroundColor: COLOR_MAP[account.color.toLowerCase()] }]}>
                  <Text style={styles.accountIconText}>{ICON_MAP[account.icon.toLowerCase()]}</Text>
                </View>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountBalance}>{formatAmount(account.currentBalance)}</Text>
              </TouchableOpacity>
              {index < accounts.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/add-account')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const BG        = '#3b6861';
const CARD      = '#0000002e';
const WHITE     = '#ffffff';
const MUTED     = 'rgba(255,255,255,0.55)';
const DIVIDER   = 'rgba(255,255,255,0.08)';
const ACCENT    = '#3ecf8e'; 
const FAB_COLOR = '#f5a623';  

const styles = StyleSheet.create({
  safe: {flex: 1,backgroundColor: BG,},
  scroll: {flex: 1,backgroundColor: BG,},
  content: {padding: 24,paddingBottom: 100,gap: 20,},

  totalSection: {alignItems: 'center',paddingVertical: 16,gap: 4,},
  totalLabel: {color: MUTED,fontSize: 16,},
  totalAmount: {color: WHITE,fontSize: 40,fontWeight: '700',letterSpacing: -1,},

  accountsList: {backgroundColor: CARD,borderRadius: 20,overflow: 'hidden',},
  accountRow: {flexDirection: 'row',alignItems: 'center',gap: 14,paddingVertical: 16,paddingHorizontal: 18,},
  accountIcon: {width: 44,height: 44,borderRadius: 999,backgroundColor: 'rgba(255,255,255,0.1)',alignItems: 'center',justifyContent: 'center',},
  accountIconText: {fontSize: 22,},
  accountName: {flex: 1,color: WHITE,fontSize: 16,fontWeight: '500',},
  accountBalance: {color: WHITE,fontSize: 16,fontWeight: '600',letterSpacing: -0.2,},
  divider: {height: 1,backgroundColor: DIVIDER,marginHorizontal: 16,},

  fab: {position: 'absolute',bottom: 32,alignSelf: 'center',width: 60,height: 60,borderRadius: 30,backgroundColor: FAB_COLOR,
    alignItems: 'center',justifyContent: 'center',shadowColor: FAB_COLOR,shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.4,shadowRadius: 10,elevation: 8
  ,borderColor:'black',borderWidth:1},
  fabIcon: {color: WHITE,fontSize: 28,fontWeight: '300',lineHeight: 32,},
});