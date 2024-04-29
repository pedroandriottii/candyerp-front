'use client';
import FormLabel from '@/components/form/FormLabel';
import { SaleProps } from '@/types';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

export default function Production() {
    const [sales, setSales] = useState<SaleProps[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/sale-orders')
            .then(response => response.json())
            .then(data => setSales(data));
    }, []);

    const handleDelete = async (event: React.FormEvent, id: number) => {
        event.preventDefault();
        const response = await fetch(`http://localhost:8080/sale-orders/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setSales(prevsales => prevsales.filter(sales => sales.id !== id));
        }
    }

    return (
        <div className='p-6 w-full flex flex-col bg-candy-background'>
            <FormLabel labelType="sales" />
            <div>
                <div>
                    {sales ? sales.map(sale => (
                        <tr key={sale.id} className="border-b">
                            <td className='p-2' >
                                {String(sale.total)}
                            </td>
                            <td className='p-2'>
                                {String(sale.status)}
                            </td>
                            <td className='p-2'>
                                {String(sale.orderType)}
                            </td>
                            <td className='p-2'>
                                {String(sale.paymentMethod)}
                            </td>

                            <td className='p-2 flex gap-3'>
                                <Link href={`/sale-order/${sale.id}`}>
                                    <button className="text-blue-500"><InfoIcon /></button>
                                </Link>
                                <Link href={`/sale-order/${sale.id}/update`}>
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
