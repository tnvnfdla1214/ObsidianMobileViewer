import useStore from '@/src/context/store';
import { findObsidianRepo, getUserInfo } from '@/src/utils/github';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { Alert, Linking, ScrollView } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function LoginScreen() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, setToken: setStoreToken, setCurrentRepo } = useStore();  // 👈 setRepositories 삭제

  const handleLogin = async () => {
    if (!token.trim()) {
      Alert.alert('오류', 'GitHub 토큰을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      // 1. 사용자 정보
      const user = await getUserInfo(token);
      
      // 2. Obsidian repo 확인 (바로 현재 repo 설정)
      const obsidianRepo = await findObsidianRepo(token);

      // 3. 저장
      await SecureStore.setItemAsync('github_token', token);
      setStoreToken(token);
      setUser(user);
      setCurrentRepo(obsidianRepo);

      Alert.alert('성공', 'Obsidian Vault가 준비되었습니다!');
      router.replace('/(main)');
    } catch (error: any) {
      const errorMessage = error.message || '토큰이 올바르지 않습니다.';
      Alert.alert('로그인 실패', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openGitHubTokenPage = () => {
    Linking.openURL('https://github.com/settings/tokens?type=classic');
  };

  return (
    <ScrollView className="flex-1 bg-background-0">
      <Box className="px-6 pt-16 pb-8">
        <VStack space="lg" className="items-center">
          {/* Header */}
          <VStack space="xs" className="items-center mb-4">
            <Heading size="2xl" className="text-typography-900 font-bold">
              Obsidian Viewer
            </Heading>
            <Text size="sm" className="text-typography-500 text-center">
              GitHub 토큰으로 Vault 연결
            </Text>
          </VStack>

          {/* Guide Card */}
          <Card size="md" variant="elevated" className="w-full bg-background-50 p-4">
            <VStack space="sm">
              <Text size="sm" className="text-typography-900 font-semibold">
                토큰 생성 (repo, user 권한)
              </Text>
              <Text size="xs" className="text-typography-600">
                1. GitHub Settings → Developer settings
              </Text>
              <Text size="xs" className="text-typography-600">
                2. Personal access tokens → Tokens (classic)
              </Text>
              <Text size="xs" className="text-typography-600">
                3. repo, user 체크 후 생성
              </Text>
            </VStack>
          </Card>

          {/* Input */}
          <Box className="w-full">
            <Input variant="outline" size="md" className="bg-background-0">
              <InputField
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChangeText={setToken}
                secureTextEntry
                className="font-mono"
              />
            </Input>
          </Box>

          {/* Login Button */}
          <Button
            size="lg"
            variant="solid"
            action="primary"
            onPress={handleLogin}
            isDisabled={loading || !token.trim()}
            className="w-full"
          >
            {loading ? (
              <>
                <ButtonSpinner />
                <ButtonText>연결 중...</ButtonText>
              </>
            ) : (
              <ButtonText>Obsidian Vault 연결</ButtonText>
            )}
          </Button>

          <Pressable onPress={openGitHubTokenPage} className="py-2">
            <Text size="sm" className="text-primary-500 font-medium">
              토큰 생성 페이지 →
            </Text>
          </Pressable>
        </VStack>
      </Box>
    </ScrollView>
  );
}
