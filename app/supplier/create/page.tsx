"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreateFormHeader } from '@/components/form/CreateFormHeader';

const NewSupplier = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [cnpj, setCnpj] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, cnpj }),
    });

    if (response.ok) {
      router.push('/supplier');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full h-full bg-candy-purple max-h-40">
      <CreateFormHeader createType="suppliers" />
      <form onSubmit={handleSubmit} className='flex flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md'>
        <div>
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder='Fornecedor de Açucar'
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="cnpj">CNPJ:</label>
          <input
            id="cnpj"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder='00.000.000/0000-00'
          />
        </div>
        <button type="submit" className="flex justify-center py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default NewSupplier;
