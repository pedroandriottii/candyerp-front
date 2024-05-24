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
}

interface IngredientSupplier {
  fkIngredientId: number;
  fkSupplierId: number;
}

const Page: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  useEffect(() => {
    const fetchSupplier = async () => {
      const id = pathname.split('/').pop();

      if (id) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/${id}`);
          const data: Supplier = await response.json();
          setSupplier(data);
        } catch (error) {
          console.error('Error fetching supplier data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    const fetchIngredients = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient-suppliers`);
        const data: IngredientSupplier[] = await response.json();

        const supplierId = pathname.split('/').pop();

        if (supplierId) {
          const ingredientIds = data.filter(item => item.fkSupplierId === parseInt(supplierId)).map(item => item.fkIngredientId);
          const ingredientPromises = ingredientIds.map(id =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${id}`).then(res => res.json())
          );
          const ingredientsData = await Promise.all(ingredientPromises);
          setIngredients(ingredientsData);
        }
      } catch (error) {
        console.error('Error fetching ingredients data:', error);
      } finally {
        setLoadingIngredients(false);
      }
    };

    if (pathname) {
      fetchSupplier();
      fetchIngredients();
    }
  }, [pathname]);

  return (
    <div className='p-6 w-full flex flex-col items-center bg-candy-purple min-h-screen'>
      <div className='flex w-full'>
        <FormLabel labelType='detailSuppliers' />
      </div>
      <div className='bg-white rounded-md shadow-md p-6 w-full max-w-md mt-6'>
        {loading ? (
          <p className='text-center text-lg'>Carregando...</p>
        ) : supplier ? (
          <div>
            <p className='flex justify-between'>
              <h2 className='text-xl font-bold text-candy-purple mb-4'>Detalhes do Fornecedor</h2>
              <Link href={`/supplier/${supplier.id}/update`}>
                <span className='text-slate-400'><EditIcon /></span>
              </Link>
            </p>
            <p className='text-lg'>
              <span className='font-semibold'>Nome: </span>{supplier.name}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>CNPJ: </span>{supplier.cnpj}
            </p>
            <div className='mt-4'>
              <h3 className='text-lg font-bold text-candy-purple'>Ingredientes Fornecidos</h3>
              {loadingIngredients ? (
                <p className='text-center text-lg'>Carregando ingredientes...</p>
              ) : ingredients.length > 0 ? (
                <div className=''>
                  {ingredients.map(ingredient => (
                    <p key={ingredient.id} className='border rounded-lg border-slate-400 p-1 my-2'>
                      {ingredient.name}
                    </p>
                  ))}
                </div>
              ) : (
                <p className='text-center text-lg'>Nenhum ingrediente encontrado</p>
              )}
            </div>
          </div>
        ) : (
          <p className='text-center text-lg'>Nenhum dado encontrado</p>
        )}
      </div>
    </div>
  );
};

export default Page;
