"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="p-4">
      <h1 className="text-xl font-bold">Add New Supplier</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border"
        />
        <label htmlFor="cnpj">CNPJ:</label>
        <input
          id="cnpj"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          required
          className="border"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewSupplier;
