"use client";

import { Button } from "@/components/ui/button";
import {
  containerVariants,
  CreatePageCard,
  itemVariants,
} from "@/lib/constants";
import { motion, Variants } from "framer-motion";
import RecentPrompts from "../GenerateAi/RecentPrompts";
import usePromptStore from "@/store/usePromptStore";
import { useEffect } from "react";

type Props = {
  onSelectOption: (option: string) => void;
};

export default function CreatePage({ onSelectOption }: Props) {
  const { prompts, setPage } = usePromptStore();

  // useEffect(() => {
  //   setPage("create");
  // }, []);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="space-y-10"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants as Variants}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-semibold bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
          How would you like to get started?
        </h1>
        <p className="text-muted-foreground">
          Choose your preferred method to begin
        </p>
      </motion.div>

      {/* Options Section */}
      <motion.div
        variants={itemVariants as Variants}
        className="grid gap-8 md:grid-cols-3"
      >
        {CreatePageCard.map((option) => (
          <motion.div
            key={option.type}
            variants={itemVariants as Variants}
            whileHover={{
              scale: 1.04,
              rotate: 0.5,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            className={`rounded-2xl p-0.5 transition-all duration-300 overflow-hidden ${
              option.highlight
                ? "bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500"
                : "bg-linear-to-r from-zinc-200 via-zinc-300 to-zinc-200 dark:from-zinc-800 dark:via-zinc-900 dark:to-zinc-800"
            }`}
          >
            <div className="w-full h-full p-6 flex flex-col justify-between bg-white dark:bg-zinc-950 rounded-2xl shadow-md transition-all">
              <div className="flex flex-col items-start gap-y-3">
                <p className="text-lg font-semibold text-muted-foreground">
                  {option.title}
                </p>
                <p
                  className={`text-4xl font-bold ${
                    option.highlight
                      ? "bg-linear-to-r  from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent"
                      : "text-primary"
                  }`}
                >
                  {option.highlightedText}
                </p>
              </div>

              <motion.div
                className="self-end mt-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={option.highlight ? "default" : "outline"}
                  className={`w-fit rounded-xl font-semibold ${
                    option.highlight
                      ? "bg-linear-to-r from-violet-500 via-fuchsia-500 to-pink-500 text-white border-none hover:opacity-90"
                      : "hover:bg-linear-to-r hover:from-violet-100 hover:to-pink-100 dark:hover:from-zinc-800 dark:hover:to-zinc-900"
                  }`}
                  size="sm"
                  onClick={() => onSelectOption(option.type)}
                >
                  {option.highlight ? "Generate" : "Continue"}
                </Button>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Prompts */}
      {prompts.length > 0 && <RecentPrompts />}
    </motion.div>
  );
}
