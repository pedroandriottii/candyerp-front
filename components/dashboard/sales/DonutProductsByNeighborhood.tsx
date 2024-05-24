'use client';
import { DonutChart } from '@tremor/react';
import { useEffect, useState } from 'react';

const dataFormatter = (number: number) =>
    `R$ ${Intl.NumberFormat('us').format(number).toString()}`;

interface NeighborhoodData {
    name: string;
    value: number;
}

export const DonutProductsByNeighborhood = () => {
    const [chartData, setChartData] = useState<NeighborhoodData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/products-by-neighborhood`);
                const data = await response.json();

                const formattedData = Object.keys(data).map(key => ({
                    name: key,
                    value: data[key].totalValueSold
                }));

                setChartData(formattedData);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="flex flex-col gap-10 justify-center align-center">
            <span className="text-center block font-mono text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Vendas por Bairro
            </span>
            <DonutChart
                data={chartData}
                variant="donut"
                valueFormatter={dataFormatter}
                onValueChange={(v) => console.log(v)}
            />
        </div>
    );
};
