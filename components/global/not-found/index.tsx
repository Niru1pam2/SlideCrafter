"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { EyeClosed } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Card className="max-w-md w-full shadow-lg border border-border/40 bg-background/60 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-3">
          <div className="p-3 rounded-full bg-secondary flex items-center justify-center">
            <EyeClosed className="size-6 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Not Found</h1>
          <p className="text-sm text-muted-foreground">Nothing to see here.</p>
        </CardHeader>

        <CardContent className="flex justify-center">
          <p className="text-center text-sm text-muted-foreground">
            The page you’re looking for doesn’t exist or has been removed.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
