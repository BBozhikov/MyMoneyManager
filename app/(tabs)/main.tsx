import { ScrollView, StyleSheet, Text } from 'react-native';
import { PieChart } from 'react-native-gifted-charts';


const data = [
  { value: 500, color: '#007AFF', text: 'Храна' },
  { value: 300, color: '#34C759', text: 'Транспорт' },
  { value: 200, color: '#FF9500', text: 'Развлечения' },
  { value: 150, color: '#FF3B30', text: 'Сметки' },
];

export default function TabTwoScreen() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <PieChart
        data={data}
        radius={120}
        centerLabelComponent={() => (
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
          1150 лв
        </Text>
        )}
        donut
        innerRadius={80}
        innerCircleColor={"black"}
        showText
        textColor="white"
        textSize={14}/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color:"white",
  },
  scroll: {
    flex: 1,
    backgroundColor: '#000',
    alignSelf: 'center',
    marginTop: 20,
  },
  content: {
    padding: 24,
    gap: 16,
  },
});