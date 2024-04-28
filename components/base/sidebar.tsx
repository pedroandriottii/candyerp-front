"use client";

import { useState } from 'react';
import { Roboto } from "next/font/google";
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
          "hover:bg-candy-purple rounded-md p-2 transition-all duration-300",
          isCollapsed ? "mx-auto" : ""
        )}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>
      <div>
        {/* PEQUENO */}
        {isCollapsed ? (
          <div className='flex flex-col items-center justify-start'>
            <div className='flex flex-col justify-start'>
            </div>
            <div className='flex flex-col gap-3'>
              <Link href='/'>
                <button className='hover:bg-candy-purple rounded-md p-2'><HomeIcon /></button>
              </Link>
              <Link href='/supplier'>
                <button className='hover:bg-candy-purple rounded-md p-2'><Diversity3Icon /></button>
              </Link>
              <Link href='/ingredient'>
                <button className='hover:bg-candy-purple rounded-md p-2'><DiningIcon /></button>
              </Link>
              <Link href='/product'>
                <button className='hover:bg-candy-purple rounded-md p-2'><Inventory2Icon /></button>
              </Link>
              <Link href='/client'>
                <button className='hover:bg-candy-purple rounded-md p-2'><AssignmentIndIcon /></button>
              </Link>
              <Link href='/production'>
                <button className='hover:bg-candy-purple rounded-md p-2'><EventAvailableIcon /></button>
              </Link>
              <Link href='/sale'>
                <button className='hover:bg-candy-purple rounded-md p-2'><AttachMoneyIcon /></button>
              </Link>

            </div>
          </div>
        ) : (
          <div className='items-center'>
            <Link href="/" className='flex items-center uppercase hover:bg-candy-purple rounded-md p-2 gap-2'>
              <HomeIcon />
              <p className="">Home</p>
            </Link>
            <Link href="/supplier" className='flex items-center uppercase hover:bg-candy-purple rounded-md p-2 gap-2'>
              <Diversity3Icon />
              <p className="">Fornecedores</p>
            </Link>
            <Link href="/ingredient" className='flex items-center uppercase hover:bg-candy-purple rounded-md p-2 gap-2'>
              <DiningIcon />
              <p className="">Ingredientes</p>
            </Link>
            <Link href="/product" className='flex items-center uppercase hover:bg-candy-purple rounded-md p-2 gap-2'>
              <Inventory2Icon />
              <p className="">Produtos</p>
            </Link>
            <Link href="/client" className='flex items-center uppercase hover:bg-candy-purple rounded-md p-2 gap-2'>
              <AssignmentIndIcon />
              <p className="">Cliente</p>
            </Link>
            <Link href="/production" className='flex items-center uppercase hover:bg-candy-purple rounded-md p-2 gap-2'>
              <EventAvailableIcon />
              <p className="">Produção</p>
            </Link>
            <Link href="/sale" className='flex items-center uppercase hover:bg-candy-purple rounded-md p-2 gap-2'>
              <AttachMoneyIcon />
              <p className="">Vendas</p>
            </Link>
          </div>
        )}
      </div>
    </div >
  )
}
