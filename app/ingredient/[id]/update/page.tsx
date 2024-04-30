"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


const UpdateIngredient = ({ params }: { params: { id: string } }) => {

  const [name, setName] = useState('');
  const [measurement_unit, setMeasurementUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${params.id}`)
        .then(response => response.json())
        .then(data => {
          setName(data.name);
          setMeasurementUnit(data.measurement_unit);
          setQuantity(data.quantity);
          setLoading(false);
        });
    }
  }, [params.id]);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, measurement_unit, quantity, cost }),
    });

    if (response.ok) {
      router.push('/ingredient');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Update Ingredient</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border"
        />
        <label htmlFor="measurement_unit">Measurement Unit:</label>
        <input
          id="measurement_unit"
          value={measurement_unit}
          onChange={(e) => setMeasurementUnit(e.target.value)}
          required
          className="border"
        />
        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          className="border"
        />
        <label htmlFor="cost">Custo:</label>
        <input
          id="cost"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
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

export default UpdateIngredient;
