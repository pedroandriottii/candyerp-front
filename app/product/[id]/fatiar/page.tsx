"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormLabel from "@/components/form/FormLabel";
import { ProductProps } from "@/types";

const FatiarProduto = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [product, setProduct] = useState<ProductProps>();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [selectedSliceProduct, setSelectedSliceProduct] = useState<number>();
  const [quantity, setQuantity] = useState(0);
  const [slicesPerProduct, setSlicesPerProduct] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`);
        const productData = await productResponse.json();
        setProduct(productData);

        const allProductsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const allProductsData = await allProductsResponse.json();
        setProducts(allProductsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSlice = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoading(true);

    if (!product || !selectedSliceProduct || quantity <= 0 || slicesPerProduct <= 0) {
      toast('Por favor, preencha todos os campos corretamente.', { type: 'error' });
      setIsLoading(false);
      return;
    }

    const updatedProductQuantity = product.quantity - quantity;
    const slicesProduct = products.find(prod => prod.id === selectedSliceProduct);
    const updatedSlicesProductQuantity = (slicesProduct?.quantity ?? 0) + (quantity * slicesPerProduct);

    try {
      const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, quantity: updatedProductQuantity })
      });

      const slicesProductResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${selectedSliceProduct}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...slicesProduct, quantity: updatedSlicesProductQuantity })
      });

      if (productResponse.ok && slicesProductResponse.ok) {
        toast('Produto fatiado com sucesso!', { type: 'success' });
        router.push("/product");
      } else {
        throw new Error('Erro ao atualizar produtos');
      }
    } catch (error) {
      console.error("Failed to update products", error);
      toast('Erro ao fatiar o produto.', { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col bg-candy-purple max-h-40 items-center p-4 w-full h-full">
      <FormLabel labelType="sliceProducts" />
      <ToastContainer />
      <form onSubmit={handleSlice} className="space-y-4">
        <div className="flex flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md">
          {product && (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Produto</label>
                <input
                  id="name"
                  value={product.name}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade a Fatiar</label>
                <input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  required
                  placeholder="Quantidade"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="slicesPerProduct" className="block text-sm font-medium text-gray-700">Fatias por Produto</label>
                <input
                  id="slicesPerProduct"
                  type="number"
                  value={slicesPerProduct}
                  onChange={(e) => setSlicesPerProduct(parseInt(e.target.value))}
                  required
                  placeholder="Número de Fatias"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="selectedSliceProduct" className="block text-sm font-medium text-gray-700">Produto para Receber Fatias</label>
                <select
                  id="selectedSliceProduct"
                  value={selectedSliceProduct || ''}
                  onChange={(e) => setSelectedSliceProduct(parseInt(e.target.value))}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Selecione um produto</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="flex justify-center py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                Fatiar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default FatiarProduto;
