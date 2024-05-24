"use client";
import { TableProductsOutOfStock } from '@/components/dashboard/products/TableProductsOutOfStock';
import { BarChartProductsSeller } from '@/components/dashboard/sales/BarChartProductsSeller';
import CardActuallySale from '@/components/dashboard/sales/CardActuallySale';
import CardSales from '@/components/dashboard/sales/CardSales';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col w-full h-full p-6 gap-6'>
      <div className='grid grid-cols-2 bg-candy-purple p-4 rounded-2xl'>
        <div className='transition-transform transform hover:scale-105'>
          <Link href='/sales-month'>
            <CardSales />
          </Link>
        </div>
        <div className='transition-transform transform hover:scale-105'>
          <CardActuallySale />
        </div>
      </div>
      <div className='grid grid-cols-2 bg-candy-purple p-4 rounded-2xl gap-4'>
        <div className='bg-white p-4 rounded-2xl'>
          <BarChartProductsSeller />
        </div>
        <div className='bg-white p-4 overflow-auto w-full rounded-2xl'>
          <TableProductsOutOfStock totalRows={5} />
        </div>
      </div>
    </div >
  );
}
