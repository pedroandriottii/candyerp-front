'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import FormLabel from '@/components/form/FormLabel';
import EditIcon from '@mui/icons-material/Edit';
import Link from 'next/link';

interface Client {
  id: number;
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      const id = pathname.split('/').pop();

      if (id) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`);
          const data = await response.json();
          setClient(data);
        } catch (error) {
          console.error('Error fetching client data:', error);
        }
      }
    };

    if (pathname) {
      fetchClient();
    }
  }, [pathname]);

  return (
    <div className='p-6 w-full flex flex-col items-center bg-candy-purple min-h-screen'>
      <div className='flex w-full'>
        <FormLabel labelType='detailClients' />
      </div>
      <div className='bg-white rounded-md shadow-md p-6 w-full max-w-md mt-6'>
        {client ? (
          <div>
            <p className='flex justify-between'>
              <h2 className='text-xl font-bold text-candy-purple mb-4'>Detalhes do Cliente</h2>
              <Link href={`/client/${client.id}/update`}>
                <span className='text-slate-400'><EditIcon /></span>
              </Link>
            </p>
            <p className='text-lg'>
              <span className='font-semibold'>Nome: </span>{client.name}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Rua: </span>{client.street}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Número: </span>{client.number}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Bairro: </span>{client.neighborhood}
            </p>
            <p className='text-lg mt-2'>
              <span className='font-semibold'>Complemento: </span>{client.complement}
            </p>
          </div>
        ) : (
          <p className='text-center text-lg'>Carregando...</p>
        )}
      </div>
    </div>
  );
};

export default Page;
