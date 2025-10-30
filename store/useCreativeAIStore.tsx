import { OutlineCard } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// outline card
// title, id, order

type CreativeAIStore = {
  outlines: OutlineCard[] | [];
  addMultipleOutlines: (outline: OutlineCard[]) => void;
  addOutline: (outline: OutlineCard) => void;
  setCurrentAiPrompt: (prompt: string) => void;
  currentAiPrompt: string;
  resetOutlines: () => void;
};

const useCreativeAIStore = create<CreativeAIStore>()(
  persist(
    (set) => ({
      outlines: [],
      addOutline: (outline: OutlineCard) => {
        set((state) => ({
          outlines: [outline, ...state.outlines],
        }));
      },

      addMultipleOutlines: (outlines: OutlineCard[]) => {
        set(() => ({
          outlines: [...outlines],
        }));
      },

      currentAiPrompt: "",

      setCurrentAiPrompt: (prompt: string) => {
        set({
          currentAiPrompt: prompt,
        });
      },

      resetOutlines: () => {
        set({ outlines: [] });
      },
    }),

    {
      name: "creative-ai",
    }
  )
);

export default useCreativeAIStore;
