"use client";

import { ClientProps } from '@/types';
import { useEffect, useState } from 'react';

export default function ClientDetail({ params }: { params: { id: string } }) {

  const [client, setClient] = useState<ClientProps>({} as ClientProps);

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}`)
        .then(response => response.json())
        .then(data => setClient(data));
    }
  }, [params.id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Detalhes do Cliente:</h1>
      <div>Nome: {client.name}</div>
      <div>Rua: {client.street}</div>
      <div>Número: {client.number}</div>
      <div>Complemento: {client.neighborhood}</div>
    </div>
  );
}

