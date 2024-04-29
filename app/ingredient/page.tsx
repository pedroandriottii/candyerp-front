"use client";

import { IngredientProps } from '@/types';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

import { FormHeader } from '@/components/form/FormHeader';
import FormLabel from '@/components/form/FormLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const IngredientPage: React.FC = () => {
  const [ingredients, setIngredients] = useState<IngredientProps[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/ingredients')
      .then(response => response.json())
      .then(data => setIngredients(data));
  }, []);

  const handleDelete = async (event: React.FormEvent, id: number) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:8080/ingredients/${id}`, {
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
        <FormHeader />
        <hr className='my-8' />
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
                          <form onSubmit={(event) => handleDelete(event, ingredient.id)}>
                            <Button variant="destructive" type='submit'>
                              Remover
                            </Button>
                          </form>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              )) : <tr><td colSpan={4}>Carregando...</td></tr>}
            </tbody>
          </table>
        </div>
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
      </div>
    </div>
  );
};

export default IngredientPage;