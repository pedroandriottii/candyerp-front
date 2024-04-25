"use client";

import { SupplierProps } from '@/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<SupplierProps[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/suppliers')
      .then(response => response.json())
      .then(data => setSuppliers(data));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Suppliers List</h1>
      <ul>
        {suppliers.map(supplier => (
          <li key={supplier.id} className="mt-2">
            {supplier.name}
            {supplier.cnpj}
            <Link href={`/supplier/${supplier.id}`}>
              <button className="ml-2 text-blue-500">Detail</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierPage;