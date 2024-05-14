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
      <body className={cn("fixed inset-0 overflow-hidden bg-candy-background", inter.className)}>
        {/* <Navbar /> */}
        <div className="flex">
          <Sidebar />
          {children}
        </div>
      </body>
    </html >
  );
}
