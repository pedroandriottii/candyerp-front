"use client";
import Card from '@/components/dashboard/Card';
import CardActuallySale from '@/components/dashboard/CardActuallySale';
import { DonutChartHero } from '@/components/dashboard/DonutChartHero';

export default function Home() {
  return (
    <div className='grid grid-cols-1 gap- 8 justify-between w-full h-full p-8'>
      <div className='grid grid-cols-4 gap-8'>
        <div className='bg-white p-4 rounded-lg shadow-md'>
          <Card />
        </div>
        <div>
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <CardActuallySale />
          </div>
        </div>
        <div>
          <div className='bg-white p-4 rounded-lg shadow-md'>
            <DonutChartHero />
          </div>
        </div>
      </div>
    </div >
  );
}
