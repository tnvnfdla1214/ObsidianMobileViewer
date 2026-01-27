import useStore from '@/src/context/store';
import { getFileContent, getRepositoryContents, GitHubContent } from '@/src/utils/github';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function FilesScreen() {
  const router = useRouter();
  const {
    token,
    user,
    currentRepo,
    currentPath,
    setCurrentPath,
    setCurrentFile,
    isLoading,
    setIsLoading
  } = useStore();

  const [contents, setContents] = useState<GitHubContent[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 파일 목록 로드
  useEffect(() => {
    loadContents();
  }, [currentPath, currentRepo]);

  const loadContents = async () => {
    if (!token || !currentRepo || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await getRepositoryContents(
        token,
        user.login,
        currentRepo.name,
        currentPath
      );
      setContents(data);
    } catch (err: any) {
      console.error('Failed to load contents:', err);
      setError('파일 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 폴더 클릭 -> 해당 폴더로 이동
  const handleFolderPress = (folder: GitHubContent) => {
    setCurrentPath(folder.path);
  };

  // 파일 클릭 -> 파일 내용 보기
  const handleFilePress = async (file: GitHubContent) => {
    if (!token || !currentRepo || !user) return;

    // 마크다운 파일만 지원
    if (!file.name.endsWith('.md')) {
      setError('마크다운(.md) 파일만 볼 수 있습니다.');
      return;
    }

    setIsLoading(true);
    try {
      const content = await getFileContent(
        token,
        user.login,
        currentRepo.name,
        file.path
      );
      setCurrentFile({
        name: file.name,
        path: file.path,
        content,
      });
      router.push('/(main)/editor');
    } catch (err) {
      console.error('Failed to load file:', err);
      setError('파일을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 뒤로 가기 (상위 폴더로)
  const handleGoBack = () => {
    if (currentPath === '') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    setCurrentPath(parentPath);
  };

  const renderItem = ({ item }: { item: GitHubContent }) => {
    const isFolder = item.type === 'dir';
    const isMarkdown = item.name.endsWith('.md');

    return (
      <Pressable
        onPress={() => isFolder ? handleFolderPress(item) : handleFilePress(item)}
        style={[styles.item, !isFolder && !isMarkdown && styles.itemDisabled]}
        disabled={!isFolder && !isMarkdown}
      >
        <Ionicons
          name={isFolder ? 'folder' : isMarkdown ? 'document-text' : 'document'}
          size={24}
          color={isFolder ? '#f0c000' : isMarkdown ? '#6366f1' : '#999'}
          style={styles.icon}
        />
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, !isFolder && !isMarkdown && styles.textDisabled]}>
            {item.name}
          </Text>
          {!isFolder && (
            <Text style={styles.itemSize}>
              {formatSize(item.size)}
            </Text>
          )}
        </View>
        {(isFolder || isMarkdown) && (
          <Ionicons name="chevron-forward" size={20} color="#999" />
        )}
      </Pressable>
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (!currentRepo) {
    return (
      <View style={styles.centerContainer}>
        <Text>레포지토리를 선택해주세요.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더: 현재 경로 */}
      <View style={styles.header}>
        <Text style={styles.repoName}>{currentRepo.name}</Text>
        <Text style={styles.pathText}>/{currentPath || ''}</Text>
      </View>

      {/* 뒤로 가기 버튼 */}
      {currentPath !== '' && (
        <Pressable onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={20} color="#0066cc" />
          <Text style={styles.backText}>상위 폴더</Text>
        </Pressable>
      )}

      {/* 에러 메시지 */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* 로딩 */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      ) : contents.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>빈 폴더입니다.</Text>
        </View>
      ) : (
        <FlatList
          data={contents}
          keyExtractor={(item) => item.path}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  repoName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pathText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'monospace',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backText: {
    marginLeft: 8,
    color: '#0066cc',
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    margin: 10,
    borderRadius: 8,
  },
  errorText: {
    color: '#dc2626',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
  listContent: {
    padding: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  icon: {
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
  },
  textDisabled: {
    color: '#999',
  },
  itemSize: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
});
