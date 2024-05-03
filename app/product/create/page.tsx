"use client";

import { useRouter } from "next/navigation";
import { DetailProps, IngredientProps } from "@/types";
import { useEffect, useState } from "react";


const NewProduct = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState<DetailProps[]>([]);
  const [selectedDetailId, setSelectedDetailId] = useState("");
  const [ingredients, setIngredients] = useState<IngredientProps[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredientQuantity, setIngredientQuantity] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/details`)
      .then((response) => response.json())
      .then(setDetails);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`)
      .then((response) => response.json())
      .then(setIngredients);
  }, []);

  const handleIngredientQuantityChange = (ingredientId: number, quantity: number) => {
    setIngredientQuantity(prevQuantities => ({
      ...prevQuantities,
      [ingredientId]: quantity
    }));
  };

  const handleIngredientChange = (ingredientId: number) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredientId)) {
        const updatedQuantities = {...ingredientQuantity};
        delete updatedQuantities[ingredientId];
        setIngredientQuantity(updatedQuantities);
        return prev.filter(id => id !== ingredientId);
      } else {
        setIngredientQuantity(prevQuantities => ({
          ...prevQuantities,
          [ingredientId]: 0
        }));
        return [...prev, ingredientId];
      }
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoading(true);
    const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity, fk_detail_id: selectedDetailId })
    });
    console.log("passei por criacao de produto")
    if (productResponse.ok) {
      console.log("passei por criacao de produto ok")
      const response = await productResponse.json();
      console.log(response)
      const { id: productId } = response;
      console.log("passei por criacao de produto id")
      console.log(productId)

      await Promise.all(selectedIngredients.map(ingredientId => {
        const quantityForThisIngredient = ingredientQuantity[ingredientId];
        console.log(JSON.stringify({ fk_Product_id: productId, fk_Ingredient_id: ingredientId, quantity: ingredientQuantity }))
        console.log(ingredientId)
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient-products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fk_Product_id: productId, fk_Ingredient_id: ingredientId, quantity: quantityForThisIngredient })
        });
      }));

      setIsLoading(false);
      router.push("/product");
    } else {
      console.error("Failed to create product");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome:</label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço:</label>
          <input
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade:</label>
          <input
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Detalhe:</label>
          <select
            id="supplier"
            value={selectedDetailId}
            onChange={(e) => setSelectedDetailId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option disabled value="">Escolha um Detalhe</option>
            {details.map((detail) => (
              <option key={detail.id} value={detail.id}>{detail.description}</option>
            ))}
          </select>
        </div>
        {/* Campo para selecionar ingredientes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Ingredientes:</label>
          {ingredients.map(ingredient => (
            <div key={ingredient.id} className="flex items-center space-x-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="h-5 w-5 text-indigo-600"
                  checked={selectedIngredients.includes(ingredient.id)}
                  onChange={() => handleIngredientChange(ingredient.id)}
                />
                {ingredient.name}
              </label>
              {selectedIngredients.includes(ingredient.id) && (
                <input
                  type="number"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={ingredientQuantity[ingredient.id] || ''}
                  onChange={e => handleIngredientQuantityChange(ingredient.id, parseFloat(e.target.value))}
                  min="0"
                  step="0.1"
                />
              )}
              {ingredient.measurement_unit}
            </div>
          ))}
        </div>
        <button disabled={isLoading} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-600">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewProduct;
