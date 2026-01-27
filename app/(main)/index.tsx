import useStore from '@/src/context/store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList } from 'react-native';

import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function RepositoriesScreen() {
  const router = useRouter();
  const { repositories, user, setCurrentRepo } = useStore();

  const obsidianRepo = repositories.find(repo => repo.name === 'Obsidian');

  useEffect(() => {
    if (obsidianRepo) {
      setCurrentRepo(obsidianRepo);
      router.replace('/(main)/files');
    }
  }, [obsidianRepo]);

  const handleSelectRepository = (repo: any) => {
    setCurrentRepo(repo);
    router.push('/(main)/files');
  };

  const renderRepository = ({ item }: any) => (
    <Pressable
      onPress={() => handleSelectRepository(item)}
      className="mb-3"
    >
      <Card
        size="md"
        variant="elevated"
        className="bg-background-50 border-l-4 border-l-primary-500"
      >
        <VStack space="xs" className="p-4">
          <HStack className="items-center justify-between">
            <Text size="md" className="font-bold text-typography-900">
              {item.name}
            </Text>
            {item.private && (
              <Box className="rounded bg-typography-900 px-2 py-1">
                <Text size="xs" className="text-typography-0">Private</Text>
              </Box>
            )}
          </HStack>
          <Text size="sm" className="text-typography-500">
            {item.description || 'No description'}
          </Text>
          <HStack space="sm" className="mt-2 items-center">
            <Ionicons name="folder-outline" size={14} color="#6366f1" />
            <Text size="xs" className="text-primary-500">탭하여 파일 보기</Text>
          </HStack>
        </VStack>
      </Card>
    </Pressable>
  );

  return (
    <Box className="flex-1 bg-background-0">
      {/* Header */}
      <Box className="border-b border-outline-200 bg-background-50 px-4 py-4">
        <HStack className="items-center justify-between">
          <VStack>
            <Heading size="lg" className="text-typography-900">
              Obsidian Viewer
            </Heading>
            <Text size="sm" className="text-typography-500">
              안녕하세요, {user?.login}!
            </Text>
          </VStack>
          <Ionicons name="logo-github" size={28} color="#333" />
        </HStack>
      </Box>

      {/* Content */}
      {!obsidianRepo ? (
        <Box className="flex-1 items-center justify-center">
          <Ionicons name="folder-open-outline" size={48} color="#ccc" />
          <Text className="mt-4 text-typography-400">
            Obsidian Repository가 없습니다.
          </Text>
          <Text size="sm" className="mt-2 text-typography-500">
            GitHub에 "Obsidian" 레포지토리를 생성해주세요.
          </Text>
        </Box>
      ) : (
        <FlatList
          data={[obsidianRepo]}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRepository}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </Box>
  );
}
