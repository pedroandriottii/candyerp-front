"use client";

import { IngredientProps } from '@/types';
import { useEffect, useState } from 'react';

export default function IngredientDetail({ params }: { params: { id: string } }) {

  const [supplier, setSupplier] = useState<IngredientProps>({} as IngredientProps);

  useEffect(() => {
    if (params.id) {
      fetch(`https://reasonable-amazement-production.up.railway.app/ingredients/${params.id}`)
        .then(response => response.json())
        .then(data => setSupplier(data));
    }
  }, [params.id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supplier Detail</h1>
      <div>Name: {supplier.name}</div>
      <div>Unidade de medida: {supplier.measurement_unit}</div>
      <div>quantity: {supplier.quantity}</div>
    </div>
  );
}

