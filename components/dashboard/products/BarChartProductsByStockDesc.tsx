"use client";
import { BarChart } from '@tremor/react';
import { useEffect, useState } from 'react';

const dataFormatter = (number: number) =>
    Intl.NumberFormat('us').format(number).toString();

export function BarChartProductsByStock() {
    const [chartdata, setChartdata] = useState<{ name: string; 'Quantidade em Estoque': number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/products-by-stock`);
                const data = await response.json();

                const sortedData = data.sort((a: { quantity: number }, b: { quantity: number }) => b.quantity - a.quantity);
                const top10Data = sortedData.slice(0, 10);

                const formattedData = top10Data.map((item: { name: string; quantity: number }) => ({
                    name: item.name,
                    'Quantidade em Estoque': item.quantity,
                }));

                setChartdata(formattedData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h2 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong" >
                Produtos com mais estoque
            </h2>
            <BarChart
                className="mt-6"
                data={chartdata}
                index="name"
                categories={['Quantidade em Estoque']}
                colors={['purple']}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
            />
        </div>
    );
}
