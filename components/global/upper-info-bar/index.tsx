"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@/lib/generated/prisma/client";
import React from "react";
import SearchBar from "./upper-info-search-bar";
import { ModeToggle } from "../mode-toggle";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import NewProjectButton from "./new-project-button";

type Props = {
  user: User;
};

export default function UpperInfoBar({ user }: Props) {
  return (
    <header
      className="
        sticky top-0 z-50
        flex w-full items-center justify-between gap-3
        bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60
        border-b border-border/40 px-5 py-3
      "
    >
      {/* Left section: Sidebar + Search */}
      <div className="flex items-center gap-3 min-w-0">
        <SidebarTrigger className="shrink-0" />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1 min-w-[200px]">
          <SearchBar />
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center gap-3 flex-wrap justify-end">
        <ModeToggle />
        <Button
          className="
            flex items-center gap-2 rounded-lg font-medium
            text-primary border border-border/30
            hover:bg-muted/70 transition-colors
            cursor-not-allowed opacity-70
          "
          variant="ghost"
          disabled
        >
          <Upload className="w-4 h-4" />
          Import
        </Button>
        <NewProjectButton user={user} />
      </div>
    </header>
  );
}
