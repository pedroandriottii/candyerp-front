import { Roboto } from "next/font/google"
import { cn } from "@/lib/utils"

const font = Roboto({
  subsets: ["latin"],
  weight: ["400"]
});

export const Navbar = () => {
  return (
    <div className=" flex flex-start bg-[#294D61] justify-between items-center align-center w-screen p-4 text-white">
      <div className="flex gap-6 items-center">
        <a className="flex flex-col space-y-1 items-center justity-center align-center">
          <div className="h-0.5 w-6 bg-white"></div>
          <div className="h-0.5 w-6 bg-white"></div>
          <div className="h-0.5 w-6 bg-white"></div>
        </a>
        <h1 className="flex uppercase text-2xl">Candy ERP</h1>
      </div>
      <h1>User Icon</h1>
    </div>
  )
}
