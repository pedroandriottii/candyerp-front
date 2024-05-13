
import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import HomeIcon from '@mui/icons-material/Home';

const createMaps = {
  products: { title: 'Cadastrar novo produto', route: '/product', createRoute: '/product/create', },
  ingredients: { title: 'Cadastrar novo ingrediente', route: '/ingredient', createRoute: '/ingredient/create', },
  updateIngredients:{ title: 'Editar ingrediente', route: '/ingredient/', createRoute: '/ingredient/create', },
  suppliers: {
    title: 'Cadastrar novo fornecedor', route: '/supplier', createRoute: '/supplier / create',
  },
  productions: { title: 'Cadastrar nova produção', route: '/production', createRoute: '/production/create', },
  clients: { title: 'Cadastrar novo cliente', route: '/client', createRoute: '/client/create', },
  sales: { title: 'Cadastrar nova venda', route: '/sale', createRoute: '/sale/create', },
}

interface CreateFormHeaderProps {
  createType: keyof typeof createMaps;
}

export const CreateFormHeader: React.FC<CreateFormHeaderProps> = ({ createType }) => {
  const { title, route, createRoute } = createMaps[createType];
  return (
    <div className='flex flex-col justify-between w-full h-full'>
      <div className='flex w-full justify-between items-center text-center bg-white rounded-md p-4 shadow-sm'>
        <Link href={route} className='flex flex-row items-center align-center justify-center'>
          <button className=" text-candy-purple text-center"><ArrowBackIcon fontSize='medium' /></button>
          Voltar
        </Link>
        <h1 className='uppercase font-bold'>{title}</h1>
        <div className='flex items-center'>
          <Link href="/">
            <HomeIcon />
          </Link>
          <ChevronRightIcon />
          <Link href={`/${route}`}>
            <p className='text-slate-500'>{route}</p>
          </Link>
          <ChevronRightIcon />
          <Link href={createRoute}>
            <p className='text-slate-500'>Criar</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
