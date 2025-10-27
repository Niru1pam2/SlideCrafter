import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (timestamp: string) => {
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - new Date(timestamp).getTime()) / 1000
  );

  // Define time intervals
  const intervals = {
    year: 31536000, // 60 * 60 * 24 * 365
    month: 2592000, // 60 * 60 * 24 * 30
    day: 86400, // 60 * 60 * 24
    hour: 3600, // 60 * 60
    minute: 60,
    second: 1,
  };

  if (diffInSeconds < 5) return "just now";

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const count = Math.floor(diffInSeconds / secondsInUnit);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};
