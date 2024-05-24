import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Link from 'next/link';

const labelMaps = {
  products: { title: 'Produtos', route: '/' },
  createProducts: { title: 'Cadastrar novo produto', route: '/product' },
  updateProducts: { title: 'Editar produto', route: '/product/' },
  detailProducts: { title: 'Detalhes do produto', route: '/product/' },
  sliceProducts: { title: 'Fatiar produto', route: '/product/' },


  productions: { title: 'Produção', route: '/' },
  createProductions: { title: 'Cadastrar nova produção', route: '/production' },
  updateProductions: { title: 'Editar produção', route: '/production/' },
  detailProductions: { title: 'Detalhes da produção', route: '/production/' },

  ingredients: { title: 'Ingredientes', route: '/' },
  createIngredients: { title: 'Cadastrar novo ingrediente', route: '/ingredient' },
  updateIngredients: { title: 'Editar ingrediente', route: '/ingredient/' },
  detailIngredients: { title: 'Detalhes do ingrediente', route: '/ingredient/' },

  phones: { title: 'Telefones', route: '/' },
  createPhones: { title: 'Cadastrar novo telefone', route: '/client' },
  updatePhones: { title: 'Editar telefone', route: '/phone/' },

  clients: { title: 'Clientes', route: '/' },
  updateClients: { title: 'Editar cliente', route: '/client/' },
  createClients: { title: 'Cadastrar novo cliente', route: '/client' },
  detailClients: { title: 'Detalhes do cliente', route: '/client/' },

  suppliers: { title: 'Fornecedores', route: '/' },
  createSuppliers: { title: 'Cadastrar novo fornecedor', route: '/supplier' },
  updateSuppliers: { title: 'Editar fornecedor', route: '/supplier/' },
  detailSuppliers: { title: 'Detalhes do fornecedor', route: '/supplier/' },

  sales: { title: 'Vendas', route: '/' },
  createSales: { title: 'Cadastrar nova venda', route: '/sale' },
  updateSales: { title: 'Editar venda', route: '/sale/' },
  detailSales: { title: 'Detalhes da venda', route: '/sale/' },

  salesMonth: { title: 'Vendas do mês', route: '/reports' },

  createDetails: { title: 'Cadastrar novo detalhe', route: '/sale' },
  reports: { title: 'Relatórios', route: '/' },
};

interface FormLabelProps {
  labelType: keyof typeof labelMaps;
}

const FormLabel: React.FC<FormLabelProps> = ({ labelType }) => {
  const { title, route } = labelMaps[labelType];
  return (
    <div className='flex items-center w-full h-full bg-white rounded-md p-4 shadow-sm'>
      <Link href={route} className='flex items-center'>
        <button className="text-candy-purple">
          <ArrowBackIcon fontSize='medium' />
        </button>
        <p>Voltar</p>
      </Link>
      <h1 className='flex-1 text-center uppercase font-bold'>{title}</h1>
    </div>
  )
}

export default FormLabel;
