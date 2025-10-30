"use client";

import { OutlineCard } from "@/lib/types";
import { motion } from "framer-motion";
import React from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import AddCardButton from "./AddCardButton";

type Props = {
  outlines: OutlineCard[];
  editingCard: string | null;
  selectedCard: string | null;
  editText: string;
  addOutline?: (card: OutlineCard) => void;
  onEditChange: (value: string) => void;
  onCardSelect: (id: string) => void;
  onCardDoubleClick: (id: string, title: string) => void;
  setEditText: (value: string) => void;
  setEditingCard: (id: string | null) => void;
  setSelectedCard: (id: string | null) => void;
  addMultipleOutlines: (cards: OutlineCard[]) => void;
};

export default function CardList({
  addMultipleOutlines,
  editText,
  editingCard,
  onCardDoubleClick,
  onCardSelect,
  onEditChange,
  outlines,
  selectedCard,
  setEditText,
  setEditingCard,
  setSelectedCard,
}: Props) {
  /* === Drag Handling === */
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = outlines.findIndex((item) => item.id === active.id);
    const newIndex = outlines.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(outlines, oldIndex, newIndex);
    addMultipleOutlines(reordered.map((c, i) => ({ ...c, order: i + 1 })));
  }

  /* === Update Card === */
  function onCardUpdate(id: string, newTitle: string) {
    addMultipleOutlines(
      outlines.map((card) =>
        card.id === id ? { ...card, title: newTitle } : card
      )
    );
    setEditingCard(null);
    setSelectedCard(null);
    setEditText("");
  }

  /* === Delete Card === */
  function onCardDelete(id: string) {
    addMultipleOutlines(
      outlines
        .filter((card) => card.id !== id)
        .map((card, index) => ({ ...card, order: index + 1 }))
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={outlines} strategy={verticalListSortingStrategy}>
        <motion.div layout className="space-y-3">
          {outlines.map((card, index) => (
            <>
              <SortableItem
                key={card.id}
                card={card}
                isEditing={editingCard === card.id}
                isSelected={selectedCard === card.id}
                editText={editText}
                setEditText={setEditText}
                onEditBlur={() => onCardUpdate(card.id, editText)}
                onCardDoubleClick={() => onCardDoubleClick(card.id, card.title)}
                onCardDelete={() => onCardDelete(card.id)}
              />
              {/* <AddCardButton onAddCard={() => onAddCard(index)} /> */}
            </>
          ))}
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}

/* ==========================
   SORTABLE ITEM COMPONENT
========================== */

function SortableItem({
  card,
  isEditing,
  isSelected,
  editText,
  setEditText,
  onEditBlur,
  onCardDoubleClick,
  onCardDelete,
}: {
  card: OutlineCard;
  isEditing: boolean;
  isSelected: boolean;
  editText: string;
  setEditText: (value: string) => void;
  onEditBlur: () => void;
  onCardDoubleClick: () => void;
  onCardDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      className={`p-4 bg-primary/10 rounded-xl border border-primary/10 cursor-grab active:cursor-grabbing hover:bg-primary/20 transition-colors
        ${isEditing || isSelected ? "border-primary bg-primary/20" : ""}`}
      onDoubleClick={onCardDoubleClick}
    >
      <div className="flex justify-between items-center">
        {isEditing ? (
          <Input
            value={editText}
            autoFocus
            onChange={(e) => setEditText(e.target.value)}
            onBlur={onEditBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEditBlur();
            }}
            className="text-base sm:text-lg"
          />
        ) : (
          <div className="flex items-center gap-3">
            <span
              className={`text-base sm:text-lg font-medium py-1 px-3 rounded-lg bg-primary/20 
                ${
                  isEditing || isSelected
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
            >
              {card.order}
            </span>
            <span className="text-base sm:text-lg">{card.title}</span>
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onCardDelete();
          }}
          aria-label={`Delete card ${card.order}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </motion.div>
  );
}
