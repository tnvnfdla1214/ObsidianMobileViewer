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
        headerBackTitle: 'Back',
        headerRight: () => (
          <Pressable onPress={handleLogout} style={{ marginRight: 15 }}>
            <Text style={{ color: '#0066cc', fontSize: 14 }}>로그아웃</Text>
          </Pressable>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Repository 목록',
        }}
      />
      <Stack.Screen
        name="files"
        options={{
          title: '파일 목록',
        }}
      />
      <Stack.Screen
        name="editor"
        options={{
          title: '파일 편집',
        }}
      />
    </Stack>
  );
}