'use client';

import { useRouter } from "next/navigation";
import { IngredientProps } from "@/types";
import { useEffect, useState } from "react";
import FormLabel from "@/components/form/FormLabel";
import { formatValue } from "@/utils";

const NewProduct = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setIngredients] = useState<IngredientProps[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredientQuantity, setIngredientQuantity] = useState<{ [key: number]: number }>({});

  useEffect(() => {
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
        const updatedQuantities = { ...ingredientQuantity };
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
      body: JSON.stringify({ name, price })
    });
    if (productResponse.ok) {
      const response = await productResponse.json();
      const { id: productId } = response;

      await Promise.all(selectedIngredients.map(ingredientId => {
        const quantityForThisIngredient = ingredientQuantity[ingredientId];
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
    <div className="flex flex-col items-center p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType="createProducts" />
      <div className="w-full h-full flex flex-col items-center justify-center align-center bg-white m-6 p-4 rounded-lg shadow-md mb-10">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="w-full grid grid-cols-2 align-center justify-center gap-4 max-h[70vh] overflow-auto mb-4">
            <div>
              <label htmlFor="name" >Nome</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Bolo de Cenoura"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label htmlFor="price" >Preço</label>
              <input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="10.00"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="py-4">
            <label >Ingredientes</label>
            <div className="grid grid-cols-2 gap-4">
              {ingredients.map(ingredient => (
                <div key={ingredient.id} className="flex gap-2 p-2 items-center border border-gray-300 rounded-md">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-candy-purple focus:ring-candy-purple-dark border-gray-300 rounded"
                    checked={selectedIngredients.includes(ingredient.id)}
                    onChange={() => handleIngredientChange(ingredient.id)}

                  />
                  <div className="flex flex-1 justify-between">
                    <p>
                      {ingredient.name}
                    </p>
                    {selectedIngredients.includes(ingredient.id) && (
                      <input
                        type="number"
                        className="flex py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={ingredientQuantity[ingredient.id] || ''}
                        onChange={e => handleIngredientQuantityChange(ingredient.id, Number(e.target.value))}
                        min="0"
                        step="0.1"
                      />
                    )}
                    <p className="text-slate-500">
                      {formatValue('measurementUnit', ingredient.measurementUnit)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button disabled={isLoading} type="submit" className="w-full justify-center py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cadastrar
          </button>
        </form>
      </div>
    </div>

  );
};

export default NewProduct;
