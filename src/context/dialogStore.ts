import { create } from 'zustand';

interface DialogState {
  isOpen: boolean;
  title: string;
  message?: string;
  confirmText: string;
  cancelText: string;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;

  showDialog: (options: {
    title: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;

  hideDialog: () => void;
}

const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '확인',
  cancelText: '취소',
  onConfirm: null,
  onCancel: null,

  showDialog: (options) => set({
    isOpen: true,
    title: options.title,
    message: options.message || '',
    confirmText: options.confirmText || '확인',
    cancelText: options.cancelText || '취소',
    onConfirm: options.onConfirm || null,
    onCancel: options.onCancel || null,
  }),

  hideDialog: () => set({
    isOpen: false,
    title: '',
    message: '',
    confirmText: '확인',
    cancelText: '취소',
    onConfirm: null,
    onCancel: null,
  }),
}));

export default useDialogStore;
