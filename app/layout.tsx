import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/base/sidebar";
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Candy ERP",
  description: "Gerenciamento de Negócios Fácil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("inset-0 bg-candy-background", inter.className)}>
        <div className="flex">
          <div className="bg-[#1F1F23]">
            <Sidebar />
          </div>
          {children}
        </div>
      </body>
    </html >
  );
}
