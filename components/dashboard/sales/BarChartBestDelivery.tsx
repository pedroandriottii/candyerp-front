"use client";
import { BarChart } from '@tremor/react';
import { useEffect, useState } from 'react';

const dataFormatter = (number: number) =>
    Intl.NumberFormat('us').format(number).toString();

export function BarChartBestDelivery() {
    const [chartdata, setChartdata] = useState<{ name: string; 'Quantidade Vendida': number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/best-selling-products-delivery`);
                const data = await response.json();

                const formattedData = data.map((item: { name: string; totalQuantitySold: number }) => ({
                    name: item.name,
                    'Quantidade Vendida': item.totalQuantitySold,
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
            <h2 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Produtos mais vendidos em Delivery
            </h2>
            <div className="mt-6">
                <BarChart
                    data={chartdata}
                    index="name"
                    categories={['Quantidade Vendida']}
                    colors={['purple']}
                    valueFormatter={dataFormatter}
                    yAxisWidth={48}
                />
            </div>
        </div>
    );
}
