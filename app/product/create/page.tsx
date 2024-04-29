"use client";

import { useRouter } from "next/navigation";
import { DetailProps, ProductProps } from "@/types";
import { useEffect, useState } from "react";


const NewProduct = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [detail, setDetail] = useState<DetailProps[]>([]);
  const [selectedDetailId, setSelectedDetailId] = useState<string>();
  const [isLoading, setIsloading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/details`)
      .then((response) => response.json())
      .then((data) => {
        setDetail(data);
      });
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsloading(true);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, price, quantity }),
    });
    if (response.ok) {
      const product = await response.json();
      const productId: number = product.id;
      const relationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fk_Product_Id: Number(productId),
          fk_Detail_Id: Number(selectedDetailId),
        }),
      });
      setIsloading(false);
      console.log(relationResponse);
      if (relationResponse.ok) {
        router.push("/product");
      } else {
        console.error("Failed to create product-detail relationship");
      }
    } else {
      console.error("Failed to create product");
    }

  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Add New Product</h1>
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
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço:</label>
          <input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
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
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Detalhe:</label>
          <select
            id="supplier"
            value={selectedDetailId}
            onChange={(e) => setSelectedDetailId(e.target.value.toString())}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option disabled value="">Escolha um Detalhe</option>
            {detail.map((detail) => {
              return <option key={detail.id} value={detail.id}>{detail.description}</option>
            })}
          </select>
        </div>

        <button disabled={isLoading} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-600">
          Submit
        </button>
      </form>
    </div>

  );
};

export default NewProduct;
