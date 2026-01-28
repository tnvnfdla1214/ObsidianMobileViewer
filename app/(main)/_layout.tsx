import useStore from '@/src/context/store';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Pressable, Text, View } from 'react-native';

export default function MainLayout() {
  const router = useRouter();
  const pathname = usePathname(); 
  const { user, currentFile, logout } = useStore(); 

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
          headerRight: () => (
            <Pressable onPress={handleLogout} style={{ marginRight: 8, padding: 8 }}>
              <Text style={{ color: '#c084fc', fontSize: 14, fontWeight: '500' }}>logout</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen
        name="editor"
        options={{
          headerTitle: () => (
            <View>
              <Text style={{ color: '#f1f5f9', fontWeight: 'bold', fontSize: 16 }}>
                {currentFile?.name || 'Obsidian.md'}
              </Text>
              {currentFile?.path && (
                <Text style={{ color: '#94a3b8', fontSize: 11 }} numberOfLines={1}>
                  {currentFile.path}
                </Text>
              )}
            </View>
          ),
          headerRight: undefined,
        }}
      />
    </Stack>
  );
}