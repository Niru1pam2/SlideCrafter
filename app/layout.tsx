import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional weights
  variable: "--font-poppins", // optional CSS variable
});

export const metadata: Metadata = {
  title: "SlideCraft",
  description: "Build AI powered presentations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        theme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning className={poppins.variable}>
        <body className={`font-sans antialiased`} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
