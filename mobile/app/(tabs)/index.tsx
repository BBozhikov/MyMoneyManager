import { useAuthGuard } from '@/hooks/useAuthGuard';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  useAuthGuard();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#3b6861' }}>
      <ActivityIndicator size="large" color="#3ecf8e" />
    </View>
  );
}
