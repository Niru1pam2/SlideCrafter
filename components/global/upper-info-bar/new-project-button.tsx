"use client";

import { Button } from "@/components/ui/button";
import { User } from "@/lib/generated/prisma/client";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewProjectButton({ user }: { user: User }) {
  const router = useRouter();
  return (
    <Button className="font-semibold" disabled={!user?.subscription}>
      <PlusIcon />
      New Project
    </Button>
  );
}
