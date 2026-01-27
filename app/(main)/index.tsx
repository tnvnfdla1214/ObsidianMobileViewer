import useStore from '@/src/context/store';
import { getFileContent, getRepositoryContents, GitHubContent } from '@/src/utils/github';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function Screen() {
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

  const handleFolderPress = (folder: GitHubContent) => {
    setCurrentPath(folder.path);
  };

  const handleFilePress = async (file: GitHubContent) => {
    if (!token || !currentRepo || !user) return;

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

  const handleGoBack = () => {
    if (currentPath === '') return;
    const parentPath = currentPath.split('/').slice(0, -1).join('/');
    setCurrentPath(parentPath);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const renderItem = ({ item }: { item: GitHubContent }) => {
    const isFolder = item.type === 'dir';
    const isMarkdown = item.name.endsWith('.md');
    const isDisabled = !isFolder && !isMarkdown;

    return (
      <Pressable
        onPress={() => isFolder ? handleFolderPress(item) : handleFilePress(item)}
        disabled={isDisabled}
        className={`mb-2 rounded-xl p-4 ${isDisabled ? 'opacity-50' : 'active:bg-background-100'} bg-background-50`}
      >
        <HStack space="md" className="items-center">
          <Box className="w-8 items-center">
            <Ionicons
              name={isFolder ? 'folder' : isMarkdown ? 'document-text' : 'document'}
              size={24}
              color={isFolder ? '#f0c000' : isMarkdown ? '#6366f1' : '#666'}
            />
          </Box>
          <VStack className="flex-1">
            <Text
              size="sm"
              className={`font-medium ${isDisabled ? 'text-typography-400' : 'text-typography-900'}`}
            >
              {item.name}
            </Text>
            {!isFolder && (
              <Text size="xs" className="text-typography-500">
                {formatSize(item.size)}
              </Text>
            )}
          </VStack>
          {(isFolder || isMarkdown) && (
            <Ionicons name="chevron-forward" size={20} color="#999" />
          )}
        </HStack>
      </Pressable>
    );
  };

  if (!currentRepo) {
    return (
      <Box className="flex-1 items-center justify-center bg-background-0">
        <Text className="text-typography-500">레포지토리를 선택해주세요.</Text>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      {/* Error */}
      {error && (
        <Box className="mx-4 mt-3 rounded-lg bg-error-50 p-3">
          <Text size="sm" className="text-center text-error-600">{error}</Text>
        </Box>
      )}

      {/* Content */}
      {isLoading ? (
        <Box className="flex-1 items-center justify-center">
          <Spinner size="large" />
          <Text size="sm" className="mt-3 text-typography-500">로딩 중...</Text>
        </Box>
      ) : contents.length === 0 ? (
        <Box className="flex-1 items-center justify-center">
          <Text className="text-typography-400">빈 폴더입니다.</Text>
        </Box>
      ) : (
        <FlatList
          data={contents}
          keyExtractor={(item) => item.path}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </Box>
  );
}
