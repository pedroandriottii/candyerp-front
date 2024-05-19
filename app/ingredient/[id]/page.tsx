'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import FormLabel from '@/components/form/FormLabel';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';

interface Supplier {
  id: number;
  name: string;
  cnpj: string;
}

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  cost: number;
  suppliers: Supplier[];
  measurementUnit: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [ingredient, setIngredient] = useState<Ingredient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIngredient = async () => {
      const id = pathname.split('/').pop();

      if (id) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`);
          const data: Ingredient = await response.json();
          setIngredient(data);
        } catch (error) {
          console.error('Error fetching ingredient data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (pathname) {
      fetchIngredient();
    }
  }, [pathname]);

  return (
    <div className='p-6 w-full flex flex-col items-center bg-candy-purple min-h-screen'>
      <div className='flex w-full'>
        <FormLabel labelType='detailIngredients' />
      </div>
      <div className='bg-white rounded-md shadow-md p-6 w-full max-w-md mt-6'>
        {loading ? (
          <p className='text-center text-lg'>Carregando...</p>
        ) : ingredient ? (
          <div>
            <p className='flex justify-between'>
              <h2 className='text-xl font-bold text-candy-purple mb-4'>Detalhes do Ingrediente</h2>
              <Link href={`/ingredient/${ingredient.id}/update`}>
                <span className='text-slate-400'><EditIcon /></span>
              </Link>
            </p>
            <p className='text-lg'>
              <span className='font-semibold'>Nome: </span>{ingredient.name}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Quantidade: </span>{ingredient.quantity} {ingredient.measurementUnit}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Custo: </span>R${ingredient.cost}
            </p>
            <h3 className='text-lg font-semibold text-candy-purple mt-4'>Fornecedores:</h3>
            <ul className='list-disc list-inside mt-2'>
              {ingredient.suppliers.map((supplier) => (
                <li key={supplier.id}>
                  {supplier.name} - CNPJ: {supplier.cnpj}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className='text-center text-lg'>Nenhum dado encontrado</p>
        )}
      </div>
    </div>
  );
};

export default Page;
