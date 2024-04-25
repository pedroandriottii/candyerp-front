import { Roboto } from "next/font/google"
import { cn } from "@/lib/utils"

const font = Roboto({
  subsets: ["latin"],
  weight: ["400"]
});

export const Navbar = () => {
  return (
    <div className=" flex flex-start bg-[#18181B] justify-between items-center align-center w-screen p-4 text-white">
      <h1 className="flex uppercase text-2xl">Candy ERP</h1>
      <h1>User Icon</h1>
    </div>
  )
}
