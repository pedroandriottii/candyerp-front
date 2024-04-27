import HomeIcon from '@mui/icons-material/Home';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Link from 'next/link';

export const FormLabel = () => {
  return (
    <div className='flex w-full justify-between items-center text-center bg-white rounded-md p-4 shadow-sm' >
      <h1 className="text-xl font-bold ">Ingredients List</h1>
      <div className='flex items-center'>
        <Link href="/">
          <HomeIcon />
        </Link>
        <ChevronRightIcon />
        <Link href="/ingredients">
          <p className='text-slate-500'>Ingredientes</p>
        </Link>
      </div>
    </div>
  )
}
