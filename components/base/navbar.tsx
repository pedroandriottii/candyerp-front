'use client';
import { usePathname } from 'next/navigation'

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const Navbar = () => {
  const pathName = usePathname();

  const endpoint = pathName.replace('/', '');

  return (
    <div className=" flex flex-start bg-[#18181B] justify-between items-center align-center w-screen p-4 pr-6 text-white">
      <p className='uppercase font-bold text-candy-purple'>{endpoint}</p>
      <span className='text-candy-purple'><AccountCircleIcon fontSize='large' /></span>
    </div>
  )
}
