"use client";
import { BarChart } from '@tremor/react';
import { useEffect, useState } from 'react';

const dataFormatter = (number: number) =>
    Intl.NumberFormat('us').format(number).toString();

export function BarChartMostProduced() {
    const [chartdata, setChartdata] = useState<{ name: string; 'Quantidade Produzida': number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/most-produced-products`);
                const data = await response.json();

                const formattedData = data.map((item: { name: string; totalQuantityProduced: number }) => ({
                    name: item.name,
                    'Quantidade Produzida': item.totalQuantityProduced,
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
                Produtos mais produzidos
            </h2>
            < BarChart
                className="mt-6"
                data={chartdata}
                index="name"
                categories={['Quantidade Produzida']}
                colors={['purple']}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
            />
        </div>
    );
}
