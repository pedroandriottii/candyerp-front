'use client';

import { Card, ProgressBar } from '@tremor/react';
import { useState, useEffect } from 'react';

interface ApiResponse {
    year: number;
    month: number;
    totalRevenue: number;
}

export default function Example() {
    const [totalRevenue, setTotalRevenue] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/monthly-sales`);
            const data: ApiResponse[] = await response.json();
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
        <Card className="mx-auto max-w-md">
            <h4 className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                Total de Vendas
            </h4>
            <p className="text-tremor-metric font-semibold text-tremor-content-strong dark:text-dark-tremor-content-strong">
                {valueFormatter(totalRevenue)}
            </p>
        </Card>
    );
}
