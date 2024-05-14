import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';
import Link from 'next/link';

interface FormHeaderProps {
  addHref: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ addHref }) => {
  return (
    <div className='flex justify-between pb-4'>
      <form action="" className='relative'>
        <input type="text" placeholder="Pesquisar" className="border border-slate-500 rounded-md p-2 bg-slate-100 focus:border-candy-purple focus:outline-none"></input>
        <button type="submit" className="absolute right-2 top-2 text-slate-500"><SearchIcon /></button>
      </form>
      <Link href={addHref}>
        <button className="text-candy-purple"><AddCircleIcon fontSize='large' /></button>
      </Link>
    </div>
  )
}
