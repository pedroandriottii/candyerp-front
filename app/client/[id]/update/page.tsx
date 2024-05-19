"use client";

import FormLabel from "@/components/form/FormLabel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UpdateClient = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}`)
      .then(response => response.json())
      .then(data => {
        setName(data.name);
        setStreet(data.street);
        setNumber(data.number);
        setNeighborhood(data.neighborhood);
        setComplement(data.complement);
        setIsLoading(false);
      });
  }, [params.id]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, street, number, neighborhood, complement }),
    });

    if (response.ok) {
      router.push('/client');
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType="updateClients" />
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className='flex flex-1 flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md'>
          <div>
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='João da Silva'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="street">Rua:</label>
            <input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              placeholder='Rua das Flores'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="number">Número:</label>
            <input
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              placeholder='123'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="neighborhood">Bairro:</label>
            <input
              id="neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
              placeholder='Centro'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="complement">Complemento:</label>
            <input
              id="complement"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder='Clube'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button type="submit" className="flex justify-center py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Editar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateClient;