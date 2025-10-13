import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function CompletionScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Completion Page</Text>
      <Button title="Next" onPress={() => router.push('/(main)/(tabs)/dashboard')} />
    </View>
  );
}
