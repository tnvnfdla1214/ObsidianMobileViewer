import useStore from '@/src/context/store';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

export default function EditorScreen() {
  const router = useRouter();
  const { currentFile, setCurrentFile } = useStore();

  const handleGoBack = () => {
    setCurrentFile(null);
    router.back();
  };

  if (!currentFile) {
    return (
      <Box className="flex-1 items-center justify-center bg-background-0">
        <Text className="text-typography-500">파일을 선택해주세요.</Text>
        <Pressable onPress={() => router.back()} className="mt-4 p-3">
          <Text className="text-primary-500">파일 목록으로 돌아가기</Text>
        </Pressable>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-0">
      {/* Header */}
      <Box className="border-b border-outline-200 bg-background-50 px-3 py-3">
        <HStack space="sm" className="items-center">
          <Pressable onPress={handleGoBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#6366f1" />
          </Pressable>
          <VStack className="flex-1">
            <Text size="md" className="font-bold text-typography-900" numberOfLines={1}>
              {currentFile.name}
            </Text>
            <Text size="xs" className="text-typography-500" numberOfLines={1}>
              {currentFile.path}
            </Text>
          </VStack>
        </HStack>
      </Box>

      {/* Markdown Content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
      >
        <Markdown style={markdownStyles}>
          {currentFile.content}
        </Markdown>
      </ScrollView>
    </Box>
  );
}

const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    color: '#1a1a1a',
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
    color: '#1a1a1a',
  },
  heading4: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 4,
    color: '#1a1a1a',
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 12,
  },
  link: {
    color: '#6366f1',
    textDecorationLine: 'underline',
  },
  blockquote: {
    backgroundColor: '#f9f9f9',
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    paddingLeft: 16,
    paddingVertical: 8,
    marginVertical: 12,
  },
  code_inline: {
    backgroundColor: '#f0f0f0',
    fontFamily: 'monospace',
    fontSize: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
    overflow: 'hidden',
  },
  fence: {
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
  },
  list_item: {
    marginVertical: 4,
  },
  bullet_list: {
    marginVertical: 8,
  },
  ordered_list: {
    marginVertical: 8,
  },
  hr: {
    backgroundColor: '#ddd',
    height: 1,
    marginVertical: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 12,
  },
  thead: {
    backgroundColor: '#f5f5f5',
  },
  th: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontWeight: 'bold',
  },
  td: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  strong: {
    fontWeight: 'bold',
  },
  em: {
    fontStyle: 'italic',
  },
  s: {
    textDecorationLine: 'line-through',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 12,
  },
});
