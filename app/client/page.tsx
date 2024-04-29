'use client';
import FormLabel from '@/components/form/FormLabel';
import { ClientProps } from '@/types';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

export default function Client() {
    const [clients, setClients] = useState<ClientProps[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`)
            .then(response => response.json())
            .then(data => setClients(data));
    }, []);

    const handleDelete = async (event: React.FormEvent, id: number) => {
        event.preventDefault();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setClients(prevClients => prevClients.filter(clients => clients.id !== id));
        }
    }

    return (
        <div className='p-6 w-full flex flex-col bg-candy-background'>
            <FormLabel labelType="clients" />
            <div>
                <div>
                    {clients ? clients.map(client => (
                        <tr key={client.id} className="border-b">
                            <td className='p-2' >
                                {client.name}
                            </td>
                            <td className='p-2'>
                                {client.street}
                            </td>
                            <td className='p-2'>
                                {client.number}
                            </td>
                            <td className='p-2'>
                                {client.neighborhood}
                            </td>
                            <td className='p-2'>
                                {client.complement}
                            </td>
                            <td className='p-2 flex gap-3'>
                                <Link href={`/client/${client.id}`}>
                                    <button className="text-blue-500"><InfoIcon /></button>
                                </Link>
                                <Link href={`/client/${client.id}/update`}>
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
