"use client";

import FormLabel from "@/components/form/FormLabel";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function AddPhone() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!clientId) {
      router.push("/new-client");
    }
  }, [clientId, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const phoneResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/phones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone, fk_Client_id: clientId }),
      });

      if (phoneResponse.ok) {
        console.log("Phone created successfully");
        router.push("/client");
      } else {
        console.error("Failed to create phone", await phoneResponse.text());
      }
    } catch (error) {
      console.error("Error occurred during phone creation", error);
    }
  };

  return (
    <div className="p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType="createPhones" />
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="phone">Telefone:</label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="(11) 91234-5678"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="flex justify-center py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}
