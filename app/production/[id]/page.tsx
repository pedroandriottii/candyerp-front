"use client";

import { ProductionProps } from '@/types';
import { useEffect, useState } from 'react';

export default function ProductionDetail({ params }: { params: { id: string } }) {

  const [production, setProduction] = useState<ProductionProps>({} as ProductionProps);

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions/${params.id}`)
        .then(response => response.json())
        .then(data => setProduction(data));
    }
  }, [params.id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supplier Detail</h1>
      <div>Name: {production.start_date as string}</div>
      <div>Quantidade: {production.end_date as string}</div>
    </div>
  );
}

