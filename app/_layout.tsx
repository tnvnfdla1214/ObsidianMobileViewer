import useStore from '@/src/context/store';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';

export default function RootLayout() {
  const { token, setToken } = useStore();
  const router = useRouter();

  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync('github_token');
        if (savedToken) {
          setToken(savedToken);
          setTimeout(() => {
            router.replace('/(main)');
          }, 100);
        } else {
          setTimeout(() => {
            router.replace('/(auth)/login');
          }, 100);
        }
      } catch (error) {
        console.error('Failed to load token:', error);
        //router.replace('/(auth)/login');
      }
    };
    loadToken();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(main)" />
    </Stack>
  );
}