"use client";

import FormLabel from '@/components/form/FormLabel';
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

  const handleDelete = async (event: React.FormEvent, id: number) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      const response = await fetch(`http://localhost:8080/suppliers/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSuppliers(prevSuppliers => prevSuppliers.filter(supplier => supplier.id !== id));
        alert('Supplier deleted successfully!');
      } else {
        alert('Failed to delete the supplier.');
      }
    }
  };


  return (
    <div className="p-6 w-full flex flex-col bg-candy-background">
      <FormLabel labelType="suppliers" />
      <h1 className="text-xl font-bold">Suppliers List</h1>
      <Link href="/supplier/create">
        <button className="bg-blue-500 text-white p-2 mt-4">Add New Supplier</button>
      </Link>
      <ul>
        {suppliers.map(supplier => (
          <li key={supplier.id} className="mt-2">
            {supplier.name}
            {supplier.cnpj}
            <Link href={`/supplier/${supplier.id}`}>
              <button className="ml-2 text-blue-500">Detail</button>
            </Link>
            <Link href={`/supplier/${supplier.id}/update`}>
              <button className="ml-2 text-blue-500">Update</button>
            </Link>

            <form onSubmit={(event) => handleDelete(event, supplier.id)}>
              <button type='submit' className='text-red-500'>
                delete???
              </button>
            </form>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierPage;