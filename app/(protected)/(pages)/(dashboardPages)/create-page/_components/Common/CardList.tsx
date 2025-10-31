"use client";

import { OutlineCard } from "@/lib/types";
import React from "react";
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
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, GripVertical } from "lucide-react";

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

  editingCard,
  onCardDoubleClick,
  onCardSelect,

  outlines,
  selectedCard,

  setEditingCard,
  setSelectedCard,
}: Props) {
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [localEditText, setLocalEditText] = React.useState("");

  // Require minimum drag distance to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  /* === Drag Handling === */
  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const oldIndex = outlines.findIndex((item) => item.id === active.id);
    const newIndex = outlines.findIndex((item) => item.id === over.id);

    const reordered = arrayMove(outlines, oldIndex, newIndex);
    addMultipleOutlines(reordered.map((c, i) => ({ ...c, order: i + 1 })));
    setActiveId(null);
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  /* === Update Card === */
  function onCardUpdate(id: string, newTitle: string) {
    if (newTitle.trim()) {
      addMultipleOutlines(
        outlines.map((card) =>
          card.id === id ? { ...card, title: newTitle.trim() } : card
        )
      );
    }
    setEditingCard(null);
    setSelectedCard(null);
    setLocalEditText("");
  }

  /* === Start Editing === */
  function startEditing(id: string, title: string) {
    setLocalEditText(title);
    onCardDoubleClick(id, title);
  }

  /* === Delete Card === */
  function onCardDelete(id: string) {
    addMultipleOutlines(
      outlines
        .filter((card) => card.id !== id)
        .map((card, index) => ({ ...card, order: index + 1 }))
    );
    if (selectedCard === id) setSelectedCard(null);
    if (editingCard === id) setEditingCard(null);
  }

  const activeCard = outlines.find((card) => card.id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={outlines} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {outlines.map((card) => (
            <SortableItem
              key={card.id}
              card={card}
              isEditing={editingCard === card.id}
              isSelected={selectedCard === card.id}
              isDragging={activeId === card.id}
              editText={localEditText}
              setEditText={setLocalEditText}
              onEditBlur={() => onCardUpdate(card.id, localEditText)}
              onCardClick={() => onCardSelect(card.id)}
              onCardDoubleClick={() => startEditing(card.id, card.title)}
              onCardDelete={() => onCardDelete(card.id)}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drag Overlay - Shows card being dragged */}
      <DragOverlay>
        {activeCard ? (
          <div className="p-4 bg-primary/20 rounded-xl border-2 border-primary shadow-2xl scale-105">
            <div className="flex justify-between items-center gap-3 ">
              <GripVertical className="size-5 text-muted-foreground shrink-0" />
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className="text-base sm:text-lg font-medium py-1 px-3 rounded-lg bg-primary text-primary-foreground shrink-0">
                  {activeCard.order}
                </span>
                <span className="text-base sm:text-lg truncate">
                  {activeCard.title}
                </span>
              </div>
              <Trash2 className="size-4 shrink-0" />
            </div>
          </div>
        ) : null}
      </DragOverlay>
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
  isDragging,
  editText,
  setEditText,
  onEditBlur,
  onCardClick,
  onCardDoubleClick,
  onCardDelete,
}: {
  card: OutlineCard;
  isEditing: boolean;
  isSelected: boolean;
  isDragging: boolean;
  editText: string;
  setEditText: (value: string) => void;
  onEditBlur: () => void;
  onCardClick: () => void;
  onCardDoubleClick: () => void;
  onCardDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 rounded-xl border transition-all duration-200
        ${
          isDragging
            ? " bg-primary/5 border-primary/20"
            : "bg-primary/10 border-primary/10 hover:bg-primary/20"
        }
        ${
          isEditing || isSelected
            ? "border-primary bg-primary/20 shadow-md"
            : ""
        }`}
      onClick={onCardClick}
      onDoubleClick={onCardDoubleClick}
    >
      <div className="flex justify-between items-center gap-3">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing p-1 hover:bg-primary/10 rounded transition-colors shrink-0
            ${isDragging ? "cursor-grabbing" : ""}`}
          onClick={(e) => e.stopPropagation()}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="size-5 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span
            className={`text-base sm:text-lg font-medium py-1 px-3 rounded-lg shrink-0 transition-colors
              ${
                isEditing || isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/20"
              }`}
          >
            {card.order}
          </span>

          {isEditing ? (
            <Input
              value={editText}
              autoFocus
              onChange={(e) => setEditText(e.target.value)}
              onBlur={onEditBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") onEditBlur();
                if (e.key === "Escape") onEditBlur();
              }}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              className="text-base sm:text-lg flex-1"
            />
          ) : (
            <span className="text-base sm:text-lg">{card.title}</span>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onCardDelete();
          }}
          onDoubleClick={(e) => e.stopPropagation()}
          aria-label={`Delete card ${card.order}`}
          className="shrink-0 hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
