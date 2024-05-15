"use client";
import FormLabel from '@/components/form/FormLabel';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


const UpdateSupplier = ({ params }: { params: { id: string } }) => {

  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/${params.id}`)
        .then(response => response.json())
        .then(data => {
          setName(data.name);
          setCnpj(data.cnpj);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, cnpj }),
    });

    if (response.ok) {
      router.push('/supplier');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="h-full w-full bg-candy-purple max-h-40 flex flex-col items-center p-4">
      <FormLabel labelType="updateSuppliers" />
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md'>
          <div>
            <label htmlFor="name" className='block text-sm font-medium text-gray-700'>Nome</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="cnpj" className='block text-sm font-medium text-gray-700'>CNPJ</label>
            <input
              id="cnpj"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button type="submit" className="flex justify-center py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Editar
          </button>
        </div>

      </form>
    </div>

  );
};

export default UpdateSupplier;
