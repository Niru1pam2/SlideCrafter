import { Project } from "@/lib/generated/prisma/client";
import { Slide, Theme } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SlideState {
  slides: Slide[];
  project: Project | null;
  setSlides: (slides: Slide[]) => void;
  setProject: (project: Project) => void;
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void;
}

const defaultTheme: Theme = {
  name: "Default",
  fontFamily: "'Inter', sans-serif",
  fontColor: "#333333",
  backgroundColor: "#f0f0f0",
  slideBackgroundColor: "#ffffff",
  accentColor: "#3b02f6",
  type: "light",
};

export const useSlideStore = create(
  persist<SlideState>(
    (set) => ({
      slides: [],
      setSlides: (slides: Slide[]) => set({ slides }),
      setProject: (project: Project) => set({ project }),
      project: null,

      currentTheme: defaultTheme,

      setCurrentTheme: (theme: Theme) => set({ currentTheme: theme }),
    }),
    {
      name: "slides-storage",
    }
  )
);
