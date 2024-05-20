'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import FormLabel from '@/components/form/FormLabel';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Production {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  products: Product[];
}

interface ProductionProduct {
  fk_Product_id: number;
  fk_Production_id: number;
  quantity: number;
}

const Page: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [production, setProduction] = useState<Production | null>(null);
  const [productionProducts, setProductionProducts] = useState<ProductionProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduction = async () => {
      const id = pathname.split('/').pop();

      if (id) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions/${id}`);
          const data: Production = await response.json();
          setProduction(data);

          const productionProductsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/production-products`);
          const productionProductsData: ProductionProduct[] = await productionProductsResponse.json();
          const filteredProductionProducts = productionProductsData.filter(pp => pp.fk_Production_id === parseInt(id));
          setProductionProducts(filteredProductionProducts);
        } catch (error) {
          console.error('Error fetching production data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (pathname) {
      fetchProduction();
    }
  }, [pathname]);

  return (
    <div className='p-6 w-full flex flex-col items-center bg-candy-purple min-h-screen'>
      <div className='flex w-full'>
        <FormLabel labelType='detailProductions' />
      </div>
      <div className='bg-white rounded-md shadow-md p-6 w-full max-w-md mt-6'>
        {loading ? (
          <p className='text-center text-lg'>Carregando...</p>
        ) : production ? (
          <div>
            <div className='flex justify-between'>
              <h2 className='text-xl font-bold text-candy-purple mb-4'>Detalhes da Produção</h2>
              <Link href={`/production/${production.id}/update`}>
                <span className='text-slate-400'><EditIcon /></span>
              </Link>
            </div>
            <p className='text-lg'>
              <span className='font-semibold'>ID: </span>{production.id}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Nome: </span>{production.name}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Data de Início: </span>{production.start_date}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Data de Término: </span>{production.end_date}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Status: </span>{production.status}
            </p>
            <h3 className='text-lg font-semibold text-candy-purple mt-4'>Produtos:</h3>
            <ul className='list-disc list-inside mt-2'>
              {production.products.map((product) => {
                const productionProduct = productionProducts.find(pp => pp.fk_Product_id === product.id);
                return (
                  <li key={product.id}>
                    {product.name} - Quantidade: {productionProduct ? productionProduct.quantity : 0}
                  </li>
                );
              })}
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
