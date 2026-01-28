import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';

import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import useDialogStore from '@/src/context/dialogStore';

export default function GlobalDialog() {
  const {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
    hideDialog,
  } = useDialogStore();

  const handleConfirm = () => {
    onConfirm?.();
    hideDialog();
  };

  const handleCancel = () => {
    onCancel?.();
    hideDialog();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <View style={styles.overlay}>
        <Box className="mx-6 rounded-2xl bg-background-50 p-5" style={styles.dialog}>
          <VStack space="md">
            <Heading size="lg" className="text-typography-900">
              {title}
            </Heading>

            {message && (
              <Text size="sm" className="text-typography-600">
                {message}
              </Text>
            )}

            <HStack space="sm" className="mt-2 justify-end">
              <Button
                variant="outline"
                action="secondary"
                onPress={handleCancel}
                className="flex-1"
              >
                <ButtonText>{cancelText}</ButtonText>
              </Button>
              <Button
                variant="solid"
                action="primary"
                onPress={handleConfirm}
                className="flex-1"
              >
                <ButtonText>{confirmText}</ButtonText>
              </Button>
            </HStack>
          </VStack>
        </Box>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: '100%',
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
