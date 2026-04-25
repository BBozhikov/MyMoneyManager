import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import { useState, useRef, useCallback } from 'react';
import { Alert, Button, StyleSheet, Text, TouchableOpacity, View, Image, Switch, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import * as Sharing from 'expo-sharing';
import { API_ENDPOINTS } from '@/constants/api';
import { requireAuth } from '@/utils/auth';
import axios from 'axios';

interface Category {
  id: number;
  name: string;
  type: 'EXPENSE' | 'INCOME';
  icon: string;
  color: string;
  active: boolean;
  default: boolean;
}
const baseUrl = 'http://192.168.0.6:8080';
export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorizing, setCategorizing] = useState(false);
  const [photoFacing, setPhotoFacing] = useState<CameraType>('back');
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);
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
  useFocusEffect(
    useCallback(() => {
    fetchCategories();
  }, []));

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function takePicture() {
    if (!cameraRef.current) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 1, shutterSound: false, imageType: 'jpg' });
    setPhotoFacing(facing);
    setCapturedPhoto(photo.uri);
  }

  async function sharePhoto() {
    if (!capturedPhoto) return;
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Споделянето не е достъпно на това устройство');
      return;
    }
    await Sharing.shareAsync(capturedPhoto, {
      mimeType: 'image/jpeg',
      dialogTitle: 'Сподели снимката',
    });
  }

  async function sendToBackend() {
  if (!capturedPhoto) return;
  setLoading(true);

  const formData = new FormData();
  formData.append('file', {
    uri: capturedPhoto,
    name: 'receipt.jpg',
    type: 'image/jpeg',
  } as any);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch(
      `http://192.168.0.6:8000/api/v2/parse-receipt?categorize=${categorizing}`,
      {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      const err = await response.text();
      Alert.alert('Грешка от сървъра', err);
      return;
    }

    const result = await response.json();

    function getMostFrequentCategory(items: { category: string }[]): string {
      const freq = items.reduce((acc, item) => {
        const cat = item.category.toLowerCase();
        acc[cat] = (acc[cat] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
    }
    const topCategory = getMostFrequentCategory(result.items);
    const matchedCategory = categories.find(
      c => c.name.toLowerCase() === topCategory
    );
    console.log(result);
    router.push({
      pathname: '/(tabs)/add-transactionAI',
      params: {
        //items: JSON.stringify(result.items),
        categoryId: String(matchedCategory?.id ?? ''),
        //categoryName: String(result.items[0].category),
        amount: String(parseFloat(result.total_euro ?? '0').toFixed(2)),
        note: String(result.store_name ?? ''),
        createdAt: String(result.date ?? ''),
      },
    });

  } catch (error: any) {
    if (error.name === 'AbortError') {
      Alert.alert('Timeout', 'Сървърът не отговори навреме');
    } else {
      Alert.alert('Грешка при изпращане', error.message ?? 'Провери връзката с сървъра');
    }
  } finally {
    setLoading(false);
    setCapturedPhoto(null);
  }
}

  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: capturedPhoto }}
          style={[styles.preview, photoFacing === 'front' && { transform: [{ scaleX: -1 }] }]}
        />
        <View style={styles.previewButtons}>
          <View style={styles.previewFabs}>
            <TouchableOpacity style={styles.fab} onPress={sendToBackend} disabled={loading}>
              <MaterialCommunityIcons name={loading ? 'loading' : 'upload'} size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.fab, { backgroundColor: '#555' }]} onPress={() => setCapturedPhoto(null)} disabled={loading}>
              <MaterialCommunityIcons name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.fab} onPress={sharePhoto} disabled={loading}>
              <MaterialCommunityIcons name="share-variant" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.categorizeRow}>
            <Text style={styles.categorizeBtnText}>AI категоризиране</Text>
            <Switch
              value={categorizing}
              onValueChange={setCategorizing}
              trackColor={{ false: '#555', true: ACCENT }}
              thumbColor={WHITE}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef} mute={true} enableTorch={false} flash='off' />
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => router.replace('/(tabs)/add-transaction')}>
          <Text style={styles.fabIcon}><Entypo name="arrow-left" size={24} color="white" /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={takePicture}>
          <Text style={styles.fabIcon}><MaterialCommunityIcons name="camera" size={24} color="white" /></Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={toggleCameraFacing}>
          <Text style={styles.fabIcon}><MaterialCommunityIcons name="camera-flip" size={24} color="white" /></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const BG        = '#3b6861';
const CARD      = '#0000002e';
const WHITE     = '#ffffff';
const MUTED     = 'rgba(255,255,255,0.55)';
const DIVIDER   = 'rgba(255,255,255,0.08)';
const ACCENT    = '#3ecf8e';
const FAB_COLOR = '#3b6861';

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  message: { textAlign: 'center', paddingBottom: 10 },
  camera: { flex: 1 },
  buttonContainer: { position: 'absolute', flexDirection: 'row', gap: 48, bottom: 32, alignSelf: 'center' },
  button: { flex: 1, alignItems: 'center' },
  text: { fontSize: 24, fontWeight: 'bold', color: 'white' },

  fab: {
    bottom: 32, alignSelf: 'center', width: 60, height: 60, borderRadius: 30,
    backgroundColor: FAB_COLOR, alignItems: 'center', justifyContent: 'center',
    shadowColor: FAB_COLOR, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4,
    shadowRadius: 10, elevation: 8, borderColor: 'black', borderWidth: 1
  },
  fabIcon: { color: WHITE, fontSize: 28, fontWeight: '300', lineHeight: 32 },

  corner: { position: 'absolute', width: 30, height: 30, borderColor: 'white', borderWidth: 3 },
  topLeft: { top: 48, left: 48, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 4 },
  topRight: { top: 48, right: 48, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 4 },
  bottomLeft: { bottom: 140, left: 48, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 4 },
  bottomRight: { bottom: 140, right: 48, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 4 },

  preview: { flex: 1, width: '100%' },
  previewButtons: { position: 'absolute', bottom: 48, alignSelf: 'center', flexDirection: 'column', alignItems: 'center', gap: 0 },
  previewFabs: { flexDirection: 'row', gap: 16 },

  categorizeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 24, borderWidth: 2, borderColor: ACCENT, backgroundColor: 'transparent' },
  categorizeBtnActive: { backgroundColor: ACCENT },
  categorizeBtnText: { color: WHITE, fontSize: 15, fontWeight: '600' },
  categorizeRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: BG, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 24, borderColor: 'black', borderWidth: 1 },
});
