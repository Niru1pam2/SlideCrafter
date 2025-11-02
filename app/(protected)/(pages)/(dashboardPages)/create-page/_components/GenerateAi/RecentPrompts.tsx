"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { containerVariants, itemVariants } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";
import useCreativeAIStore from "@/store/useCreativeAIStore";
import usePromptStore from "@/store/usePromptStore";
import { motion, Variants } from "framer-motion";
import { toast } from "sonner";

export default function RecentPrompts() {
  const { prompts, setPage } = usePromptStore();
  const { addMultipleOutlines, setCurrentAiPrompt } = useCreativeAIStore();

  function handleEdit(id: string) {
    const prompt = prompts.find((prompt) => prompt?.id === id);

    if (prompt) {
      setPage("creative-ai");
      addMultipleOutlines(prompt?.outlines);
      setCurrentAiPrompt(prompt?.title);
    } else {
      toast.error("Error", {
        description: "Prompt not found",
      });
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      className="space-y-4 mt-20! flex flex-col justify-center items-center"
    >
      <motion.h2
        variants={itemVariants as Variants}
        className="text-2xl font-semibold text-center"
      >
        Your Recent Prompts
      </motion.h2>

      <motion.div
        variants={containerVariants}
        className="space-y-2 w-full lg:max-w-[80%]"
      >
        {prompts.map((prompt, idx) => (
          <motion.div key={idx} variants={itemVariants as Variants}>
            <Card className="p-4 grid grid-cols-2 w-full  hover:bg-accent/50 transition-colors duration-300">
              <div className="max-w-[70%]">
                <h3 className="font-semibold text-xl line-clamp-1">
                  {prompt?.title}
                </h3>
                <p className="font-semibold text-sm text-muted-foreground">
                  {timeAgo(prompt.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4 ml-auto">
                <span className="text-sm bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
                  Creative AI
                </span>
                <Button
                  variant={"default"}
                  size={"sm"}
                  className="rounded-xl bg-primary-20 dark:hover:bg-gray-700 hover:bg-gray-200 text-primary"
                  onClick={() => handleEdit(prompt?.id)}
                >
                  Edit
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
