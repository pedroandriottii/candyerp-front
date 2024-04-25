"use client";

import { SupplierProps } from '@/types';
import { useEffect, useState } from 'react';

export default function SupplierDetail({ params }: { params: { id: string } }) {

  const [supplier, setSupplier] = useState<SupplierProps>({} as SupplierProps);

  useEffect(() => {
    if (params.id) {
      fetch(`http://localhost:8080/suppliers/${params.id}`)
        .then(response => response.json())
        .then(data => setSupplier(data));
    }
  }, [params.id]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Supplier Detail</h1>
      <div>Name: {supplier.name}</div>
      <div>CNPJ: {supplier.cnpj}</div>
    </div>
  );
}

