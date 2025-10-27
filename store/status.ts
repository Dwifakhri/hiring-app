import { create } from 'zustand';

interface StatusState {
  status: 'success' | 'error' | '';
  message: string;
  setStatus: (payload: {
    status: StatusState['status'];
    message: string;
  }) => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  status: '',
  message: '',
  setStatus: (payload) => set(payload),
}));
