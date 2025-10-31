"use client";

import { getProjectById } from "@/actions/project";
import { themes } from "@/lib/constants";
import { useSlideStore } from "@/store/useSlideStore";
import { Loader2 } from "lucide-react";
import { useTheme } from "next-themes";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const { setTheme } = useTheme();
  const { currentTheme, setCurrentTheme, setSlides, slides, setProject } =
    useSlideStore();

  useEffect(() => {
    (async () => {
      try {
        const res = await getProjectById(params.presentationId as string);

        if (res.status !== 200 || !res.data) {
          toast.error("Error", {
            description: "Unable to fetch project",
          });
          redirect("/dashboard");
        }

        const findTheme = themes.find(
          (theme) => theme.name === res.data.themeName
        );

        setCurrentTheme(findTheme || themes[0]);
        setTheme(findTheme?.type === "dark" ? "dark" : "light");

        setProject(res.data);
        setSlides(JSON.parse(JSON.stringify(res.data.slides)));
      } catch {
        toast.error("Error", {
          description: "An unexpected error occurred",
        });
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin size-8" />
      </div>
    );
  }

  return <DndContext>page</DndContext>;
}
