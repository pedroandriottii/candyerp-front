'use client';
import { FormHeader } from '@/components/form/FormHeader';
import FormLabel from '@/components/form/FormLabel';
import { ColumnDefinition, DataItem, OnDeleteFunction } from '@/types';
import React, { useState, useEffect } from 'react';

import DynamicTable from '@/components/form/DynamicTable';

export default function Product() {
    const [products, setProducts] = useState<DataItem[]>([]);

    const columns: ColumnDefinition[] = [
        { key: 'name', title: 'Nome' },
        { key: 'price', title: 'Preço' },
        { key: 'quantity', title: 'Quantidade' },
    ];

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
            .then(response => response.json())
            .then(data => setProducts(data));
    }, []);

    const handleDelete: OnDeleteFunction = async (event, id) => {
        event.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setProducts(prevProducts => prevProducts.filter(products => products.id !== id));
        }
    }

    return (
        <div className='p-6 w-full flex flex-col bg-candy-purple max-h-40'>
            <FormLabel labelType="products" />
            <div>
                <div className='bg-white rounded-lg p-4 shadow-sm pb-6 mt-8 max-h-[70vh] overflow-auto mb-8'>
                    <FormHeader addHref='product/create' />
                    <DynamicTable
                        data={products}
                        columns={columns}
                        onDelete={handleDelete}
                        basePath='product'
                    />
                </div>
            </div>

        </div>
    );
}
