'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormLabel from '@/components/form/FormLabel';
interface SaleOrder {
  id: number;
  date: string;
  total_price: number;
  order_type: string;
  payment_method: string;
  fk_client_id: number;
  fk_nfe_id: number;
  productDetails: any[];
}

const SalesList = () => {
  const [sales, setSales] = useState<SaleOrder[]>([]);
  const [totalSalesValue, setTotalSalesValue] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders`);
        const data: SaleOrder[] = await response.json();

        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();

        const filteredSales = data.filter(sale => {
          const saleDate = new Date(sale.date);
          return saleDate.getMonth() + 1 === currentMonth && saleDate.getFullYear() === currentYear;
        });

        setSales(filteredSales);

        const totalValue = filteredSales.reduce((total, sale) => total + sale.total_price, 0);
        setTotalSalesValue(totalValue);
      } catch (error) {
        console.error("Failed to fetch sales data", error);
      }
    };

    fetchSales();
  }, []);

  const handleSaleClick = (id: number) => {
    router.push(`/sale/${id}`);
  };

  const valueFormatter = (number: number) => {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return formatter.format(number);
  };

  return (
    <div className="flex items-center flex-col p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType='salesMonth' />
      <h2 className="text-xl text-center font-semibold m-4 bg-white text-candy-purple p-2 max-w-[10vw] rounded-xl">{valueFormatter(totalSalesValue)}</h2>
      <div className="bg-white shadow-md rounded-lg p-4 w-full">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Data</th>
              <th className="py-2">Valor Total</th>
              <th className="py-2">Tipo</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id} className="cursor-pointer hover:bg-slate-200" onClick={() => handleSaleClick(sale.id)}>
                <td className="py-2">{new Date(sale.date).toLocaleDateString('pt-BR')}</td>
                <td className="py-2">{valueFormatter(sale.total_price)}</td>
                <td className="py-2">{sale.order_type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesList;
