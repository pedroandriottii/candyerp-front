'use client';
import { DonutChart } from '@tremor/react';
import { useEffect, useState } from 'react';
import { formatValue } from '@/utils';

const dataFormatter = (number: number) =>
    `R$ ${Intl.NumberFormat('us').format(number).toString()}`;

interface PaymentMethodData {
    name: string;
    value: number;
}

export const DonutSellByPaymentMethod = () => {
    const [chartData, setChartData] = useState<PaymentMethodData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/products-by-payment-method`);
                const data = await response.json();

                const formattedData = Object.keys(data).map(key => ({
                    name: formatValue('payment_method', key),
                    value: data[key]
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
                Vendas por Método de Pagamento
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
