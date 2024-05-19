import AddCircleIcon from '@mui/icons-material/AddCircle';
import Link from 'next/link';

interface FormHeaderProps {
  addHref: string;
}

export const FormHeader: React.FC<FormHeaderProps> = ({ addHref }) => {
  return (
    <div className='flex  justify-end pb-4'>
      <Link href={addHref}>
        <button className="text-candy-purple"><AddCircleIcon fontSize='large' /></button>
      </Link>
    </div>
  )
}
