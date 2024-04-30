"use client";
import React, { useState, useEffect } from 'react';
import DynamicTable from '@/components/form/DynamicTable';
import FormLabel from '@/components/form/FormLabel';
import { ColumnDefinition, DataItem } from '@/types';
import Image from 'next/image'

import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';

export default function Home() {
  const [sales, setSales] = useState<DataItem[]>([]);
  const [productions, setProductions] = useState<DataItem[]>([]);

  const columnsSale: ColumnDefinition[] = [
    { key: 'date', title: 'Data' },
    { key: 'total_price', title: 'Valor Total' },
    { key: 'status', title: 'Status' },
    { key: 'order_type', title: 'Tipo de Venda' },
    { key: 'payment_method', title: 'Método de Pagamento' },
  ];
  const columnsProduction: ColumnDefinition[] = [
    { key: 'start_date', title: 'Data de Início' },
    { key: 'end_date', title: 'Data de Término' },
  ];

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders`).then(response => response.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions`).then(response => response.json())
    ])
      .then(([salesData, productionsData]) => {
        setSales(salesData);
        setProductions(productionsData);
      })
      .catch(error => console.error('Failed to fetch data:', error));
  }, []);

  return (
    <div className='grid grid-cols-4 gap-4 w-full h-full p-8'>
      <div className='bg-white p-4 rounded-lg shadow-md min-h-[20vh]'>
        <div className='flex'>
          <span className='text-candy-purple text-sm'>
            <AttachMoneyIcon />
          </span>
          <p>
            Faturamento no mês
          </p>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg shadow-md min-h-[20vh]'>
        <div className='flex'>
          <span className='text-candy-purple text-sm'>
            <BakeryDiningIcon />
          </span>
          <p>
            Produtos mais vendidos
          </p>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg shadow-md min-h-[20vh]'>
        <div className='flex'>
          <span className='text-candy-purple text-sm'>
            <BakeryDiningIcon />
          </span>
          <p>
            Produtos mais produzidos
          </p>
        </div>
      </div>
      <div
        className='flex  bg-white p-4 rounded-lg shadow-md min-h-[20vh]'
        style={{
          backgroundImage: `url('/img/analytics.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'start',
        }}
      >
        <div className='flex'>
          <span className='text-candy-purple text-sm'>
            <AssessmentIcon />
          </span>
          <p>
            Visão geral
          </p>
        </div>
      </div>
      <div className='col-span-2 bg-white p-4 rounded-lg shadow-md'>
        <FormLabel labelType="lastSales" />
        <DynamicTable
          data={sales}
          columns={columnsSale}
          basePath='sale'
          showActions={false}
        />
      </div>
      <div className='col-span-2 bg-white p-4 rounded-lg shadow-md'>
        <FormLabel labelType="lastProductions" />
        <DynamicTable
          data={productions}
          columns={columnsProduction}
          basePath='productions'
          showActions={false}
        />
      </div>
    </div >
  );
}
