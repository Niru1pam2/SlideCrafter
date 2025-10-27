"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Project, User } from "@/lib/generated/prisma/client";
import React from "react";
import NavMenu from "./nav-menu";
import { data } from "@/lib/constants";
import RecentOpen from "./recent-open";
import NavFooter from "./nav-footer";

export default function AppSidebar({
  recentProjects,
  user,
  ...props
}: {
  recentProjects: Project[];
} & { user: User } & React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="max-w-[212px] bg-background-90"
    >
      <SidebarHeader className="pt-6 px-3 pb-0">
        <SidebarMenuButton
          size={"lg"}
          className="data-[state=open]:text-sidebar-accent-foreground"
        >
          {/* <div className="flex aspect-square size-8 items-center justify-center text-sidebar-primary-foreground">
            <Avatar className="h-10 w-10 bg-white">
              <AvatarImage
                src={"/main.png"}
                alt="SC"
                className="object-cover"
              />
              <AvatarFallback className="rounded-lg">SC</AvatarFallback>
            </Avatar>
          </div> */}
          <span className="truncate text-primary text-xl font-semibold">
            SlideCraft
          </span>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent className=" mt-10 gap-y-6">
        <NavMenu items={data.navMain} />
        <RecentOpen recentProjects={recentProjects} />
      </SidebarContent>
      <SidebarFooter>
        <NavFooter prismaUser={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
