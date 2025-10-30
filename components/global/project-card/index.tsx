/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { itemVariants, themes } from "@/lib/constants";
import { useSlideStore } from "@/store/useSlideStore";
import { JsonValue } from "@prisma/client/runtime/library";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import ThumbnailPreview from "./thumbnail-preview";
import { timeAgo } from "@/lib/utils";
import AlertDialogCard from "../alert-dialog";
import { toast } from "sonner";
import { deleteProject, recoverProject } from "@/actions/project";

type Props = {
  projectId: string;
  title: string;
  createdAt: string;
  isDelete?: boolean;
  slideData: JsonValue;
  themeName: string;
};

export default function ProjectCard({
  createdAt,
  projectId,
  slideData,
  title,
  isDelete,
  themeName,
}: Props) {
  const router = useRouter();
  const { setSlides } = useSlideStore();

  const handleNavigation = () => {
    setSlides(JSON.parse(JSON.stringify(slideData)));
    router.push(`/presentation/${projectId}`);
  };

  const theme = themes.find((theme) => theme.name === themeName) || themes[0];

  const handleRecover = async () => {
    if (!projectId) {
      toast.error("Error ", {
        description: "Project not found.",
      });
      return;
    }

    try {
      const res = await recoverProject(projectId);

      if (res.status !== 200) {
        toast.error("Oops!", {
          description: res.error || "Something went wrong",
        });

        return;
      }

      router.refresh();
      toast.success("Success", {
        description: "Project recovered successfully",
      });
    } catch (error) {
      toast.error("Oops!", {
        description: "Something went wrong. Please contact support.",
      });
    }
  };

  const handleDelete = async () => {
    if (!projectId) {
      toast.error("Error ", {
        description: "Project not found.",
      });
      return;
    }

    try {
      const res = await deleteProject(projectId);

      if (res.status !== 200) {
        toast.error("Oops!", {
          description: res.error || "Failed to delete the project",
        });

        return;
      }

      router.refresh();
      toast.success("Success", {
        description: "Project deleted successfully",
      });
    } catch (error) {
      console.log(error);

      toast.error("Oops!", {
        description: "Something went wrong. Please contact support.",
      });
    }
  };

  return (
    <motion.div
      variants={itemVariants as Variants}
      className={`group w-full flex flex-col gap-y-3 rounded-xl p-3 transition-colors ${
        !isDelete && "hover:bg-muted/50"
      }`}
    >
      <div onClick={handleNavigation}>
        {/* <ThumbnailPreview
          //   slide={JSON.parse(JSON.stringify(slideData)?.[0])}
          theme={theme}
        /> */}
      </div>

      <div className="w-full">
        <div className="space-y-1">
          <h3 className="font-semibold text-base text-primary line-clamp-1">
            {title}
          </h3>
          <div className="flex w-full justify-between items-center gap-2">
            <p
              className="text-sm text-muted-foreground"
              suppressHydrationWarning
            >
              {timeAgo(createdAt)}
            </p>

            {isDelete ? (
              <AlertDialogCard onClick={handleRecover} recoverable />
            ) : (
              <AlertDialogCard onClick={handleDelete} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
