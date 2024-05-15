"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SupplierProps } from '@/types';
import FormLabel from '@/components/form/FormLabel';

const UpdateIngredient = ({ params }: { params: { id: string } }) => {
  const [name, setName] = useState('');
  const [measurementUnit, setMeasurementUnit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cost, setCost] = useState('');
  const [loading, setLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<SupplierProps[]>([]);
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  const [originalSupplierIds, setOriginalSupplierIds] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${params.id}`)
        .then(response => response.json())
        .then(data => {
          setName(data.name);
          setMeasurementUnit(data.measurementUnit);
          setQuantity(data.quantity);
          setCost(data.cost);
          const supplierIds = data.suppliers.map((s: SupplierProps) => s.id.toString());
          setSelectedSupplierIds(supplierIds);
          setOriginalSupplierIds(supplierIds);
          setLoading(false);
        });
    }
  }, [params.id]);

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

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, measurementUnit, quantity, cost }),
    });

    if (response.ok) {
      const ingredient = await response.json();
      const ingredientId: number = ingredient.id;

      const suppliersToAdd = selectedSupplierIds.filter(id => !originalSupplierIds.includes(id));
      const suppliersToRemove = originalSupplierIds.filter(id => !selectedSupplierIds.includes(id));

      const addPromises = suppliersToAdd.map(supplierId => {
        if (!originalSupplierIds.includes(supplierId)) {
          return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient-suppliers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fk_Ingredient_Id: Number(ingredientId),
              fk_Supplier_Id: Number(supplierId),
            }),
          });
        }
      });

      const deletePromises = suppliersToRemove.map(supplierId =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient-suppliers/${ingredientId}/${supplierId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      );

      const relationResponses = await Promise.all([...addPromises, ...deletePromises]);
      const allOk = relationResponses.every(response => response && response.ok);

      if (allOk) {
        router.push('/ingredient');
      } else {
        console.error('Failed to update some ingredient-supplier relationships');
        console.error(await Promise.all(relationResponses.filter(Boolean).map(res => res!.json())));
      }
    } else {
      console.error('Failed to update ingredient');
      console.error(await response.json());
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center bg-candy-purple max-h-40 p-4 w-full h-full">
      <FormLabel labelType='updateIngredients' />
      <form onSubmit={handleSubmit} className='flex flex-col bg-white p-4 m-6 rounded-lg shadow-md'>
        <div className="flex flex-col max-w-lg pb-4 gap-4 m-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome:</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

          <label htmlFor="measurementUnit" className="block text-sm font-medium text-gray-700">Unidade de Medida</label>
          <select
            id="measurementUnit"
            value={measurementUnit}
            onChange={(e) => setMeasurementUnit(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option disabled value="">Selecione a unidade de medida</option>
            <option value="KILOGRAM">Quilogramas</option>
            <option value="GRAM">Gramas</option>
            <option value="LITER">Litros</option>
            <option value="MILLILITER">Mililitros</option>
            <option value="UNIT">Unidade</option>
          </select>

          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade:</label>
          <input
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">Custo:</label>
          <input
            id="cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />

          <label className="block text-sm font-medium text-gray-700">Fornecedores</label>
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="flex items-center">
              <input
                id={`supplier-${supplier.id}`}
                type="checkbox"
                value={supplier.id}
                checked={selectedSupplierIds.includes(String(supplier.id))}
                onChange={() => handleSupplierChange(String(supplier.id))}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor={`supplier-${supplier.id}`} className="ml-2 block text-sm text-gray-700">
                {supplier.name}
              </label>
            </div>
          ))}

          <button type="submit" className="flex justify-center py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Editar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateIngredient;
