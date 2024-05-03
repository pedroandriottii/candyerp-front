'use client';

import { Button } from "@/components/ui/button";
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
        const updatedQuantities = {...productQuantities};
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
    <div className="w-full">
      <div className="p-4 max-w-xl mx-auto ">
        <h1 className="text-6xl font-bold my-6">Nova Produção</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col w-full flex-1">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-bold">Nome</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)} type="text" name="name" id="name"
            />
          </div>
          <div>
            <label htmlFor="date_start">Data início</label>
            <input 
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={handleStartDateChange}
              type="date" name="date_start" id="date_start" />
          </div>
          <div>
            <label htmlFor="date_end">Data fim</label>
            <input 
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={handleEndDateChange}
              type="date" name="date_end" id="date_end" />
          </div>
          <div>
            <label>Produtos</label>
            {products.map(product => (
              <div key={product.id} className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id={`product-${product.id}`} 
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => handleProductChange(product.id)}
                />
                <label htmlFor={`product-${product.id}`}>{product.name}</label>
                {selectedProducts.includes(product.id) && (
                  <input 
                    type="number" 
                    min="0" 
                    value={productQuantities[product.id] || 0}
                    onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                  />
                )}
              </div>
            ))}
          </div>
          <Button type="submit" className="mt-4">
            Criar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NewProduction;
