'use client';
import FormLabel from '@/components/form/FormLabel';
import { ColumnDefinition, DataItem, OnDeleteFunction } from '@/types';
import React, { useState, useEffect } from 'react';


import DynamicTable from '@/components/form/DynamicTable';
import { FormHeader } from '@/components/form/FormHeader';

export default function Client() {
    const [clients, setClients] = useState<DataItem[]>([]);

    const columns: ColumnDefinition[] = [
        { key: 'name', title: 'Nome' },
        { key: 'street', title: 'Endereço' },
        { key: 'number', title: 'Número' },
        { key: 'neighborhood', title: 'Cidade' },
        { key: 'complement', title: 'Complemento' },
    ];

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`)
            .then(response => response.json())
            .then(data => setClients(data));
    }, []);

    const handleDelete: OnDeleteFunction = async (event, id) => {
        event.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setClients(prevClients => prevClients.filter(client => client.id !== id));
        }
    };

    return (
        <div className='p-6 w-full flex flex-col bg-candy-purple max-h-40'>
            <FormLabel labelType="clients" />
            <div className='bg-white rounded-lg p-4 shadow-sm pb-6 mt-8'>
                <FormHeader addHref='client/create' />
                <DynamicTable
                    data={clients}
                    columns={columns}
                    basePath='client'
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
}
