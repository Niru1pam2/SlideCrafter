import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="min-w-[60%] relative flex items-center border rounded-full bg-primary-90">
      <Button
        type="submit"
        size={"sm"}
        variant={"ghost"}
        className="absolute left-0 h-full rounded-r-none bg-transparent hover:bg-transparent"
      >
        <Search className="w-4 h-4" />
        <span className="sr-only">Search</span>
      </Button>
      <Input
        type="text"
        placeholder="Search by title"
        className="ml-6 focus-visible:ring-offset-0 focus-visible:ring-0 border-none grow"
      />
    </div>
  );
}
