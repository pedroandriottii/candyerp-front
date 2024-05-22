"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FormLabel from "@/components/form/FormLabel";
import { ProductProps } from "@/types";

const FatiarProduto = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [product, setProduct] = useState<ProductProps>();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [slicesPerProduct, setSlicesPerProduct] = useState(0);
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [slicesProductExists, setSlicesProductExists] = useState(false);

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

  useEffect(() => {
    if (product && quantity > 0 && slicesPerProduct > 0) {
      const sliceProductName = `Fatia de ${product.name}`;
      const existingProduct = products.find(prod => prod.name === sliceProductName);
      setSlicesProductExists(!!existingProduct);
    }
  }, [product, quantity, slicesPerProduct, products]);

  const handleSlice = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoading(true);

    if (!product || quantity <= 0 || slicesPerProduct <= 0 || (!slicesProductExists && !price)) {
      setIsLoading(false);
      return;
    }

    const updatedProductQuantity = product.quantity - quantity;
    const sliceProductName = `Fatia de ${product.name}`;
    const totalSlices = quantity * slicesPerProduct;

    try {
      // Atualiza a quantidade do produto original
      const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...product, quantity: updatedProductQuantity })
      });

      if (!productResponse.ok) {
        throw new Error('Erro ao atualizar produto original');
      }

      // Verifica se o produto fatiado já existe
      let slicesProduct = products.find(prod => prod.name === sliceProductName);

      if (slicesProduct) {
        // Produto fatiado já existe, atualiza a quantidade
        slicesProduct.quantity += totalSlices;
        const updateSlicesProductResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slicesProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slicesProduct)
        });

        if (!updateSlicesProductResponse.ok) {
          throw new Error('Erro ao atualizar produto fatiado');
        }
      } else {
        // Produto fatiado não existe, cria um novo
        
        const createSlicesProductResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: sliceProductName, price: parseFloat(price), quantity: totalSlices, fk_product_id: product.id })
        });

        if (!createSlicesProductResponse.ok) {
          throw new Error('Erro ao criar produto fatiado');
        }
      }

      router.push("/product");
    } catch (error) {
      console.error("Failed to process products", error);
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
              {!slicesProductExists && (
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço da Fatia</label>
                  <input
                    id="price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    placeholder="Preço"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              )}
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
