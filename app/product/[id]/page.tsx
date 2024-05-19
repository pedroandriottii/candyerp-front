'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import FormLabel from '@/components/form/FormLabel';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';

interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  cost: number;
  suppliers: string | null;
  measurementUnit: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  ingredients: Ingredient[];
  fk_product_id: number;
}

const Page: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const id = pathname.split('/').pop();

      if (id) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    };

    if (pathname) {
      fetchProduct();
    }
  }, [pathname]);

  return (
    <div className='p-6 w-full flex flex-col items-center bg-candy-purple min-h-screen'>
      <div className='flex w-full'>
        <FormLabel labelType='detailProducts' />
      </div>
      <div className='bg-white rounded-md shadow-md p-6 w-full max-w-md mt-6'>
        {product ? (
          <div>
            <p className='flex justify-between'>
              <h2 className='text-xl font-bold text-candy-purple mb-4'>Detalhes do Produto</h2>
              <Link href={`/product/${product.id}/update`}>
                <span className='text-slate-400'><EditIcon /></span>
              </Link>
            </p>
            <p className='text-lg'>
              <span className='font-semibold'>Nome: </span>{product.name}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Preço: </span>R${product.price}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Quantidade: </span>{product.quantity}
            </p>
            <h3 className='text-lg font-semibold text-candy-purple mt-4'>Ingredientes:</h3>
            <ul className='list-disc list-inside mt-2'>
              {product.ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  Nome: {ingredient.name} - Quantidade: {ingredient.quantity} Unidade: {ingredient.measurementUnit}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className='text-center text-lg'>Carregando...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
