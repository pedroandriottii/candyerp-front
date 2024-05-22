"use client";
import { BarChartProductsSeller } from '@/components/dashboard/BarChartProductsSeller';
import Card from '@/components/dashboard/Card';
import CardActuallySale from '@/components/dashboard/CardActuallySale';
import { DonutChartHero } from '@/components/dashboard/DonutChartHero';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col w-full h-full p-8'>
      <div className='grid grid-cols-3'>
        <div className='transition-transform transform hover:scale-105'>
          <Link href='/sales-month'>
            <Card />
          </Link>
        </div>
        <div>
          <Card />
        </div>
        <div>
          <Card />
        </div>
        {/* <div >
          <DonutChartHero />
        </div> */}
      </div>
      <div className='grid grid-cols-2'>
        <div className=''>
          <BarChartProductsSeller />
        </div>
        <div>
          <BarChartProductsSeller />
        </div>
      </div>

    </div >
  );
}
