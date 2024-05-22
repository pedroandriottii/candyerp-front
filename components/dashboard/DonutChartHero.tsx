"use client";
import { DonutChart } from '@tremor/react';
import { useEffect, useState } from 'react';

const dataFormatter = (number: number) =>
  `$ ${Intl.NumberFormat('us').format(number).toString()}`;

export const DonutChartHero = () => {
  const [datahero, setDatahero] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/best-selling-products`);
        const data = await response.json();

        const formattedData = data.map((item: { name: string; totalQuantitySold: number }) => ({
          name: item.name,
          value: item.totalQuantitySold,
        }));

        setDatahero(formattedData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mx-auto space-y-12">
      <div className="space-y-3">
        <span className="text-center block font-mono text-tremor-default text-tremor-content dark:text-dark-tremor-content">
          Donut Variant 1
        </span>
        <div className="flex justify-center">
          <DonutChart
            data={datahero}
            variant="donut"
            onValueChange={(v) => console.log(v)}
          />
        </div>
      </div>
    </div>
  );
};
