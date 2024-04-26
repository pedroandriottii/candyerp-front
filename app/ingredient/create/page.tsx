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
    const [selectedSupplierId, setSelectedSupplierId] = useState('');

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
        router.push('/ingredient');
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

          <label htmlFor="supplier">Supplier:</label>
          <select
            id="supplier"
            value={supplier.map(s => s.name)}
            onChange={(e) => setSelectedSupplierId(e.target.value)}
            required
            className="border"
          > 
            {supplier.map((supplier) => {
              return <option key={supplier.id} value={supplier.name}>{supplier.name}</option>
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
