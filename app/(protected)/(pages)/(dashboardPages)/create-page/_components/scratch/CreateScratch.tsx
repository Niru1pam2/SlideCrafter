"use client";

import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ChevronLeft, RotateCcw } from "lucide-react";
import useScratchStore from "@/store/useScratchStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import CardList from "../Common/CardList";
import { OutlineCard } from "@/lib/types";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/store/useSlideStore";

type Props = {
  onBack: () => void;
};

export default function CreateScratch({ onBack }: Props) {
  const router = useRouter();
  const { resetOutlines, addMultipleOutlines, addOutline, outlines } =
    useScratchStore();
  const [promptText, setPromptText] = useState("");
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [selectCard, setSelectedCard] = useState<string | null>(null);
  const { setProject } = useSlideStore();

  function handleBack() {
    resetOutlines();
    onBack();
  }

  function resetCards() {
    setPromptText("");
    resetOutlines();
  }

  function handleAddCard() {
    const newCard: OutlineCard = {
      id: uuid(),
      title: promptText || "New Section",
      order: outlines.length + 1,
    };

    setPromptText("");
    addOutline(newCard);
  }

  async function handleGenerate() {
    if (outlines.length === 0) {
      toast.error("Error", {
        description: "Please add at least one card to generate PPT",
      });

      return;
    }
    const res = await createProject(outlines[0].title, outlines);

    if (res.status !== 200) {
      toast.error("Error", {
        description: res.error || "Failed to create project",
      });
      return;
    }

    if (res.data) {
      setProject(res.data);
      resetOutlines();
      toast.success("Success", {
        description: "Project created successfully",
      });

      router.push(`/presentation/${res.data.id}/select-theme`);
    } else {
      toast.error("Error", {
        description: "Failed to create project",
      });
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      className="space-y-6 w-full max-w-4xl max-auto px-4 ms:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
    >
      <Button onClick={handleBack} variant={"link"}>
        <ChevronLeft className="size-4" />
        Back
      </Button>

      <h1 className="text-2xl font-bold sm:text-3xl text-left">Prompt</h1>

      <motion.div
        className="rounded-xl bg-primary/10"
        variants={itemVariants as Variants}
      >
        <div className="flex p-4 flex-col sm:flex-row justify-between gap-3 items-center rounded-xl">
          <Input
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && promptText.trim()) {
                handleAddCard();
              }
            }}
            placeholder="Enter Prompt and add to the cards..."
            className="focus-visible:ring-0 border-0 shadow-none p-0 bg-transparent grow dark:bg-transparent"
          />
          <div className="flex items-center gap-3">
            <Select
              value={outlines.length > 0 ? outlines.length.toString() : "0"}
            >
              <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                <SelectValue placeholder="Select number of cards" />
              </SelectTrigger>
              <SelectContent className="w-fit">
                {outlines.length === 0 ? (
                  <SelectItem value="0" className="font-semibold">
                    No cards
                  </SelectItem>
                ) : (
                  Array.from(
                    { length: outlines.length },
                    (_, idx) => idx + 1
                  ).map((num) => (
                    <SelectItem
                      value={num.toString()}
                      key={num}
                      className="font-semibold"
                    >
                      {num} {num === 1 ? "Card" : "Cards"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button
              aria-label="Reset cards"
              variant={"destructive"}
              onClick={resetCards}
              size={"icon"}
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <CardList
        outlines={outlines}
        addOutline={addOutline}
        addMultipleOutlines={addMultipleOutlines}
        editingCard={editingCard}
        setEditingCard={setEditingCard}
        selectedCard={selectCard}
        setSelectedCard={setSelectedCard}
        onCardDoubleClick={(id) => {
          setEditingCard(id);
        }}
        onCardSelect={setSelectedCard}
      />

      <Button
        className="w-full bg-primary-10"
        onClick={handleAddCard}
        variant={"secondary"}
      >
        Add Card
      </Button>

      {outlines.length > 0 && (
        <Button className="w-full" onClick={handleGenerate}>
          Generate PPT
        </Button>
      )}
    </motion.div>
  );
}
