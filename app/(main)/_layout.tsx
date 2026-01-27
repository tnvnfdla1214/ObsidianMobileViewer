import useStore from '@/src/context/store';
import { Ionicons } from '@expo/vector-icons';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Pressable } from 'react-native';

export default function MainLayout() {
  const router = useRouter();
  const pathname = usePathname(); 
  const { user, logout } = useStore(); 

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('github_token');
    logout();
    router.replace('/(auth)/login');
  };

  const isIndex = pathname === '/(main)/index';

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0f172a',
        },
        headerTintColor: '#f1f5f9',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: user ? `${user.login}'s Obsidian` : 'Obsidian',
          headerBackVisible: false,
          headerRight: () => (  // 👈 index에서만 버튼
            <Pressable onPress={handleLogout} className="mr-4 p-2">
              <Ionicons name="log-out-outline" size={22} color="#c084fc" />
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="editor"
        options={{
          title: '파일 보기',
          headerRight: undefined,
        }}
      />
    </Stack>
  );
}