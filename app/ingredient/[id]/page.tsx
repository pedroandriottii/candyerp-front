"use client";

import { IngredientProps } from '@/types';
import { useEffect, useState } from 'react';

export default function IngredientDetail({ params }: { params: { id: string } }) {

  const [ingredient, setIngredient] = useState<IngredientProps>({} as IngredientProps);

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${params.id}`)
        .then(response => response.json())
        .then(data => setIngredient(data));
    }
  }, [params.id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supplier Detail</h1>
      <div>Name: {ingredient.name}</div>
      <div>Unidade de medida: {ingredient.measurement_unit}</div>
      <div>quantity: {ingredient.quantity}</div>
    </div>
  );
}

