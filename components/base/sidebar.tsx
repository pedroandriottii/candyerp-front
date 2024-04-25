import { useState } from 'react';
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const font = Roboto({
  subsets: ["latin"],
  weight: ["400"]
});

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  function toggleSidebar() {
    setIsCollapsed(!isCollapsed);
  }

  return (
    <div className={cn(
      "flex flex-col bg-[#1F1F23] text-white p-4 gap-5 border-slate-200 h-screen transition-all duration-300",
      isCollapsed ? "max-w-20" : "max-w-80",
      font.className
    )}>
      <div className="flex flex-row justify-between items-center">
        <h1 className={cn(
          "uppercase text-sm font-bold transition-opacity duration-300",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          Atalhos Recomendados
        </h1>
        <button onClick={toggleSidebar} className={cn("", isCollapsed ? "opacity-0" : "opacity-100")}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
      <div>
        {/* PEQUENO */}
        {isCollapsed ? (
          <div className='flex flex-col items-center justify-start'>
            <div className='flex flex-col justify-start'>
              <button onClick={toggleSidebar}>
                <ChevronRightIcon />
              </button>
            </div>
            <div className='flex flex-col gap-5'>
              <button className='hover:bg-[#6da5c0] rounded-md p-2'><DashboardIcon /></button>
              <button className='hover:bg-[#6da5c0] rounded-md p-2'><HomeIcon /></button>
              <button className='hover:bg-[#6da5c0] rounded-md p-2'><ReportIcon /></button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="uppercase">Home</h1>
            <div className="flex flex-col text-center gap-5 mt-2 mb-2">
              <p className="hover:bg-[#6da5c0] rounded-md p-2">Dashboard</p>
              <p className="hover:bg-[#6da5c0] rounded-md p-2">Relatórios</p>
            </div>
            <hr />
            <p>Menu 2</p>
            <p>Menu 3</p>
            <p>Menu 4</p>
            <p>Menu 5</p>
          </>
        )}
      </div>
    </div>
  )
}
