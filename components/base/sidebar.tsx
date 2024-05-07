"use client";
import { useEffect, useState } from 'react';
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Image from 'next/image';
import Link from 'next/link';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import DiningIcon from '@mui/icons-material/Dining';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentIcon from '@mui/icons-material/Assessment';

const font = Poppins({
  subsets: ["latin"],
  weight: ["400"]
});

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  function toggleSidebar() {
    if (window.innerWidth >= 640) {
      setIsCollapsed(!isCollapsed);
    }
  }

  return (
    <div className={cn(
      "flex flex-col bg-[#1F1F23] text-white p-4 gap-5 border-slate-200 h-screen transition-all duration-300",
      isCollapsed ? "max-w-20" : "max-w-80",
      font.className
    )}>
      <div className='flex items-center align-center text-center'>
        <Image
          src={isCollapsed ? '/img/candy-logo.png' : '/img/candy-logo-full.png'}
          alt="Logo"
          width={isCollapsed ? 40 : 140}
          height={isCollapsed ? 80 : 300}
        />
      </div>
      <div className="flex flex-row justify-between items-center">
        <h1 className={cn(
          "uppercase text-sm font-bold transition-opacity duration-300",
          isCollapsed ? "hidden" : "opacity-100"
        )}>
          Atalhos
        </h1>
        <button onClick={toggleSidebar} className={cn(
          "hover:bg-gradient-to-r from-purple-500 to-purple-900 rounded-md p-2 transition-all duration-300 lg:flex hidden",
          isCollapsed ? "mx-auto" : ""
        )}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
      <div>
        {isCollapsed ? (
          <div className='flex-col items-center justify-start'>
            <div className='flex flex-col justify-start'></div>
            <div className='flex flex-col gap-3'>
              <Link href='/'>
                <button className='hover:bg-gradient-to-r from-purple-500 to-purple-900 rounded-md p-2'><HomeIcon /></button>
              </Link>
              <hr className="border-t border-white opacity-50 my-2" />
              <Link href='/supplier'>
                <button className='hover:bg-gradient-to-r from-purple-500 to-purple-900 rounded-md p-2'><Diversity3Icon /></button>
              </Link>
              <Link href='/ingredient'>
                <button className='hover:bg-gradient-to-r from-purple-500 to-purple-900 rounded-md p-2'><DiningIcon /></button>
              </Link>
              <Link href='/product'>
                <button className='hover:bg-gradient-to-r from-purple-500 to-purple-900 rounded-md p-2'><Inventory2Icon /></button>
              </Link>
              <Link href='/client'>
                <button className='hover:bg-gradient-to-r from-purple-500 to-purple-900 rounded-md p-2'><AssignmentIndIcon /></button>
              </Link>
              <Link href='/production'>
                <button className='hover:bg-gradient-to-r from-purple-500 to-purple-900 rounded-md p-2'><EventAvailableIcon /></button>
              </Link>
              <Link href='/sale'>
                <button className='hover:bg-gradient-to-r from-purple-500 to-purple-900 rounded-md p-2'><AttachMoneyIcon /></button>
              </Link>
              <hr className="border-t border-white opacity-50 my-2" />
              <Link href='/reports'>
                <button className='hover:bg-gradient-to-r from-purple-500 to-purple-900 rounded-md p-2'><AssessmentIcon /></button>
              </Link>
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-left gap-4'>
            <Link href="/" className='flex items-center uppercase rounded-md p-2 gap-2 hover:bg-gradient-to-r from-purple-500 to-purple-900'>
              <HomeIcon />
              <p>Home</p>
            </Link>
            <hr className="border-t border-white opacity-50 my-2" />
            <Link href="/supplier" className='flex items-center uppercase rounded-md p-2 gap-2 hover:bg-gradient-to-r from-purple-500 to-purple-900'>
              <Diversity3Icon />
              <p className="">Fornecedores</p>
            </Link>
            <Link href="/ingredient" className='flex items-center uppercase rounded-md p-2 gap-2 hover:bg-gradient-to-r from-purple-500 to-purple-900'>
              <DiningIcon />
              <p className="">Ingredientes</p>
            </Link>
            <Link href="/product" className='flex items-center uppercase rounded-md p-2 gap-2 hover:bg-gradient-to-r from-purple-500 to-purple-900'>
              <Inventory2Icon />
              <p className="">Produtos</p>
            </Link>
            <Link href="/client" className='flex items-center uppercase rounded-md p-2 gap-2 hover:bg-gradient-to-r from-purple-500 to-purple-900'>
              <AssignmentIndIcon />
              <p className="">Cliente</p>
            </Link>
            <Link href="/production" className='flex items-center uppercase rounded-md p-2 gap-2 hover:bg-gradient-to-r from-purple-500 to-purple-900'>
              <EventAvailableIcon />
              <p className="">Produção</p>
            </Link>
            <Link href="/sale" className='flex items-center uppercase rounded-md p-2 gap-2 hover:bg-gradient-to-r from-purple-500 to-purple-900'>
              <AttachMoneyIcon />
              <p className="">Vendas</p>
            </Link>
            <hr className="border-t border-white opacity-50 my-2" />
            <Link href="/reports" className='flex items-center uppercase rounded-md p-2 gap-2 hover:bg-gradient-to-r from-purple-500 to-purple-900'>
              <AssessmentIcon />
              <p className="">Relatórios</p>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
