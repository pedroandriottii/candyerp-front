"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SupplierProps } from '@/types';

const NewIngredient = () => {
    const router = useRouter();

    const [name, setName] = useState('');
    const [measurement_unit, setMeasurement_unit] = useState('');
    const [quantity, setQuantity] = useState('');
    
    const [supplier, setSupplier] = useState<SupplierProps[]>([]);
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>();


    useEffect(() => {
      fetch(`http://localhost:8080/suppliers`)
        .then(response => response.json())
        .then(data => {
          setSupplier(data);
        });
    }, []);

    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
    
      const response = await fetch('http://localhost:8080/ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, measurement_unit, quantity }),
      });
      
      if (response.ok) {
        const ingredient = await response.json();
        console.log('Ingredient created:', ingredient);
        const ingredientId: number = ingredient.id;
        console.log(selectedSupplierId)
        console.log(ingredientId);

        const relationResponse = await fetch('http://localhost:8080/ingredient-suppliers', {
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
      <div className="p-4">
        <h1 className="text-xl font-bold">Add New Ingredient</h1>
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
            onChange={(e) => setMeasurement_unit(e.target.value)}
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

          <select
            id="supplier"
            value={selectedSupplierId}
            onChange={(e) => setSelectedSupplierId(e.target.value.toString())}
            required
            className="border"
          >
            {supplier.map((supplier) => {
              return <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
            })}
          </select>

          <button type="submit" className="bg-blue-500 text-white p-2 mt-4">
            Submit
          </button>
        </form>
      </div>
    );
  };
         
export default NewIngredient;
