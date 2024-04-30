'use client';
import { ColumnDefinition, DataItem, OnDeleteFunction } from '@/types';
import React, { useState, useEffect } from 'react';

import FormLabel from '@/components/form/FormLabel';
import { FormHeader } from '@/components/form/FormHeader';
import DynamicTable from '@/components/form/DynamicTable';

export default function Production() {
    const [sales, setSales] = useState<DataItem[]>([]);

    const columns: ColumnDefinition[] = [
        { key: 'date', title: 'Data' },
        { key: 'total_price', title: 'Valor Total' },
        { key: 'status', title: 'Status' },
        { key: 'order_type', title: 'Tipo de Venda' },
        { key: 'payment_method', title: 'Método de Pagamento' },
    ];

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders`)
            .then(response => response.json())
            .then(data => setSales(data));
    }, []);

    const handleDelete: OnDeleteFunction = async (event, id) => {
        event.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-order/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setSales(prevSales => prevSales.filter(sales => sales.id !== id));
        }
    }

    return (
        <div className='p-6 w-full flex flex-col bg-candy-background'>
            <FormLabel labelType="sales" />
            <div className='bg-white rounded-lg p-4 shadow-sm pb-6 mt-8'>
                <FormHeader addHref='sale/create' />
                <DynamicTable
                    data={sales}
                    columns={columns}
                    onDelete={handleDelete}
                    basePath='sale'
                />
            </div>
        </div>
    );
}
