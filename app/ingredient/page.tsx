"use client";

import { IngredientProps } from '@/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

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
    <div className="p-4 flex flex-col">
      <h1 className="text-xl font-bold">Ingredients List</h1>
      <Link href="/ingredient/create">
        <button className="bg-blue-500 text-white p-2 mt-4">Add New Ingredient</button>
      </Link>
      <ul>
        {ingredients.map(ingredient => (
          <li key={ingredient.id} className="mt-2">
            {ingredient.name}
            {ingredient.measurement_unit}
            {ingredient.quantity}
            <Link href={`/ingredient/${ingredient.id}`}>
              <button className="ml-2 text-blue-500">Detail</button>
            </Link>
            <Link href={`/ingredient/${ingredient.id}/update`}>
              <button className="ml-2 text-blue-500">Update</button>
            </Link>

            <form onSubmit={(event) => handleDelete(event, ingredient.id)}>
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

export default IngredientPage;