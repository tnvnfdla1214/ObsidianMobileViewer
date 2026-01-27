import useStore from '@/src/context/store';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Pressable, Text } from 'react-native';

export default function MainLayout() {
  const router = useRouter();
  const { logout } = useStore();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('github_token');
    logout();
    router.replace('/(auth)/login');
  };

 return (
    <Stack
      screenOptions={{
        headerBackTitle: '',
        headerRight: () => (
          <Pressable 
            onPress={handleLogout} 
            style={{ marginRight: 15, padding: 4 }}
          >
            <Text style={{ color: '#0066cc', fontSize: 14 }}>로그아웃</Text>
          </Pressable>
        ),
      }}
    >
      {/* index 삭제 → files가 기본 화면 */}
      <Stack.Screen
        name="index"
        options={{
          title: 'Obsidian Vault',
          headerBackVisible: false,  // 뒤로가기 숨김
        }}
      />
      <Stack.Screen
        name="editor"
        options={{
          title: '파일 보기',
        }}
      />
    </Stack>
  );
}