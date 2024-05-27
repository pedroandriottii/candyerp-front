"use client";

import FormLabel from "@/components/form/FormLabel";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [phones, setPhones] = useState([""]);

  const handleAddPhone = () => {
    setPhones([...phones, ""]);
  };

  const handleRemovePhone = (index: number) => {
    const newPhones = phones.filter((_, i) => i !== index);
    setPhones(newPhones);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = phones.map((phone, i) => (i === index ? value : phone));
    setPhones(newPhones);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const clientResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, street, number, neighborhood, complement }),
      });

      if (clientResponse.ok) {
        const clientData = await clientResponse.json();
        const clientId = clientData.id;
        console.log("Client created with ID:", clientId);

        const phonePromises = phones.map((phone) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/phones`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phone, fkClientId: clientId }),
          })
        );

        const phoneResponses = await Promise.all(phonePromises);

        if (phoneResponses.every((res) => res.ok)) {
          console.log("All phones created successfully", clientId, phones);
          router.push(`/client`);
        } else {
          console.error("Failed to create some phones", phoneResponses);
        }
      } else {
        console.error("Failed to create client", await clientResponse.text());
      }
    } catch (error) {
      console.error("Error occurred during client creation", error);
    }
  };

  return (
    <div className="p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType="createClients" />
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="João da Silva"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="street">Rua:</label>
            <input
              id="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              placeholder="Rua das Flores"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="number">Número:</label>
            <input
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              required
              placeholder="123"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="neighborhood">Bairro:</label>
            <input
              id="neighborhood"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              required
              placeholder="Centro"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="complement">Complemento:</label>
            <input
              id="complement"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder="Apto 101"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {phones.map((phone, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-1">
                <label htmlFor={`phone-${index}`}>Telefone {index + 1}:</label>
                <div className="flex items-center">
                  <input
                    id={`phone-${index}`}
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    required
                    placeholder="11999990000"
                    className="mt-1 block w-full px-3  border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePhone(index)}
                    className="ml-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-700"
                  >
                    Remover
                  </button>
                </div>
                
              </div>
              
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddPhone}
            className="mt-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-700"
          >
            Adicionar Telefone
          </button>
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
