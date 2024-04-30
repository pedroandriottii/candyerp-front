"use client";

import { ColumnDefinition, DataItem, OnDeleteFunction } from '@/types';
import React, { useEffect, useState } from 'react';

import { FormHeader } from '@/components/form/FormHeader';
import FormLabel from '@/components/form/FormLabel';

import DynamicTable from '@/components/form/DynamicTable';

const IngredientPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [ingredients, setIngredients] = useState<DataItem[]>([]);

  const columns: ColumnDefinition[] = [
    { key: 'name', title: 'Nome' },
    { key: 'measurement_unit', title: 'Unidade de Medida' },
    { key: 'quantity', title: 'Quantidade' },
    { key: 'cost', title: 'Custo' },
  ];


  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`)
      .then(response => response.json())
      .then(data => setIngredients(data));
  }, []);

  const handleDelete: OnDeleteFunction = async (event, id) => {
    event.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.id !== id));
    }
  };


  const toggleDetails = (id: number) => {
    setExpandedId(prevId => prevId !== id ? id : null);
  };

  return (
    <div className="p-6 w-full flex flex-col bg-candy-background">
      <FormLabel labelType="ingredients" />
      <div className='bg-white rounded-lg p-4 shadow-sm pb-6 mt-8 h-full max-h-[70vh] overflow-auto mb-8'>
        <FormHeader addHref="ingredient/create" />
        <DynamicTable
          data={ingredients}
          columns={columns}
          basePath='ingredient'
          onDelete={handleDelete}
        />
      </div >
    </div >
  );
};

export default IngredientPage;