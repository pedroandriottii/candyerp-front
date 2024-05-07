'use client';
import { usePathname } from 'next/navigation'

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

export const Navbar = () => {
  const pathName = usePathname();
  const endpoint = pathName.replace('/', '');

  return (
    <div className="flex flex-start bg-[#18181B] justify-between items-center align-center w-screen p-4 pr-6 text-white">
      <p className="uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-900 hidden lg:flex">{endpoint}</p>
      <p className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-900">O melhor ERP para o seu negócio.</p>
      <div className='flex gap-4'>
        <span className='text-candy-purple'><AccountCircleIcon fontSize='medium' /></span>
        <span className='text-candy-purple'><LogoutIcon fontSize='medium' /></span>
      </div>
    </div>
  )
}
