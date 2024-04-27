"use client";

import { IngredientProps } from '@/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { FormHeader } from '@/components/form/FormHeader';
import { FormLabel } from '@/components/form/FormLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';


const IngredientPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<IngredientProps[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/ingredients')
      .then(response => response.json())
      .then(data => setIngredients(data));
  }, []);

  const handleDelete = async (event: React.FormEvent, id: number) => {
    event.preventDefault();
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      const response = await fetch(`http://localhost:8080/ingredients/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setIngredients(prevIngredients => prevIngredients.filter(ingredients => ingredients.id !== id));
        alert('ingredient deleted successfully!');
      } else {
        alert('Failed to delete the ingredient.');
      }
    }
  };


  return (
    <div className="p-6 w-full flex flex-col bg-[#EEF2F6]">
      <FormLabel />
      <div className='bg-white rounded-lg p-4 shadow-sm pb-6 mt-8'>
        <FormHeader />
        <hr className='my-4' />
        <table className='w-full'>
          <thead>
            <tr className='text-left'>
              <th className='font-bold p-2'>Nome</th>
              <th className='font-bold p-2'>Unidade de Medida</th>
              <th className='font-bold p-2'>Quantidade</th>
              <th className='font-bold p-2'>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map(ingredient => (
              <tr key={ingredient.id} className="border-b">
                <td className='p-2'>
                  {ingredient.name}
                </td>
                <td className='p-2'>
                  {ingredient.measurement_unit}
                </td>
                <td className='p-2'>
                  {ingredient.quantity}
                </td>
                <td className='p-2 flex gap-3'>
                  <Link href={`/ingredient/${ingredient.id}`}>
                    <button className="text-blue-500"><InfoIcon /></button>
                  </Link>
                  <Link href={`/ingredient/${ingredient.id}/update`}>
                    <button className="text-blue-500"><EditIcon /></button>
                  </Link>
                  <form onSubmit={(event) => handleDelete(event, ingredient.id)}>
                    <button type='submit' className='text-red-500'>
                      <DeleteIcon />
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientPage;