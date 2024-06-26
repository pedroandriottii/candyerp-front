'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import FormLabel from '@/components/form/FormLabel';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import { formattedDate, formatValue } from '@/utils';
import { FieldTranslations } from '@/interface';

interface ProductDetail {
  fkProductId: number;
  fkDetailId: number;
  fkSaleOrderId: number;
  quantity: number;
  productName?: string;
}

interface SaleOrder {
  id: number;
  date: string;
  total_price: number;
  order_type: string;
  payment_method: string;
  fk_client_id: number;
  fk_nfe_id: number;
  productDetails: ProductDetail[];
}

const Page: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [saleOrder, setSaleOrder] = useState<SaleOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleOrder = async () => {
      const id = pathname.split('/').pop();

      if (id) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders/${id}`);
          const data: SaleOrder = await response.json();

          const productDetailsWithNames = await Promise.all(
            data.productDetails.map(async (detail) => {
              try {
                const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${detail.fkProductId}`);
                const productData = await productResponse.json();
                return { ...detail, productName: productData.name };
              } catch (error) {
                console.error(`Error fetching product data for product ID ${detail.fkProductId}:`, error);
                return detail;
              }
            })
          );

          setSaleOrder({ ...data, productDetails: productDetailsWithNames });
        } catch (error) {
          console.error('Error fetching sale order data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (pathname) {
      fetchSaleOrder();
    }
  }, [pathname]);

  return (
    <div className='p-6 w-full flex flex-col items-center bg-candy-purple min-h-screen'>
      <div className='flex w-full'>
        <FormLabel labelType='detailSales' />
      </div>
      <div className='bg-white rounded-md shadow-md p-6 w-full max-w-md mt-6'>
        {loading ? (
          <p className='text-center text-lg'>Carregando...</p>
        ) : saleOrder ? (
          <div>
            <p className='flex justify-between'>
              <h2 className='text-xl font-bold text-candy-purple mb-4'>Detalhes da Venda</h2>
              <Link href={`/sale/${saleOrder.id}/update`}>
                <span className='text-slate-400'><EditIcon /></span>
              </Link>
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Data: </span>{formattedDate(saleOrder.date)}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Preço Total: </span>R$ {saleOrder.total_price}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Tipo de Pedido: </span>{formatValue('order_type', saleOrder.order_type)}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Método de Pagamento: </span>{formatValue('payment_method', saleOrder.payment_method)}
            </p>
            <h3 className='text-lg font-semibold text-candy-purple mt-4'>Produtos Vendidos:</h3>
            <ul className='list-disc list-inside mt-2'>
              {saleOrder.productDetails.map((detail) => (
                <p key={detail.fkDetailId}>
                  <div className='flex justify-between border p-1 rounded-xl border-slate-500 my-2'>
                    <p>
                      {detail.productName ? detail.productName : 'Produto não encontrado'}
                    </p>
                    <p className='text-slate-500'>
                      Qtd: {detail.quantity}
                    </p>
                  </div>

                </p>
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
