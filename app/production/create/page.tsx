'use client';

import FormLabel from "@/components/form/FormLabel";
import { ProductProps } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NewProduction = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      .then((response) => response.json())
      .then(setProducts);
  }, []);

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setStartDate(selectedDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(event.target.value);
    setEndDate(selectedDate);
  };

  const handleProductChange = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        const updatedQuantities = { ...productQuantities };
        delete updatedQuantities[productId];
        setProductQuantities(updatedQuantities);
        return prev.filter(id => id !== productId);
      } else {
        setProductQuantities(prevQuantities => ({
          ...prevQuantities,
          [productId]: 0
        }));
        return [...prev, productId];
      }
    });
  };

  const handleQuantityChange = (productId: number, quantity: number) => {
    setProductQuantities(prevQuantities => ({
      ...prevQuantities,
      [productId]: quantity
    }));
  };

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const formattedStartDate = startDate ? startDate.toISOString().split('T')[0] : '';
    const formattedEndDate = endDate ? endDate.toISOString().split('T')[0] : '';

    const productionData = {
      name,
      start_date: formattedStartDate,
      end_date: formattedEndDate,
    };

    const productionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productionData)
    });

    if (productionResponse.ok) {
      console.log("passei por criacao de producao ok")

      const production = await productionResponse.json();
      const productionId = production.id;
      console.log(productionId)
      await Promise.all(selectedProducts.map(productId => {
        console.log("passei por criacao de producao")
        const quantity = productQuantities[productId];
        console.log(JSON.stringify({
          fk_Production_id: productionId,
          fk_Product_id: productId,
          quantity: quantity
        }))
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/production-products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fk_Production_id: (Number(productionId)),
            fk_Product_id: Number(productId),
            quantity: quantity
          })
        });
      }));
      router.push("/production");
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType="createProductions" />
      <form onSubmit={handleSubmit} className="">
        <div className="flex flex-col max-w-lg gap-4 bg-white rounded-lg shadow-md p-4 m-6">
          <div>
            <label htmlFor="name">Nome</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)} type="text" name="name" id="name"
              required
              placeholder="Fornada de Cookies"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="date_start">Data de início</label>
            <input
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={handleStartDateChange}
              type="date" name="date_start" id="date_start"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="date_end">Data do fim</label>
            <input
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={handleEndDateChange}
              type="date" name="date_end" id="date_end"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label>Produtos</label>
            {products.map(product => (
              <div key={product.id} className="flex gap-2 p-2 items-center">
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleProductChange(product.id)}
                  className="h-5 w-5 text-candy-purple focus:ring-candy-purple-dark border-gray-300 rounded"
                />
                <label htmlFor={`product-${product.id}`}>{product.name}</label>
                {selectedProducts.includes(product.id) && (
                  <input
                    type="number"
                    min="0"
                    value={productQuantities[product.id] || 0}
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                    className="flex py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
              </div>
            ))}
          </div>
          <button type="submit" className="flex justify-center py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cadastrar
          </button>
        </div>
      </form >
    </div >
  );
};

export default NewProduction;
