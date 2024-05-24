'use client';

import { BadgeDelta, Card, ProgressBar } from '@tremor/react';
import { useState, useEffect } from 'react';

export default function CardSales() {
    const [totalSales, setTotalSales] = useState<number>(0);
    const [monthlySales, setMonthlySales] = useState<number>(0);
    const [monthlySalesChange, setMonthlySalesChange] = useState<number>(0);
    const annualTarget = 120000 / 12;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/monthly-sales`);
                const data = await response.json();

                const today = new Date();
                const currentMonthSales = data.find((item: { year: number, month: number }) =>
                    item.year === today.getFullYear() && item.month === today.getMonth() + 1
                );
                const previousMonthSales = data.find((item: { year: number, month: number }) =>
                    item.year === today.getFullYear() && item.month === today.getMonth()
                );

                setMonthlySales(currentMonthSales ? currentMonthSales.totalRevenue : 0);
                const total = data.reduce((sum: number, item: { totalRevenue: number }) => sum + item.totalRevenue, 0);
                setTotalSales(total);

                if (currentMonthSales && previousMonthSales) {
                    const change = ((currentMonthSales.totalRevenue - previousMonthSales.totalRevenue) / previousMonthSales.totalRevenue) * 100;
                    setMonthlySalesChange(change);
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        fetchData();
    }, []);

    const valueFormatter = (number: number) => {
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        return formatter.format(number);
    };

    const percentageOfAnnualTarget = ((monthlySales / annualTarget) * 100).toFixed(2);

    return (
        <Card className="mx-auto max-w-md">
            <div className='flex justify-between'>
                <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Faturamento em {new Date().toLocaleString('pt-BR', { month: 'long' })}
                </h4>
                <BadgeDelta
                    deltaType={monthlySalesChange >= 0 ? "increase" : "decrease"}
                    isIncreasePositive={true}
                    size="xs"
                >
                    {monthlySalesChange >= 0 ? "+" : ""}{monthlySalesChange.toFixed(2)}%
                </BadgeDelta>
            </div>
            <p className="text-tremor-metric font-semibold text-candy-purple dark:text-dark-candy-purple">
                {valueFormatter(monthlySales)}
            </p>
            <p className="mt-4 flex items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                <span>{percentageOfAnnualTarget}% da meta no mês</span>
                <span>{valueFormatter(annualTarget)}</span>
            </p>
            <ProgressBar value={parseFloat(percentageOfAnnualTarget)} className="mt-2" />
        </Card>
    );
}
