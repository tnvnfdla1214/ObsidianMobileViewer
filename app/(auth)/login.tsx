import useStore from '@/src/context/store';
import { getUserInfo, getUserRepositories } from '@/src/utils/github';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import {
    Alert,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function LoginScreen() {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, setToken: setStoreToken, setRepositories } = useStore();

  const handleLogin = async () => {
    console.log('🔴 [1] handleLogin 호출됨');
    
    if (!token.trim()) {
      Alert.alert('오류', 'GitHub 토큰을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      console.log('🔵 [2] 토큰 검증 시작...', token.substring(0, 10) + '***');

      console.log('🔵 [3] getUserInfo 호출 중...');
      const user = await getUserInfo(token);
      console.log('🟢 [4] 사용자 정보 획득:', user);
      
      console.log('🔵 [5] getUserRepositories 호출 중...');
      const repos = await getUserRepositories(token);
      console.log('🟢 [6] Repository 획득 수:', repos.length);

      console.log('🔵 [7] SecureStore에 토큰 저장 중...');
      await SecureStore.setItemAsync('github_token', token);
      console.log('🟢 [8] 토큰 저장 완료');
      
      setStoreToken(token);
      setUser(user);
      setRepositories(repos);
      console.log('🟢 [9] Store 업데이트 완료');

      Alert.alert('성공', '로그인되었습니다!');
      
      console.log('🔵 [10] 메인 화면으로 이동...');
      router.replace('/(main)');
    } catch (error) {
      console.error('🔴 [ERROR] 로그인 오류:', error);
      const errorMessage = error instanceof Error ? error.message : '토큰이 올바르지 않습니다.';
      Alert.alert('로그인 실패', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openGitHubTokenPage = () => {
    Linking.openURL('https://github.com/settings/tokens?type=classic');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Obsidian Mobile Viewer</Text>
        <Text style={styles.subtitle}>GitHub Personal Access Token으로 시작하세요</Text>

        <View style={styles.guideSection}>
          <Text style={styles.guideTitle}>토큰 생성 방법:</Text>
          <Text style={styles.guideStep}>1. GitHub에 로그인</Text>
          <Text style={styles.guideStep}>2. Settings → Developer settings → Personal access tokens</Text>
          <Text style={styles.guideStep}>3. "Generate new token (classic)" 클릭</Text>
          <Text style={styles.guideStep}>4. Scopes: repo, user 선택</Text>
          <Text style={styles.guideStep}>5. 토큰 복사 후 아래에 붙여넣기</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="GitHub Personal Access Token"
          value={token}
          onChangeText={setToken}
          secureTextEntry
          placeholderTextColor="#999"
        />

        <Pressable
          onPress={handleLogin}
          disabled={loading || !token.trim()}
          style={[styles.button, (!token.trim() || loading) && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>
            {loading ? '로그인 중...' : '로그인'}
          </Text>
        </Pressable>

        <Pressable
          onPress={openGitHubTokenPage}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>GitHub 토큰 생성 페이지 열기 →</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  guideSection: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 25,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  guideStep: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    lineHeight: 18,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 15,
    fontFamily: 'monospace',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  linkText: {
    color: '#0066cc',
    fontSize: 14,
    fontWeight: '500',
  },
});