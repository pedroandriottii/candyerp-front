'use client';
import { usePathname } from 'next/navigation'

export const Navbar = () => {
  const pathName = usePathname();

  const endpoint = pathName.replace('/', '');

  return (
    <div className=" flex flex-start bg-[#18181B] justify-between items-center align-center w-screen p-4 text-white">
      <p className='uppercase font-bold'>{endpoint}</p>
      <h1>User Icon</h1>
    </div>
  )
}
