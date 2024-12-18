import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EventState {
  selectedImage: string;
  inputText: string;
  gptText: string;
  setSelectedImage: (image: string) => void;
  setInputText: (text: string) => void;
  setGptText: (text: string) => void;
}

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      selectedImage: '',
      inputText: '',
      gptText: '',
      setSelectedImage: (image) => set({ selectedImage: image }),
      setInputText: (text) => set({ inputText: text }),
      setGptText: (text) => set({ gptText: text }),
    }),
    {
      name: 'event-storage', // localStorage에 저장될 키 이름
    }
  )
);