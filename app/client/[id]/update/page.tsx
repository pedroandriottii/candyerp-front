"use client";

import FormLabel from "@/components/form/FormLabel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const UpdateClient = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [complement, setComplement] = useState("");
  const [phones, setPhones] = useState([{ id: null, phone: "" }]);
  const [deletedPhones, setDeletedPhones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientAndPhones = async () => {
      try {
        const clientResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}`);
        const clientData = await clientResponse.json();
        setName(clientData.name);
        setStreet(clientData.street);
        setNumber(clientData.number);
        setNeighborhood(clientData.neighborhood);
        setComplement(clientData.complement);

        const phonesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/phones`);
        const phonesData = await phonesResponse.json();
        const clientPhones = phonesData.filter((phone: any) => phone.fkClientId === parseInt(params.id));
        setPhones(clientPhones.length > 0 ? clientPhones : [{ id: null, phone: "" }]);

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching client or phone data:', error);
      }
    };

    fetchClientAndPhones();
  }, [params.id]);

  const handleAddPhone = () => {
    setPhones([...phones, { id: null, phone: "" }]);
  };

  const handleRemovePhone = (index: number) => {
    const phoneToRemove = phones[index];
    if (phoneToRemove.id) {
      setDeletedPhones([...deletedPhones, phoneToRemove.id]);
    }
    const newPhones = phones.filter((_, i) => i !== index);
    setPhones(newPhones);
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = phones.map((phone, i) => (i === index ? { ...phone, phone: value } : phone));
    setPhones(newPhones);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const clientResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, street, number, neighborhood, complement }),
      });

      if (clientResponse.ok) {
        const phonePromises = phones.map((phone) =>
          phone.id
            ? fetch(`${process.env.NEXT_PUBLIC_API_URL}/phones/${phone.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phone.phone, fkClientId: params.id }),
              })
            : fetch(`${process.env.NEXT_PUBLIC_API_URL}/phones`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phone.phone, fkClientId: params.id }),
              })
        );

        const deletePromises = deletedPhones.map((id) =>
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/phones/${id}`, {
            method: 'DELETE',
          })
        );

        const phoneResponses = await Promise.all(phonePromises);
        await Promise.all(deletePromises);

        if (phoneResponses.every((res) => res.ok)) {
          router.push('/client');
        } else {
          console.error("Failed to update some phones", phoneResponses);
        }
      } else {
        console.error("Failed to update client", await clientResponse.text());
      }
    } catch (error) {
      console.error('Error updating client or phone:', error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType="updateClients" />
      <div className="flex items-center justify-center">
        <form onSubmit={handleSubmit} className='flex flex-1 flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md'>
          <div>
            <label htmlFor="name">Nome:</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder='João da Silva'
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
              placeholder='Rua das Flores'
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
              placeholder='123'
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
              placeholder='Centro'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="complement">Complemento:</label>
            <input
              id="complement"
              value={complement}
              onChange={(e) => setComplement(e.target.value)}
              placeholder='Clube'
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
                    value={phone.phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    required
                    placeholder='11999990000'
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          <button type="submit" className="flex justify-center py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Editar
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateClient;
