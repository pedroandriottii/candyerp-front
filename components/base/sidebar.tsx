import { Roboto } from "next/font/google"
import { cn } from "@/lib/utils"

const font = Roboto({
  subsets: ["latin"],
  weight: ["400"]
});

export const Sidebar = () => {
  return (
    <div className={cn("flex flex-col bg-[#294D61] text-white p-4 pr-10 gap-10 border-slate-200 h-screen max-w-60", font.className)}>
      <div>
        <h1 className="uppercase">Home</h1>
        <div className="flex flex-col text-center gap-5 mt-2 mb-2">
          <p className="hover:bg-[#6da5c0] rounded-md p-2">Dashboard</p>
          <p className="hover:bg-[#6da5c0] rounded-md p-2">Relatórios</p>
        </div>
        <hr />
      </div>
      <p>Menu 2</p>
      <p>Menu 3</p>
      <p>Menu 4</p>
      <p>Menu 5</p>
    </div>
  )
}
