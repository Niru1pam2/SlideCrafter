"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

type Props = {
  onAddCard: () => void;
};

export default function AddCardButton({ onAddCard }: Props) {
  const [showGap, setShowGap] = useState(false);
  return (
    <motion.div
      initial={{ height: "0.5" }}
      animate={{
        height: showGap ? "2rem" : "0.5rem",
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
    >
      <AnimatePresence>
        {showGap && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-[40%] h-px bg-primary">
              <Button
                className="rounded-full h-8 w-8 p-0 bg-primary hover:bg-primary"
                onClick={onAddCard}
                aria-label="Add new card"
                variant={"outline"}
              >
                <PlusIcon className="h-4 w-4 text-black" />
              </Button>
              <div className="w-[40%] h-px bg-primary" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
