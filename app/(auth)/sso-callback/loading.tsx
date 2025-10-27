import { Loader2Icon } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2Icon className="animate-spin" />
    </div>
  );
}
