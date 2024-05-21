'use client';

import { Card, BadgeDelta } from '@tremor/react';
import { useState, useEffect } from 'react';

interface ApiResponse {
    year: number;
    month: number;
    totalRevenue: number;
}

export default function CardActuallySale() {
    const [currentMonthRevenue, setCurrentMonthRevenue] = useState<number>(0);
    const [previousMonthRevenue, setPreviousMonthRevenue] = useState<number>(0);
    const [percentageChange, setPercentageChange] = useState<number>(0);

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
                    Vendas em {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
                </h4>
            </div>
            <p className="text-tremor-metric text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
                {valueFormatter(currentMonthRevenue)}
            </p>
        </Card>
    );
}
