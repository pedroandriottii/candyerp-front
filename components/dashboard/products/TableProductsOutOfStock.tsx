"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  quantity: number;
}

interface TableProps {
  totalRows: number;
}

export function TableProductsOutOfStock({ totalRows }: TableProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/products-by-stock`);
        const data: Product[] = await response.json();

        const outOfStockData = data.filter(product => product.quantity === 0);

        setProducts(outOfStockData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const displayedProducts = totalRows === 0 ? products : products.slice(0, totalRows);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
        Produtos fora de estoque
      </h2>
      <table className="min-w-full bg-white rounded-md shadow-md mt-4">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Nome do Produto</th>
            <th className="py-3 px-6 text-left">Estoque</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {displayedProducts.map(product => (
            <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                  <span className="font-medium">{product.name}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">
                  {product.quantity}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalRows > 0 && products.length > totalRows && (
        <div className="mt-4 text-center">
          <Link href="/reports">
            <button
              className="bg-candy-purple text-white py-2 px-4 rounded-md hover:bg-candy-purple-dark transition-colors duration-300"
            >
              Ver todos
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
