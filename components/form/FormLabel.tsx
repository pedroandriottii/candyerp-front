import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link';

const labelMaps = {
  products: { title: 'Produtos', label: 'Produtos', route: '/product' },
  productions: { title: 'Produção', label: 'Produções', route: '/production' },
  ingredients: { title: 'Ingredientes', label: 'Ingredientes', route: '/ingredient' },
  phones: { title: 'Telefones', label: 'Telefones', route: '/phone' },
  clients: { title: 'Clientes', label: 'Clientes', route: '/client' },
  suppliers: { title: 'Fornecedores', label: 'Fornecedores', route: '/supplier' },
  sales: { title: 'Vendas', label: 'Vendas', route: '/sale' },
  lastSales: { title: 'Últimas Vendas', label: 'Últimas Vendas', route: '/sale' },
  lastProductions: { title: 'Últimas Produções', label: 'Últimas Produções', route: '/production' },
};

interface FormLabelProps {
  labelType: keyof typeof labelMaps;
}

const FormLabel: React.FC<FormLabelProps> = ({ labelType }) => {
  const { title, label, route } = labelMaps[labelType];
  return (
    <div className='flex w-full justify-between items-center text-center bg-white rounded-md p-4 shadow-sm' >
      <h1 className="text-xl font-bold ">{title}</h1>
      <div className='flex items-center'>
        <Link href="/">
          <HomeIcon />
        </Link>
        <ChevronRightIcon />
        <Link href={route}>
          <p className='text-slate-500'>{label}</p>
        </Link>
      </div>
    </div>
  )
}

export default FormLabel;
