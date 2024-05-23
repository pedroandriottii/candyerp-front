"use client";

import { useRouter } from "next/navigation";
import { IngredientProps } from "@/types";
import { useEffect, useState } from "react";
import FormLabel from "@/components/form/FormLabel";

const UpdateProduct = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [ingredients, setIngredients] = useState<IngredientProps[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [originalIngredientIds, setOriginalIngredientIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [ingredientQuantity, setIngredientQuantity] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ingredientsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredients`);
        const ingredientsData = await ingredientsResponse.json();
        setIngredients(ingredientsData);

        const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`);
        const productData = await productResponse.json();
        setName(productData.name);
        setPrice(productData.price);
        setQuantity(productData.quantity);
        const ingredientIds = productData.ingredients.map((i: IngredientProps) => i.id);
        setSelectedIngredients(ingredientIds);
        setOriginalIngredientIds(ingredientIds);
        const quantities: { [key: number]: number } = {};
        productData.ingredients.forEach((i: any) => {
          quantities[i.id] = i.quantity;
        });
        setIngredientQuantity(quantities);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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
    try {
      const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price, quantity })
      });

      if (!productResponse.ok) {
        throw new Error("Failed to update product");
      }

      const product = await productResponse.json();
      const { id: productId } = product;

      const ingredientsToAdd = selectedIngredients.filter(id => !originalIngredientIds.includes(id));
      const ingredientsToRemove = originalIngredientIds.filter(id => !selectedIngredients.includes(id));

      const addPromises = ingredientsToAdd.map(ingredientId => {
        const quantityForThisIngredient = ingredientQuantity[ingredientId];
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient-products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fk_Product_id: productId, fk_Ingredient_id: ingredientId, quantity: quantityForThisIngredient })
        });
      });

      const deletePromises = ingredientsToRemove.map(ingredientId =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient-products/${productId}/${ingredientId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
      );

      const updatePromises = selectedIngredients.map(ingredientId => {
        const quantityForThisIngredient = ingredientQuantity[ingredientId];
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/ingredient-products/${productId}/${ingredientId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: quantityForThisIngredient })
        });
      });

      const relationResponses = await Promise.all([...addPromises, ...deletePromises, ...updatePromises]);
      const allOk = relationResponses.every(response => response.ok);

      if (allOk) {
        router.push("/product");
      } else {
        throw new Error("Failed to update some ingredient-product relationships");
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
      <FormLabel labelType="updateProducts" />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
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
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço</label>
            <input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              placeholder="10.00"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantidade</label>
            <input
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              placeholder="10"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ingredientes</label>
            {ingredients.map(ingredient => (
              <div key={ingredient.id} className="flex gap-2 p-2 items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-candy-purple focus:ring-candy-purple-dark border-gray-300 rounded"
                    checked={selectedIngredients.includes(ingredient.id)}
                    onChange={() => handleIngredientChange(ingredient.id)}
                  />
                  {ingredient.name}
                </label>
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
                <p>{ingredient.measurementUnit}</p>
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

export default UpdateProduct;
