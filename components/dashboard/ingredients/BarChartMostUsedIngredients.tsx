'use client';
import { BarChart } from '@tremor/react';
import { useEffect, useState } from 'react';

const dataFormatter = (number: number, unit: string) =>
    `${Intl.NumberFormat('us').format(number).toString()} ${unit}`;

interface Ingredient {
    id: number;
    name: string;
    totalUsed: number;
    measurementUnit: string;
}

export function BarChartMostUsedIngredients() {
    const [chartdata, setChartdata] = useState<{ name: string; 'Quantidade Usada': string }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/most-used-ingredients`);
                const data = await response.json();

                const formattedData = data.map((item: Ingredient) => ({
                    name: `${item.name} (${item.measurementUnit})`,
                    'Quantidade Usada': item.totalUsed,
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
                Ingredientes Mais Usados
            </h2>
            <BarChart
                className="mt-6"
                data={chartdata}
                index="name"
                categories={['Quantidade Usada']}
                colors={['purple']}
                yAxisWidth={48}
            />
        </div>
    );
}
