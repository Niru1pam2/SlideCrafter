"use client";

import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader, Loader2, RotateCwIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import useCreativeAIStore from "@/store/useCreativeAIStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import CardList from "../Common/CardList";
import usePromptStore from "@/store/usePromptStore";
import RecentPrompts from "./RecentPrompts";
import { toast } from "sonner";
import { generateCreativePrompt } from "@/actions/gemini";
import { OutlineCard } from "@/lib/types";
import { v4 } from "uuid";
import { createProject } from "@/actions/project";
import { useSlideStore } from "@/store/useSlideStore";

type Props = {
  onBack: () => void;
};

export default function CreativeAI({ onBack }: Props) {
  const router = useRouter();
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [noOfCards, setNoOfCards] = useState(0);
  const { prompts, addPrompt } = usePromptStore();
  const { setProject } = useSlideStore();

  const {
    resetOutlines,
    currentAiPrompt,
    setCurrentAiPrompt,
    outlines,
    addOutline,
    addMultipleOutlines,
  } = useCreativeAIStore();

  function resetCards() {
    setEditingCard(null);
    setSelectedCard(null);
    setNoOfCards(0);
    setCurrentAiPrompt("");
    resetOutlines();
  }

  async function generateOutline() {
    if (currentAiPrompt.trim() === "") {
      toast.error("Error", {
        description: "Please enter a prompt to generate an outline.",
      });
      return;
    }

    setIsGenerating(true);
    const res = await generateCreativePrompt(currentAiPrompt);
    if (res.status === 200 && res?.data?.outlines) {
      const cardsData: OutlineCard[] = [];
      res.data.outlines.map((outline: string, idx: number) => {
        const newCard = {
          id: v4(),
          title: outline,
          order: idx + 1,
        };
        cardsData.push(newCard);
      });

      addMultipleOutlines(cardsData);
      setNoOfCards(cardsData.length);
      toast.success("Success", {
        description: "Outlines generated successfully",
      });
    } else {
      toast.error("Error", {
        description: "Failed to generate outline. Please try again",
      });
    }

    setIsGenerating(false);
  }

  async function handleGenerate() {
    setIsGenerating(true);
    if (outlines.length === 0) {
      toast.error("Error", {
        description: "Please generate an outline first.",
      });
      return;
    }

    try {
      const res = await createProject(
        currentAiPrompt,
        outlines.slice(0, noOfCards)
      );

      if (res.status !== 200 || !res.data) {
        throw new Error("Unable to create project");
      }

      router.push(`/presentation/${res.data.id}/select-theme`);
      setProject(res.data);

      addPrompt({
        id: v4(),
        title: currentAiPrompt || outlines[0].title,
        outlines: outlines,
        createdAt: new Date().toISOString(),
      });

      toast.success("Success", {
        description: "Project successfully created",
      });

      setCurrentAiPrompt("");
      resetOutlines();
    } catch (error) {
      console.log(error);
      toast.error("Error", {
        description: "Failed to create project",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  useEffect(() => {
    setNoOfCards(outlines.length);
  }, [outlines.length]);

  return (
    <motion.div
      className="space-y-6 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Button onClick={onBack} variant={"link"}>
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <motion.div
        variants={itemVariants as Variants}
        className="text-center space-y-2"
      >
        <h1 className="text-4xl font-bold">
          Generate with{" "}
          <span className="text-4xl font-semibold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            SlideCraftAI
          </span>
        </h1>
      </motion.div>

      <motion.div
        className="bg-primary/10 p-4 rounded-xl"
        variants={itemVariants as Variants}
      >
        <div className="flex flex-col sm:flex-row justify-between gap-3 items-center rounded-xl bg-primary-10">
          <Input
            placeholder="Enter your prompt to generate presentation outline..."
            className="text-base sm:text-xl border-0 focus-visible:ring-0 shadow-none grow p-4 dark:bg-transparent"
            required
            value={currentAiPrompt}
            onChange={(e) => setCurrentAiPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !isGenerating &&
                currentAiPrompt.trim()
              ) {
                generateOutline();
              }
            }}
          />

          <div className="flex items-center justify-center gap-3">
            <Select
              value={outlines.length > 0 ? outlines.length.toString() : "0"}
              disabled
            >
              <SelectTrigger className="w-fit gap-2 font-semibold shadow-xl">
                <SelectValue placeholder="No cards" />
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
                      key={num}
                      value={num.toString()}
                      className="font-semibold"
                    >
                      {num} {num === 1 ? "Card" : "Cards"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button
              variant={"destructive"}
              onClick={resetCards}
              size={"icon"}
              aria-label="Reset cards"
              disabled={isGenerating}
            >
              <RotateCwIcon className="size-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="w-full flex justify-center items-center">
        <Button
          className="font-medium text-lg flex gap-2 items-center"
          onClick={generateOutline}
          disabled={isGenerating || !currentAiPrompt.trim()}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin size-4" />
              Generating...
            </>
          ) : (
            "Generate Outline"
          )}
        </Button>
      </div>

      <CardList
        outlines={outlines}
        addOutline={addOutline}
        addMultipleOutlines={addMultipleOutlines}
        editingCard={editingCard}
        setSelectedCard={setSelectedCard}
        selectedCard={selectedCard}
        setEditingCard={setEditingCard}
        onCardSelect={setSelectedCard}
        onCardDoubleClick={(id) => {
          setEditingCard(id);
        }}
      />

      {outlines.length > 0 && (
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin size-4 mr-2" />
              Generating...
            </>
          ) : (
            "Generate PPT"
          )}
        </Button>
      )}

      {prompts.length > 0 && <RecentPrompts />}
    </motion.div>
  );
}
