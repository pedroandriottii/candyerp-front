'use client';
import { FormHeader } from '@/components/form/FormHeader';
import FormLabel from '@/components/form/FormLabel';
import { ProductProps } from '@/types';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

export default function Product() {
    const [products, setProducts] = useState<ProductProps[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/products')
            .then(response => response.json())
            .then(data => setProducts(data));
    }, []);

    const handleDelete = async (event: React.FormEvent, id: number) => {
        event.preventDefault();
        const response = await fetch(`http://localhost:8080/products/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setProducts(prevProducts => prevProducts.filter(products => products.id !== id));
        }
    }

    return (
        <div className='p-6 w-full flex flex-col bg-candy-background'>
            <FormLabel labelType="products" />
            <div>
                <div>
                    {products ? products.map(product => (
                        <tr key={product.id} className="border-b">
                            <td className='p-2' >
                                {product.name}
                            </td>
                            <td className='p-2'>
                                {product.price}
                            </td>
                            <td className='p-2'>
                                {product.quantity}
                            </td>
                            <td className='p-2 flex gap-3'>
                                <Link href={`/product/${product.id}`}>
                                    <button className="text-blue-500"><InfoIcon /></button>
                                </Link>
                                <Link href={`/product/${product.id}/update`}>
                                    <button className="text-blue-500"><EditIcon /></button>
                                </Link>
                            </td>
                        </tr>
                    )) : null}
                </div>
            </div>
        </div>
    );
}
