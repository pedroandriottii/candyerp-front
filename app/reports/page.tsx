"use client";
import { useState } from 'react';
import { BarChartBestBalcony } from "@/components/dashboard/sales/BarChartBestBalcony";
import { BarChartBestDelivery } from "@/components/dashboard/sales/BarChartBestDelivery";
import { BarChartProductsSeller } from "@/components/dashboard/sales/BarChartProductsSeller";
import CardActuallySale from "@/components/dashboard/sales/CardActuallySale";
import CardSales from "@/components/dashboard/sales/CardSales";
import FormLabel from "@/components/form/FormLabel";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { BarChartMostProduced } from '@/components/dashboard/productions/BarChartMostProduced';
import { BarChartProductsByStock } from '@/components/dashboard/products/BarChartProductsByStockDesc';
import { TableProductsOutOfStock } from '@/components/dashboard/products/TableProductsOutOfStock';
import { BarChartLoyalCustomers } from '@/components/dashboard/clients/BarChartLoyalCustomers';

export default function Reports() {
  const [showSales, setShowSales] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [showProduction, setShowProduction] = useState(false);
  const [showClients, setShowClients] = useState(false);
  const [showIngredients, setShowIngredients] = useState(false);

  const toggleSection = (section: string) => {
    switch (section) {
      case 'sales':
        setShowSales(!showSales);
        break;
      case 'products':
        setShowProducts(!showProducts);
        break;
      case 'production':
        setShowProduction(!showProduction);
        break;
      case 'clients':
        setShowClients(!showClients);
        break;
      case 'ingredients':
        setShowIngredients(!showIngredients);
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-full p-6 flex flex-col gap-4 overflow-auto">
      <FormLabel labelType="reports" />
      <div className="flex flex-col gap-6">
        <div className="bg-candy-purple text-white p-4 rounded-xl">
          <div onClick={() => toggleSection('sales')} className="flex justify-between items-center cursor-pointer">
            <h1 className="uppercase font-bold text-center pb-3">Vendas</h1>
            <button onClick={() => toggleSection('sales')} className="text-white">
              {showSales ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          <hr className="border-t border-white opacity-50" />
          {showSales && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 p-4">
                <CardSales />
                <CardActuallySale />
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className="bg-white p-4 rounded-2xl">
                  <BarChartProductsSeller /> {/* This should be changed to PRODUCTS BY NEIGHBORHOOD */}
                </div>
                <div className="bg-white p-4 rounded-2xl">
                  <BarChartProductsSeller />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className="bg-white p-4 rounded-2xl">
                  <BarChartBestDelivery />
                </div>
                <div className="bg-white p-4 rounded-2xl">
                  <BarChartBestBalcony />
                </div>
              </div>
              <div className="bg-white p-4 rounded-2xl">
                <BarChartProductsSeller /> {/* This should be changed to PRODUCTS BY PAYMENT METHOD */}
              </div>

            </div>
          )}
        </div>
        <div className="bg-candy-purple text-white p-4 rounded-xl">
          <div onClick={() => toggleSection('products')} className="flex justify-between items-center cursor-pointer">
            <h1 className="uppercase font-bold text-center pb-3">Produtos</h1>
            <button onClick={() => toggleSection('products')} className="text-white">
              {showProducts ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          <hr className="border-t border-white opacity-50" />
          {showProducts && (
            <div className='flex flex-col gap-4 m-2'>
              <div className='bg-white p-4 rounded-2xl'>
                <BarChartProductsByStock />
              </div>
              <div className='bg-white p-4 rounded-2xl' id='table'>
                <TableProductsOutOfStock totalRows={0} />
              </div>
            </div>
          )}
        </div>
        <div className="bg-candy-purple text-white p-4 rounded-xl">
          <div onClick={() => toggleSection('production')} className="flex justify-between items-center cursor-pointer">
            <h1 className="uppercase font-bold text-center pb-3">Produção</h1>
            <button onClick={() => toggleSection('production')} className="text-white">
              {showProduction ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          <hr className="border-t border-white opacity-50" />
          {showProduction && (
            <div className='flex flex-col gap-4 m-2'>
              <div className='bg-white p-4 rounded-2xl'>
                <BarChartMostProduced />
              </div>
            </div>
          )}
        </div>
        <div className="bg-candy-purple text-white p-4 rounded-xl">
          <div onClick={() => toggleSection('clients')} className="flex justify-between items-center cursor-pointer">
            <h1 className="uppercase font-bold text-center pb-3">Clientes</h1>
            <button onClick={() => toggleSection('clients')} className="text-white">
              {showClients ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          <hr className="border-t border-white opacity-50" />
          {showClients && (
            <div className='flex flex-col gap-4 m-2'>
              <div className='bg-white p-4 rounded-2xl'>
                <BarChartLoyalCustomers />
              </div>
            </div>
          )}
        </div>
        <div className="bg-candy-purple text-white p-4 rounded-xl">
          <div onClick={() => toggleSection('ingredients')} className="flex justify-between items-center cursor-pointer">
            <h1 className="uppercase font-bold text-center pb-3">Ingredientes</h1>
            <button onClick={() => toggleSection('ingredients')} className="text-white">
              {showIngredients ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </button>
          </div>
          <hr className="border-t border-white opacity-50" />
          {showIngredients && (
            <div className='flex flex-col gap-4 m-2'>
              <div className='bg-white p-4 rounded-2xl'>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
