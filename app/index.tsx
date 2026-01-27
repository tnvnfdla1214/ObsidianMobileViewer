import useStore from '@/src/context/store';
import { findObsidianRepo, getUserInfo } from '@/src/utils/github';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';

import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function SplashScreen() {
  const router = useRouter();
  const { setToken, setUser, setCurrentRepo } = useStore();
  const [status, setStatus] = useState('앱 시작 중...');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setStatus('저장된 토큰 확인 중...');
      const savedToken = await SecureStore.getItemAsync('github_token');
      if (!savedToken) {
        console.log('❌ 토큰 없음 → 로그인으로 이동');
        router.replace('/(auth)/login');
        return;
      }

      // 2. 사용자 정보 가져오기
      setStatus('사용자 정보 확인 중...');
      const user = await getUserInfo(savedToken);
      if (!user || !user.login) {
        await SecureStore.deleteItemAsync('github_token');
        router.replace('/(auth)/login');
        return;
      }
      
      //3. Obsidian repo 확인
      setStatus('Obsidian 레파지토리 확인 중...');
      const obsidianRepo = await findObsidianRepo(savedToken);
      if (!obsidianRepo) {
        router.replace('/(auth)/login');
        return;
      }

      setToken(savedToken);
      setUser(user);
      setCurrentRepo(obsidianRepo);

      router.replace('/(main)/files');

    } catch (error) {
      // 토큰이 만료되었거나 유효하지 않으면 삭제
      await SecureStore.deleteItemAsync('github_token');
      setStatus('인증 실패, 로그인으로 이동...');
      router.replace('/(auth)/login');
    }
  };

  return (
    <Box className="flex-1 items-center justify-center bg-background-950">
      <VStack space="lg" className="items-center">
        <Spinner size="large" />
        <Text size="sm" className="text-typography-400">
          {status}
        </Text>
      </VStack>
    </Box>
  );
}
