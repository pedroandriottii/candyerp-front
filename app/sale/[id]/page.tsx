"use client";

import { SaleProps } from '@/types';
import { useEffect, useState } from 'react';

export default function SaleDetail({ params }: { params: { id: string } }) {

  const [sale, setSale] = useState<SaleProps>({} as SaleProps);

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders/${params.id}`)
        .then(response => response.json())
        .then(data => setSale(data));
    }
  }, [params.id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Detalhe da venda:</h1>
      <div>Forma de Pagamento: {sale.paymentMethod}</div>
      <div>Tipo de Venda: {sale.orderType}</div>
      <div>Status: {sale.status}</div>
      <div>Valor Total: {sale.total}</div>

    </div>
  );
}

