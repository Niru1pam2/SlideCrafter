"use client";

import { Button } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User } from "@/lib/generated/prisma/client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NavFooter({ prismaUser }: { prismaUser: User }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!isLoaded || !isSignedIn) return null;

  function handleUpgrading() {
    setLoading(true);
    // logic to upgrade plan
  }

  return (
    <SidebarMenu
      className="
        px-3 py-4 border-t border-border/40 bg-background/60 backdrop-blur-md
        group-data-[collapsible=icon]:hidden
      "
    >
      <SidebarMenuItem>
        <div className="flex flex-col gap-5 items-start w-full">
          {!prismaUser.subscription && (
            <div className="w-full p-4 rounded-2xl border border-border/30 bg-linear-to-br from-purple-500/10 to-background hover:from-purple-500/15 transition-all">
              <div className="flex flex-col gap-2">
                <p className="text-base font-semibold">
                  Get{" "}
                  <span className="text-purple-500 font-bold">Slide AI</span>
                </p>
                <p className="text-sm text-balance text-muted-foreground leading-snug">
                  Unlock all features including AI assistance and more.
                </p>
              </div>

              <Button
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition-all duration-200"
                size="lg"
                onClick={handleUpgrading}
                disabled={loading}
              >
                {loading ? "Upgrading..." : "Upgrade"}
              </Button>
            </div>
          )}

          <SignedIn>
            <SidebarMenuButton
              size="lg"
              className="flex w-full items-center gap-3 p-2 rounded-xl transition-colors hover:bg-sidebar-accent/70 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
              <div className="flex flex-col text-left text-sm leading-tight truncate">
                <span className="font-medium text-foreground truncate">
                  {user.fullName}
                </span>
                <span className="text-muted-foreground text-xs truncate">
                  {user.emailAddresses[0].emailAddress}
                </span>
              </div>
            </SidebarMenuButton>
          </SignedIn>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
