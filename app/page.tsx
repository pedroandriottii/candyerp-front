"use client";
import React, { useState, useEffect } from 'react';
import { ColumnDefinition, DataItem } from '@/types';

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';

export default function Home() {
  return (
    <div className='grid grid-cols-1 gap- 8 justify-between w-full h-full p-8'>
      <div className='grid grid-cols-4 gap-8'>
        <div className='bg-white p-4 rounded-lg shadow-md min-h-[20vh] '>
          <div className='flex gap-2'>
            <span className='text-candy-purple text-sm'>
              <AttachMoneyIcon />
            </span>
            <p>
              Faturamento no mês
            </p>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md min-h-[20vh] '>
          <div className='flex gap-2'>
            <span className='text-candy-purple text-sm'>
              <ShoppingCartIcon />
            </span>
            <p>
              Produtos mais vendidos
            </p>
          </div>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-md min-h-[20vh] '>
          <div className='flex gap-2'>
            <span className='text-candy-purple text-sm'>
              <BakeryDiningIcon />
            </span>
            <p>
              Produtos mais produzidos
            </p>
          </div>
        </div>
        <div
          className='bg-white p-4 rounded-lg shadow-md min-h-[20vh] '
          style={{
            backgroundImage: `url('/img/analytics.svg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'start',
          }}
        >
          <div className='flex gap-2'>
            <span className='text-candy-purple text-sm'>
              <AssessmentIcon />
            </span>
            <p>
              Visão geral
            </p>
          </div>
        </div>
      </div>
    </div >
  );
}
