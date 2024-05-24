'use client';

import { Card, ProgressBar } from '@tremor/react';
import { useState, useEffect } from 'react';

interface ApiResponse {
    year: number;
    month: number;
    totalRevenue: number;
}

export default function CardActuallySale() {
    const [currentMonthRevenue, setCurrentMonthRevenue] = useState<number>(0);
    const [totalRevenue, setTotalRevenue] = useState<number>(0);
    const [percentageChange, setPercentageChange] = useState<number>(0);
    const annualTarget = 120000;

    const percentageOfAnnualTarget = ((totalRevenue / annualTarget) * 100).toFixed(2);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/monthly-sales`);
            const data: ApiResponse[] = await response.json();

            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();

            const currentData = data.find(item => item.month === currentMonth && item.year === currentYear);
            const previousData = data.find(item => item.month === (currentMonth - 1) && item.year === currentYear);

            if (currentData) {
                setCurrentMonthRevenue(currentData.totalRevenue);
            }

            if (currentData && previousData) {
                const change = ((currentData.totalRevenue - previousData.totalRevenue) / previousData.totalRevenue) * 100;
                setPercentageChange(change);
            } else if (currentData && !previousData) {
                setPercentageChange(100);
            }

            const total = data.reduce((sum, item) => sum + item.totalRevenue, 0);
            setTotalRevenue(total);
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

    return (
        <Card className="mx-auto max-w-sm">
            <div className="flex items-center justify-between">
                <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                    Vendas em {new Date().getFullYear()}
                </h4>
            </div>
            <p className="text-tremor-metric text-candy-purple dark:text-dark-candy-purple font-semibold">
                {valueFormatter(totalRevenue)}
            </p>
            <p className="mt-4 flex items-center justify-between text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                <span>{percentageOfAnnualTarget}% da meta no ano</span>
                <span>{valueFormatter(annualTarget)}</span>
            </p>
            <ProgressBar value={parseFloat(percentageOfAnnualTarget)} className="mt-2" />
        </Card>
    );
}
