import { Loader2Icon } from "lucide-react";

export default function CreatePageSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2Icon className="size-8 animate-spin" />
    </div>
  );
}
