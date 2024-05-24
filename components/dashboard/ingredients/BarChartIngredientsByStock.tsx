'use client';
import { BarChart } from '@tremor/react';
import { useEffect, useState } from 'react';
import { formatValue } from '@/utils';

const dataFormatter = (number: number) =>
    Intl.NumberFormat('us').format(number).toString();

interface Ingredient {
    id: number;
    name: string;
    quantity: number;
    measurementUnit: string;
}

export function BarChartIngredientsByStock() {
    const [chartdata, setChartdata] = useState<Ingredient[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/ingredients-by-stock`);
                const data = await response.json();

                const sortedData = data.sort((a: Ingredient, b: Ingredient) => b.quantity - a.quantity).slice(0, 10);

                const formattedData = sortedData.map((item: Ingredient) => ({
                    name: `${item.name} (${formatValue('measurementUnit', item.measurementUnit)})`,
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
            <h2 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                Ingredientes com Maior Estoque
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
