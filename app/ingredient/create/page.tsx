"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SupplierProps } from '@/types';
import { CreateFormHeader } from '@/components/form/CreateFormHeader';



const NewIngredient = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');

  const [supplier, setSupplier] = useState<SupplierProps[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`)
      .then(response => response.json())
      .then(data => {
        setSupplier(data);
        setSelectedSupplierId(data[0].id.toString());
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, measurementUnit, quantity, cost }),
    });

    if (response.ok) {
      const ingredient = await response.json();
      const ingredientId: number = ingredient.id;

      console.log(ingredientId)
      console.log(selectedSupplierId)

      const relationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient-suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fk_Ingredient_Id: Number(ingredientId),
          fk_Supplier_Id: Number(selectedSupplierId)
        }),
      });
      console.log(relationResponse);

      if (relationResponse.ok) {
        router.push('/ingredient');
      } else {
        console.error('Failed to create ingredient-supplier relationship');
        console.error(await relationResponse.json());
      }
    } else {
      console.error('Failed to create ingredient');
      console.error(await response.json());
    }
  };


  return (
    <div className="p-4 w-full h-full">
      <CreateFormHeader createType='ingredients' />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="measurementUnit" className="block text-sm font-medium text-gray-700">Measurement Unit:</label>
          <select
            id="measurementUnit"
            value={measurementUnit}
            onChange={(e) => setMeasurementUnit(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option disabled value="">Select a unidade de medida</option>
            <option value="KILOGRAM">Quilogramas</option>
            <option value="GRAM">Gramas</option>
            <option value="LITER">Litros</option>
            <option value="MILLILITER">Mililitros</option>
            <option value="UNIT">Unidade</option>
          </select>

        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade:</label>
          <input
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

        </div>
        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Custo:</label>
          <input
            id="cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

        </div>

        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Fornecedor:</label>
          <select
            id="supplier"
            value={selectedSupplierId}
            onChange={(e) => { console.log(e.target.value); setSelectedSupplierId(e.target.value.toString()) }}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option disabled value="">Escolha um fornecedor</option>
            {supplier.map((supplier) => {
              return <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            })}
          </select>
        </div>

        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewIngredient;
