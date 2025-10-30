"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import usePromptStore from "@/store/usePromptStore";
import CreatePage from "./CreatePage";
import CreativeAI from "../GenerateAi/CreativeAI";
import CreateScratch from "../scratch/CreateScratch";

export default function RenderPage() {
  const router = useRouter();

  const { page, setPage } = usePromptStore();

  function handleSelectOption(option: string) {
    if (option === "template") {
      router.push("/templates");
    } else if (option === "create-scratch") {
      setPage("create-scratch");
    } else if (option === "creative-ai") {
      setPage("creative-ai");
    } else {
      setPage("create");
    }
  }

  function handleBack() {
    setPage("create");
  }

  function renderStep() {
    switch (page) {
      case "create":
        return <CreatePage onSelectOption={handleSelectOption} />;
      case "create-scratch":
        return <CreateScratch onBack={handleBack} />;
      case "creative-ai":
        return <CreativeAI onBack={handleBack} />;

      default:
        return null;
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
}
