import useDialogStore from '@/src/context/dialogStore';
import useStore from '@/src/context/store';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';

import { Box } from '@/components/ui/box';
import { Spinner } from '@/components/ui/spinner';

export default function EditorScreen() {
  const router = useRouter();
  const { currentFile } = useStore();

  // const { currentFile: _currentFile } = useStore();
  // const currentFile = null; // 테스트용

  const { showDialog } = useDialogStore();

  useEffect(() => {
    if (!currentFile) {
      showDialog({
        title: '파일을 찾을 수 없습니다',
        message: '선택된 파일이 없습니다. 이전 화면으로 이동합니다.',
        confirmText: '뒤로가기',
        onConfirm: () => {
          router.back();
        },
      });
    }
  }, [currentFile]);

  if (!currentFile) {
    return (
      <Box className="flex-1 items-center justify-center bg-background-950">
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-950">
      <ScrollView
        style={{ flex: 1, backgroundColor: '#0f0f0f' }}
        contentContainerStyle={{ padding: 16 }}
      >
        <Markdown style={darkMarkdownStyles}>
          {currentFile.content}
        </Markdown>
      </ScrollView>
    </Box>
  );
}

const darkMarkdownStyles = StyleSheet.create({
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: '#e4e4e7',
  },
  heading1: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
    paddingBottom: 10,
  },
  heading2: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#fafafa',
  },
  heading3: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
    color: '#fafafa',
  },
  heading4: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
    color: '#e4e4e7',
  },
  heading5: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 4,
    color: '#e4e4e7',
  },
  heading6: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    color: '#a1a1aa',
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 14,
    color: '#e4e4e7',
  },
  link: {
    color: '#818cf8',
    textDecorationLine: 'none',
  },
  blockquote: {
    backgroundColor: '#18181b',
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 10,
    marginVertical: 14,
    borderRadius: 4,
  },
  code_inline: {
    backgroundColor: '#27272a',
    color: '#f472b6',
    fontFamily: 'monospace',
    fontSize: 14,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  code_block: {
    backgroundColor: '#18181b',
    color: '#a5f3fc',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 14,
    borderRadius: 8,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  fence: {
    backgroundColor: '#18181b',
    color: '#a5f3fc',
    fontFamily: 'monospace',
    fontSize: 14,
    padding: 14,
    borderRadius: 8,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  list_item: {
    marginVertical: 4,
    color: '#e4e4e7',
  },
  bullet_list: {
    marginVertical: 10,
  },
  ordered_list: {
    marginVertical: 10,
  },
  bullet_list_icon: {
    color: '#6366f1',
  },
  ordered_list_icon: {
    color: '#6366f1',
  },
  hr: {
    backgroundColor: '#3f3f46',
    height: 1,
    marginVertical: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#3f3f46',
    marginVertical: 14,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thead: {
    backgroundColor: '#27272a',
  },
  th: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#3f3f46',
    fontWeight: 'bold',
    color: '#fafafa',
  },
  tr: {
    backgroundColor: '#18181b',
  },
  td: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#3f3f46',
    color: '#e4e4e7',
  },
  strong: {
    fontWeight: 'bold',
    color: '#fafafa',
  },
  em: {
    fontStyle: 'italic',
    color: '#d4d4d8',
  },
  s: {
    textDecorationLine: 'line-through',
    color: '#71717a',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 14,
    borderRadius: 8,
  },
  text: {
    color: '#e4e4e7',
  },
});
