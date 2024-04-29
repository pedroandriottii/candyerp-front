"use client";

import { ColumnDefinition, DataItem, OnDeleteFunction } from '@/types';
import React, { useEffect, useState } from 'react';

import { FormHeader } from '@/components/form/FormHeader';
import FormLabel from '@/components/form/FormLabel';

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import DynamicTable from '@/components/form/DynamicTable';

const IngredientPage: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [ingredients, setIngredients] = useState<DataItem[]>([]);

  const columns: ColumnDefinition[] = [
    { key: 'name', title: 'Nome' },
    { key: 'measurement_unit', title: 'Unidade de Medida' },
    { key: 'quantity', title: 'Quantidade' }
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
      setIngredients(prevIngredients => prevIngredients.filter(ingredients => ingredients.id !== id));
    }
  }

  const toggleDetails = (id: number) => {
    setExpandedId(prevId => prevId !== id ? id : null);
  };

  return (
    <div className="p-6 w-full flex flex-col bg-candy-background">
      <FormLabel labelType="ingredients" />
      <div className='bg-white rounded-lg p-4 shadow-sm pb-6 mt-8'>
        <FormHeader addHref="ingredient/create" />
        <DynamicTable
          data={ingredients}
          columns={columns}
          basePath='ingredient'
          onDelete={handleDelete}
        />
        {/* <hr className='my-8' />
        <div className='h-full max-h-[60vh] overflow-auto mb-8'>
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
              {ingredients ? ingredients.map(ingredient => (
                <tr key={ingredient.id} className="border-b">
                  <td className='p-2' onClick={() => toggleDetails(ingredient.id)}>
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className='text-red-500'><DeleteIcon /></button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação não pode ser desfeita.
                            Caso algum produto seja feito com este ingrediente, ele será afetado.
                            Caso algum fornecedor forneça este ingrediente, ele será afetado.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          {/* <form onSubmit={(event) => handleDelete(event, ingredient.id)}>
                            <Button variant="destructive" type='submit'>
                              Remover
                            </Button>
                          </form> */}
        {/* </AlertDialogFooter>
    </AlertDialogContent>
                    </AlertDialog >
                  </td >
                </tr >
              )) : <tr><td colSpan={4}>Carregando...</td></tr>}
            </tbody >
          </table >
        </div > * /} */}
        {/* {expandedId != null && (
          <div>
            {ingredients.filter(ingredient => ingredient.id === expandedId).map(ingredient => (
              <div key={ingredient.id} className='bg-gray-100 p-4 rounded-lg mb-4 text-black'>
                BLABLABLA
                <p><strong>Nome:</strong> {ingredient.name}</p>
                <p><strong>Unidade de Medida:</strong> {ingredient.measurement_unit}</p>
                <p><strong>Quantidade:</strong> {ingredient.quantity}</p>
              </div>
            ))}
          </div>
        )} */}
      </div >
    </div >
  );
};

export default IngredientPage;