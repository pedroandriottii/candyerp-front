"use client";
import { BarChart } from '@tremor/react';
import { useEffect, useState } from 'react';

const dataFormatter = (number: number) =>
    Intl.NumberFormat('us').format(number).toString();

export function BarChartLoyalCustomers() {
    const [chartdata, setChartdata] = useState<{ name: string; 'Total de Pedidos': number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/loyal-customers`);
                const data = await response.json();

                const formattedData = data.map((item: { name: string; totalOrders: number }) => ({
                    name: item.name,
                    'Total de Pedidos': item.totalOrders,
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
                Clientes mais fiéis
            </h2>
            <BarChart
                className="mt-6 h-64 w-full"
                data={chartdata}
                index="name"
                categories={['Total de Pedidos']}
                colors={['purple']}
                valueFormatter={dataFormatter}
                yAxisWidth={48}
            />
        </div>
    );
}
