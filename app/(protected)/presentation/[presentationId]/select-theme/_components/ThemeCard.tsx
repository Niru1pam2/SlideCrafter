import { Theme } from "@/lib/types";
import React from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type Props = {
  title: string;
  description: string;
  content: React.ReactNode;
  variant: "left" | "main" | "right";
  theme: Theme;
};

export default function ThemeCard({
  content,
  description,
  theme,
  title,
  variant,
}: Props) {
  const variants: Record<string, Variants> = {
    left: {
      hidden: { opacity: 0, x: "-50%", y: "-50%", scale: 0.9 },
      visible: {
        opacity: 1,
        x: "-25%",
        y: "-25%",
        scale: 0.95,
        rotate: -10,
        transition: { type: "spring", stiffness: 300, damping: 30, delay: 0.1 },
      },
    },
    right: {
      hidden: { opacity: 0, x: "50%", y: "50%", scale: 0.9 },
      visible: {
        opacity: 1,
        x: "25%",
        y: "25%",
        scale: 0.95,
        rotate: 10,
        transition: { type: "spring", stiffness: 300, damping: 30, delay: 0.1 },
      },
    },
    main: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 30, delay: 0.2 },
      },
    },
  };

  return (
    <motion.div
      variants={variants[variant]}
      initial="hidden"
      animate="visible"
      className="absolute w-full max-w-3xl p-0"
      style={{ zIndex: variant === "main" ? 10 : 0 }}
    >
      <Card
        className="shadow-2xl backdrop-blur-sm overflow-hidden flex flex-col md:flex-row min-h-96 p-0"
        style={{
          backgroundColor: theme?.slideBackgroundColor,
          border: `1px solid ${theme?.accentColor}20`,
        }}
      >
        {/* TEXT CONTENT */}
        <CardContent className="flex-1 p-8 space-y-6 flex flex-col justify-center">
          <div className="space-y-3">
            <h2
              className="text-3xl font-bold tracking-tight"
              style={{ color: theme.accentColor }}
            >
              {title}
            </h2>
            <p
              className="text-lg opacity-90"
              style={{ color: theme.accentColor }}
            >
              {description}
            </p>
          </div>
          {content}
        </CardContent>

        {/* IMAGE SIDE */}
        <div className="relative w-full md:w-1/2 h-auto  md:h-auto md:min-h-96">
          <Image
            src="https://plus.unsplash.com/premium_photo-1677452023370-1a6c81b3ef81?ixlib=rb-4.1.0&auto=format&fit=crop&q=85&w=1600"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="theme_preview"
            className="object-cover object-center"
            priority
          />
        </div>
      </Card>
    </motion.div>
  );
}
