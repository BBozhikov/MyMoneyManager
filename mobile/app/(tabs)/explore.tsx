// !!!! IMPORTRANT - explore = accounts
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ACCOUNTS = [
  { id: '1', name: 'Основен', balance: 202.58, emoji: <FontAwesome name="money" size={24} color="white" /> },
  { id: '2', name: 'Банкова сметка', balance: 1031.00, emoji: <AntDesign name="bank" size={24} color="white" /> },
  { id: '3', name: 'Спестявания', balance: 540.00, emoji: <FontAwesome6 name="piggy-bank" size={24} color="white" /> },
];

function formatAmount(amount: number) {
  return amount.toLocaleString('bg-BG', { minimumFractionDigits: 0, maximumFractionDigits: 2 }) + ' €';
}

export default function AccountsScreen() {
  const router = useRouter();

  const total = ACCOUNTS.reduce((sum, a) => sum + a.balance, 0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Общо:</Text>
          <Text style={styles.totalAmount}>{formatAmount(total)}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.75}
            onPress={() => router.push('/(tabs)/transfer-history')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}><AntDesign name="clock-circle" size={24} color="white" /></Text>
            </View>
            <Text style={styles.actionLabel}>История на{'\n'}преводите</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.75}
            onPress={() => router.push('/(tabs)/add-transfer')}
          >
            <View style={styles.actionIcon}>
              <Text style={styles.actionIconText}><MaterialCommunityIcons name="bank-transfer" size={24} color="white" /></Text>
            </View>
            <Text style={styles.actionLabel}>Нов превод</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.accountsList}>
          {ACCOUNTS.map((account, index) => (
            <View key={account.id}>
              <TouchableOpacity
                style={styles.accountRow}
                activeOpacity={0.7}
                //onPress={() => router.push()}
              >
                <View style={styles.accountIcon}>
                  <Text style={styles.accountIconText}>{account.emoji}</Text>
                </View>
                <Text style={styles.accountName}>{account.name}</Text>
                <Text style={styles.accountBalance}>{formatAmount(account.balance)}</Text>
              </TouchableOpacity>
              {index < ACCOUNTS.length - 1 && <View style={styles.divider} />}
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

  actionsRow: {flexDirection: 'row',justifyContent: 'center',gap: 40,},
  actionButton: {alignItems: 'center',gap: 8,},
  actionIcon: {width: 60,height: 60,borderRadius: 18,backgroundColor: ACCENT,alignItems: 'center',justifyContent: 'center',},
  actionIconText: {fontSize: 26,},
  actionLabel: {color: MUTED,fontSize: 13,textAlign: 'center',lineHeight: 18,},

  accountsList: {backgroundColor: CARD,borderRadius: 20,overflow: 'hidden',},
  accountRow: {flexDirection: 'row',alignItems: 'center',gap: 14,paddingVertical: 16,paddingHorizontal: 18,},
  accountIcon: {width: 44,height: 44,borderRadius: 14,backgroundColor: 'rgba(255,255,255,0.1)',alignItems: 'center',justifyContent: 'center',},
  accountIconText: {fontSize: 22,},
  accountName: {flex: 1,color: WHITE,fontSize: 16,fontWeight: '500',},
  accountBalance: {color: WHITE,fontSize: 16,fontWeight: '600',letterSpacing: -0.2,},
  divider: {height: 1,backgroundColor: DIVIDER,marginHorizontal: 16,},

  fab: {position: 'absolute',bottom: 32,alignSelf: 'center',width: 60,height: 60,borderRadius: 30,backgroundColor: FAB_COLOR,
    alignItems: 'center',justifyContent: 'center',shadowColor: FAB_COLOR,shadowOffset: { width: 0, height: 4 },shadowOpacity: 0.4,shadowRadius: 10,elevation: 8
  ,borderColor:'black',borderWidth:1},
  fabIcon: {color: WHITE,fontSize: 28,fontWeight: '300',lineHeight: 32,},
});