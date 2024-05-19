"use client";

import DynamicTable from '@/components/form/DynamicTable';
import { FormHeader } from '@/components/form/FormHeader';
import FormLabel from '@/components/form/FormLabel';
import { ColumnDefinition, DataItem, OnDeleteFunction } from '@/types';
import React, { useEffect, useState } from 'react';

const SupplierPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<DataItem[]>([]);

  const columns: ColumnDefinition[] = [
    { key: 'name', title: 'Nome' },
    { key: 'cnpj', title: 'CNPJ' },
  ];

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`)
      .then(response => response.json())
      .then(data => setSuppliers(data));
  }, []);

  const handleDelete: OnDeleteFunction = async (event, id) => {
    event.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setSuppliers(prevSuppliers => prevSuppliers.filter(suppliers => suppliers.id !== id));
    }
  }


  return (
    <div className='p-6 w-full flex flex-col bg-candy-purple max-h-40'>
      <FormLabel labelType="suppliers" />
      <div>
        <div className='bg-white rounded-lg p-4 shadow-sm pb-6 mt-8 max-h-[70vh] overflow-auto mb-8'>
          <FormHeader addHref='supplier/create' />
          <DynamicTable
            data={suppliers}
            columns={columns}
            onDelete={handleDelete}
            basePath='supplier'
          />
        </div>
      </div>

    </div>
  );
};

export default SupplierPage;