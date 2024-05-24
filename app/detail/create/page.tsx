'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormLabel from '@/components/form/FormLabel';

const NewDetail = () => {
  const router = useRouter();

  const [description, setDescription] = useState('');
  const [additionalValue, setAdditionalValue] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/details`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, additional_value: Number(additionalValue) }),
    });

    if (response.ok) {
      router.push('/sale');
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType="createDetails" />
      <form onSubmit={handleSubmit} className='flex flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md'>
        <div>
          <label htmlFor="description">Descrição:</label>
          <input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder='Descrição do Detalhe'
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="additionalValue">Valor Adicional:</label>
          <input
            id="additionalValue"
            value={additionalValue}
            onChange={(e) => setAdditionalValue(e.target.value)}
            required
            type="number"
            step="0.01"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder='0.00'
          />
        </div>
        <button type="submit" className="flex justify-center py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cadastrar
        </button>
      </form>
    </div>
  );
};

export default NewDetail;
