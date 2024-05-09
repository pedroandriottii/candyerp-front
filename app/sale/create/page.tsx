"use client";

import { CreateFormHeader } from "@/components/form/CreateFormHeader";
import { ClientProps } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewSale() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [total_price, setTotalPrice] = useState("");
  const [status, setStatus] = useState("");
  const [order_type, setOrderType] = useState("");
  const [payment_method, setPaymentMethod] = useState("");
  const [fk_client_id, setFkClientId] = useState("");
  const [fk_nfe_id, setFkNfeId] = useState("");


  const [clients, setClients] = useState<ClientProps[]>([]);


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nfe = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nfes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serial_number: "1231231" }),
    });

    if (nfe.ok) {
      const nfeData = await nfe.json();
      console.log(nfeData.id)
      setFkNfeId(nfeData.id);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, total_price, status, order_type, payment_method, fk_client_id: 4, fk_nfe_id: 4 }),
    });

    if (response.ok) {
      router.push('/sale');
    }
  };

  return (
    <div className="p-4 w-full h-full">
      <CreateFormHeader createType="sales" />
      <div>
        <form onSubmit={handleSubmit} className='flex flex-1 flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md'>
          <div>
            <label htmlFor="date">Data:</label>
            <input
              id="date"
              value={date}
              type="date"
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="total_price">Valor Total:</label>
            <input
              id="total_price"
              value={total_price}
              onChange={(e) => setTotalPrice(e.target.value)}
              required
              placeholder='1000.00'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="status">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="PENDING">Pendente</option>
              <option value="COMPLETED">Cancelado</option>
            </select>
          </div>
          <div>
            <label htmlFor="order_type">Tipo de Venda:</label>
            <select
              id="order_type"
              value={order_type}
              onChange={(e) => setOrderType(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="BALCONY">Balcao</option>
              <option value="DELIVERY">Entrega</option>
            </select>
          </div>
          <div>
            <label htmlFor="payment_method">Método de Pagamento:</label>
            <select
              id="payment_method"
              value={payment_method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="CASH">Dinheiro</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="DEBIT_CARD">Cartão de Débito</option>
              <option value="PIX">Pix</option>
            </select>
          </div>
          <button type="submit" className="flex justify-center py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
}

