'use client';

import { LineChart } from '@tremor/react';
import { useState, useEffect } from 'react';

interface ApiResponse {
    year: number;
    month: number;
    totalRevenue: number;
}

interface TransformedData {
    date: string;
    sale: number;
}

const fetchData = async (): Promise<ApiResponse[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/monthly-sales`);
    const data: ApiResponse[] = await response.json();
    return data;
};

const transformData = (data: ApiResponse[]): TransformedData[] => {
    return data.map(item => ({
        date: `${new Date(item.year, item.month - 1).toLocaleString('default', { month: 'short' })} ${item.year.toString().slice(2)}`,
        sale: item.totalRevenue,
    }));
};

const dataFormatter = (number: number) =>
    `$${Intl.NumberFormat('us').format(number).toString()}`;

export default function LineChartHero() {
    const [data, setData] = useState<TransformedData[]>([]);

    useEffect(() => {
        const getData = async () => {
            const apiData = await fetchData();
            const transformedData = transformData(apiData);
            console.log(transformedData);
            setData(transformedData);
        };
        getData();
    }, []);

    return (
        <LineChart
            className="h-80"
            data={data}
            index="date"
            categories={['sale']}
            colors={['cyan']}
            valueFormatter={dataFormatter}
            yAxisWidth={60}
        />
    );
}
