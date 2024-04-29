'use client';
import FormLabel from '@/components/form/FormLabel';
import { ProductionProps } from '@/types';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';

export default function Production() {
    const [productions, setProductions] = useState<ProductionProps[]>([]);

    useEffect(() => {
        fetch('http://localhost:8080/productions')
            .then(response => response.json())
            .then(data => setProductions(data));
    }, []);

    const handleDelete = async (event: React.FormEvent, id: number) => {
        event.preventDefault();
        const response = await fetch(`http://localhost:8080/productions/${id}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            setProductions(prevproductions => prevproductions.filter(productions => productions.id !== id));
        }
    }

    return (
        <div className='p-6 w-full flex flex-col bg-candy-background'>
            <FormLabel labelType="productions" />
            <div>
                <div>
                    {productions ? productions.map(production => (
                        <tr key={production.id} className="border-b">
                            <td className='p-2' >
                                {String(production.start_date)}
                            </td>
                            <td className='p-2'>
                                {String(production.end_date)}
                            </td>

                            <td className='p-2 flex gap-3'>
                                <Link href={`/production/${production.id}`}>
                                    <button className="text-blue-500"><InfoIcon /></button>
                                </Link>
                                <Link href={`/production/${production.id}/update`}>
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
