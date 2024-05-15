"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormLabel from "@/components/form/FormLabel";
import { ProductionProps, ProductProps } from "@/types";

const UpdateProduction = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [originalProductIds, setOriginalProductIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productQuantity, setProductQuantity] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const productionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions/${params.id}`);
        const productionData = await productionResponse.json();
        setName(productionData.name);
        setStartDate(new Date(productionData.start_date).toISOString().split("T")[0]);
        setEndDate(new Date(productionData.end_date).toISOString().split("T")[0]);

        const productIds = productionData.products.map((p: ProductProps) => p.id);
        setSelectedProducts(productIds);
        setOriginalProductIds(productIds);
        const quantities: { [key: number]: number } = {};
        productionData.products.forEach((p: any) => {
          quantities[p.id] = p.quantity;
        });
        setProductQuantity(quantities);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleProductQuantityChange = (productId: number, quantity: number) => {
    setProductQuantity(prevQuantities => ({
      ...prevQuantities,
      [productId]: quantity
    }));
  };

  const handleProductChange = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        const updatedQuantities = { ...productQuantity };
        delete updatedQuantities[productId];
        setProductQuantity(updatedQuantities);
        return prev.filter(id => id !== productId);
      } else {
        setProductQuantity(prevQuantities => ({
          ...prevQuantities,
          [productId]: 0
        }));
        return [...prev, productId];
      }
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const productionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, start_date: startDate, end_date: endDate })
      });

      if (!productionResponse.ok) {
        throw new Error("Failed to update production");
      }

      const production = await productionResponse.json();
      const { id: productionId } = production;

      const productsToAdd = selectedProducts.filter(id => !originalProductIds.includes(id));
      const productsToRemove = originalProductIds.filter(id => !selectedProducts.includes(id));

      const addPromises = productsToAdd.map(productId => {
        const quantityForThisProduct = productQuantity[productId];
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/production-products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fk_Production_id: productionId, fk_Product_id: productId, quantity: quantityForThisProduct })
        });
      });

      const deletePromises = productsToRemove.map(productId =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/production-products/${productId}/${productionId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
      );

      const relationResponses = await Promise.all([...addPromises, ...deletePromises]);
      const allOk = relationResponses.every(response => response && response.ok);

      if (allOk) {
        router.push("/production");
      } else {
        throw new Error("Failed to update some production-product relationships");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col bg-candy-purple max-h-40 items-center p-4 w-full h-full">
      <FormLabel labelType="updateProductions" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nome da Produção"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de Término</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Produtos</label>
            {products.map(product => (
              <div key={product.id} className="flex gap-2 p-2 items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-candy-purple focus:ring-candy-purple-dark border-gray-300 rounded"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleProductChange(product.id)}
                  />
                  {product.name}
                </label>
                {selectedProducts.includes(product.id) && (
                  <input
                    type="number"
                    className="flex py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={productQuantity[product.id] || ''}
                    onChange={e => handleProductQuantityChange(product.id, parseFloat(e.target.value))}
                    min="0"
                    step="0.1"
                  />
                )}
              </div>
            ))}
          </div>
          <button disabled={isLoading} type="submit" className="flex justify-center py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Editar
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduction;
