"use client";

import { ProductProps } from '@/types';
import { useEffect, useState } from 'react';

export default function ProductDetail({ params }: { params: { id: string } }) {

  const [product, setProduct] = useState<ProductProps>({} as ProductProps);

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`)
        .then(response => response.json())
        .then(data => setProduct(data));
    }
  }, [params.id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supplier Detail</h1>
      <div>Name: {product.name}</div>
      <div>Unidade de medida: {product.quantity}</div>
      <div>quantity: {product.price}</div>
    </div>
  );
}

