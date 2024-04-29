"use client";
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
    <div className="p-4">
      <h1 className="text-xl font-bold">Update Supplier</h1>
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
          Update
        </button>
      </form>
    </div>
  );
};

export default UpdateSupplier;
