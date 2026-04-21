import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import axios from 'axios';

async function signOut() {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('fullName');
  await AsyncStorage.removeItem('email');
}

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const handleGetUserData = async () => {
    try {
      setLoading(true);

      const storedFullName = await AsyncStorage.getItem('fullName');
      const storedEmail = await AsyncStorage.getItem('email');
      setFullName(storedFullName || '');
      setEmail(storedEmail || '');
    } catch (error: any) {
      console.log('Loading user info error:', error?.response?.data || error.message);
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          'Неуспешно зареждане на данни за потребителя';
  
        Alert.alert('Грешка', message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    router.push('/(auth)/change-password');
  };

  const handleSignOut = () => {
  Alert.alert('Изход', 'Сигурни ли сте, че искате да излезете?', [
    { text: 'Отказ', style: 'cancel' },
    {
      text: 'Изход',
      style: 'destructive',
      onPress: async () => {
        try {
          const token = await AsyncStorage.getItem('accessToken');
          const refreshToken = await AsyncStorage.getItem('refreshToken');

          await axios.post(
            'http://192.168.0.6:8080/api/auth/logout',
            { refreshToken },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error: any) {
          console.log('Logout error:', error?.response?.data || error.message);
        } finally {
          await signOut();
          router.replace('/(auth)/login');
        }
      },
    },
  ]);
};

  const handleDeleteAccount = () => {
    Alert.alert(
      'Изтриване на акаунт',
      'Сигурни ли сте? Това действие е необратимо и всичките ви данни ще бъдат изтрити завинаги.',
      [
        { text: 'Отказ', style: 'cancel' },
        {
          text: 'Изтрий',
          style: 'destructive',
          onPress: () => {
            


            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };
``
  useEffect(() => {
    handleGetUserData();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{fullName?.split(' ').map(n => n[0]).join('')}</Text>
          </View>
        </View>

        <View style={styles.card}>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Име</Text>
            <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail" >{fullName}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Имейл</Text>
            <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail" >{email}</Text>
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.actionRow}
            activeOpacity={0.75}
            onPress={handleChangePassword}
          >
            <Text style={styles.actionText}><AntDesign name="key" size={24} color="white" /></Text>
            <Text style={styles.actionLabel}>Смяна на парола</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.signOutButton}
            activeOpacity={0.75}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Изход</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.75}
            onPress={handleDeleteAccount}
          >
            <Text style={styles.deleteText}>Изтрий акаунт</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const BG = '#3b6861';
const CARD = 'rgba(0,0,0,0.18)';
const WHITE = '#ffffff';
const WHITE_MUTED = 'rgba(255,255,255,0.6)';
const WHITE_FAINT = 'rgba(255,255,255,0.12)';

const styles = StyleSheet.create({
  safe: {flex: 1,backgroundColor: BG,},
  scroll: {flex: 1,backgroundColor: BG,marginTop: 20,},
  content: {padding: 24,alignItems: 'center',gap: 16,},

  avatarCard: {alignItems: 'center',gap: 6,paddingVertical: 8,},
  avatar: {width: 72,height: 72,borderRadius: 36,backgroundColor: 'rgba(0,0,0,0.25)',alignItems: 'center',justifyContent: 'center',marginBottom: 6,},
  avatarText: {color: WHITE,fontSize: 26,fontWeight: '700',letterSpacing: -0.5,},
  userName: {color: WHITE,fontSize: 20,fontWeight: '700',letterSpacing: -0.3,},
  userEmail: {color: WHITE_MUTED,fontSize: 14,},

  card: {backgroundColor: CARD,borderRadius: 20,width: '100%',overflow: 'hidden'},
  infoRow: {flexDirection: 'row',justifyContent: 'space-between',alignItems: 'center',paddingVertical: 16,paddingHorizontal: 20,},
  infoLabel: {color: WHITE_MUTED,fontSize: 15,},
  infoValue: {color: WHITE,fontSize: 15,fontWeight: '500', maxWidth: '80%', textAlign: 'right'},
  divider: {height: 1,backgroundColor: WHITE_FAINT,marginHorizontal: 16,},
  actionRow: {flexDirection: 'row',alignItems: 'center',gap: 12,paddingVertical: 18,paddingHorizontal: 20,},
  actionText: {fontSize: 18,width: 28,textAlign: 'center',},
  actionLabel: {flex: 1,color: WHITE,fontSize: 16,fontWeight: '600',},
  chevron: {color: WHITE_MUTED,fontSize: 22,fontWeight: '300',lineHeight: 24,},

  bottomRow: {flexDirection: 'row',width: '100%',gap: 12,},
  signOutButton: {flex: 1,backgroundColor: CARD,borderRadius: 16,paddingVertical: 16,alignItems: 'center',},
  signOutText: {color: WHITE_MUTED,fontSize: 15,fontWeight: '600',},
  deleteButton: {flex: 1,backgroundColor: 'rgba(255,59,48,0.18)',borderRadius: 16,paddingVertical: 16,alignItems: 'center',},
  deleteText: {color: '#FF3B30',fontSize: 15,fontWeight: '600',},
});