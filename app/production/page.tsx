'use client';
import FormLabel from '@/components/form/FormLabel';
import { ColumnDefinition, DataItem, OnDeleteFunction } from '@/types';
import React, { useState, useEffect } from 'react';

import DynamicTable from '@/components/form/DynamicTable';
import { FormHeader } from '@/components/form/FormHeader';

export default function Production() {
    const [productions, setProductions] = useState<DataItem[]>([]);

    const columns: ColumnDefinition[] = [
        { key: 'start_date', title: 'Data de Início' },
        { key: 'end_date', title: 'Data de Término' },
    ];

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions`)
            .then(response => response.json())
            .then(data => setProductions(data));
    }, []);

    const handleDelete: OnDeleteFunction = async (event, id) => {
        event.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setProductions(prevProductions => prevProductions.filter(productions => productions.id !== id));
        }
    }

    return (
        <div className='p-6 w-full flex flex-col bg-candy-background'>
            <FormLabel labelType="productions" />
            <div className='bg-white rounded-lg p-4 shadow-sm pb-6 mt-8'>
                <FormHeader addHref='production/create' />
                <DynamicTable
                    data={productions}
                    columns={columns}
                    onDelete={handleDelete}
                    basePath='production'
                />
            </div>
        </div>
    );
}
