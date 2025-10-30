"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { containerVariants } from "@/lib/constants";

type Props = {
  onBack: () => void;
};

export default function CreateScratch({ onBack }: Props) {
  const router = useRouter();

  return <motion.div variants={containerVariants}>CreateScratch</motion.div>;
}
