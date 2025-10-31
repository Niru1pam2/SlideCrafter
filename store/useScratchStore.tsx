import { OutlineCard } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type ScratchStore = {
  resetOutlines: () => void;
  outlines: OutlineCard[];
  addOutline: (outline: OutlineCard) => void;
  addMultipleOutlines: (outline: OutlineCard[]) => void;
};

const useScratchStore = create<ScratchStore>()(
  persist(
    (set) => ({
      outlines: [],

      resetOutlines: () => {
        set({ outlines: [] });
      },

      addOutline: (outline: OutlineCard) => {
        set((state) => ({
          outlines: [...state.outlines, outline],
        }));
      },

      addMultipleOutlines: (outlines: OutlineCard[]) => {
        set({ outlines: [...outlines] });
      },
    }),
    {
      name: "scratch-store",
    }
  )
);

export default useScratchStore;
