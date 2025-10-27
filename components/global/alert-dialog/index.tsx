import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function AlertDialogCard({
  onClick,
  recoverable,
}: {
  onClick: () => void;
  recoverable?: boolean;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild onClick={onClick}>
        <Button variant="outline">{recoverable ? "Recover" : "Delete"}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {recoverable
              ? "This will recover your project and restore your data"
              : "This will delete your project"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={`${
              recoverable ? "bg-green-400 text-white" : "bg-red-500 text-white"
            }`}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
