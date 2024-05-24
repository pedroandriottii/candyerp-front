"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SupplierProps } from '@/types';
import FormLabel from '@/components/form/FormLabel';

const NewIngredient = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');

  const [suppliers, setSuppliers] = useState<SupplierProps[]>([]);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/suppliers`)
      .then(response => response.json())
      .then(data => {
        setSuppliers(data);
      });
  }, []);

  const handleSupplierChange = (supplierId: string) => {
    setSelectedSupplierIds((prevSelected) => {
      if (prevSelected.includes(supplierId)) {
        return prevSelected.filter(id => id !== supplierId);
      } else {
        return [...prevSelected, supplierId];
      }
    });
  };

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

      const promises = selectedSupplierIds.map(supplierId =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient-suppliers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fk_Ingredient_Id: Number(ingredientId),
            fk_Supplier_Id: Number(supplierId),
          }),
        })
      );

      const relationResponses = await Promise.all(promises);
      const allOk = relationResponses.every(response => response.ok);

      if (allOk) {
        router.push('/ingredient');
      } else {
        console.error('Failed to create some ingredient-supplier relationships');
        console.error(await Promise.all(relationResponses.map(res => res.json())));
      }
    } else {
      console.error('Failed to create ingredient');
      console.error(await response.json());
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType='createIngredients' />
      <form onSubmit={handleSubmit} className='flex flex-col bg-white p-4 m-6 rounded-lg shadow-md'>
        <div className="w-full grid grid-cols-2 align-center justify-center max-h-[70vh] gap-4 overflow-auto mb-4">
          <div>
            <label htmlFor="name" >Nome do Ingrediente</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='Açúcar'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="measurementUnit" >Unidade de Medida</label>
            <select
              id="measurementUnit"
              value={measurementUnit}
              onChange={(e) => setMeasurementUnit(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option disabled value="">Selecione a unidade de medida</option>
              <option value="KILOGRAM">Quilogramas</option>
              <option value="GRAM">Gramas</option>
              <option value="LITER">Litros</option>
              <option value="MILLILITER">Mililitros</option>
              <option value="UNIT">Unidade</option>
            </select>
          </div>
          <div>
            <label htmlFor="quantity" >Quantidade</label>
            <input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              placeholder='10'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="cost" >Custo:</label>
            <input
              id="cost"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              required
              placeholder='10.00'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        <div className='py-4'>
          <label >Fornecedores</label>
          <div className='grid grid-cols-2 gap-4'>
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="flex gap-2 p-2 items-center border border-gray-300 rounded-md">
                <input
                  id={`supplier-${supplier.id}`}
                  type="checkbox"
                  value={supplier.id}
                  checked={selectedSupplierIds.includes(String(supplier.id))}
                  onChange={() => handleSupplierChange(String(supplier.id))}
                  className="h-5 w-5 text-candy-purple focus:ring-candy-purple-dark border-gray-300 rounded"
                />
                <p>
                  {supplier.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <button type="submit" className="w-full justify-center py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cadastrar
        </button>
      </form>
    </div>

  );
};

export default NewIngredient;
