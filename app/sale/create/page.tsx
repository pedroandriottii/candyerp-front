"use client";

import { CreateFormHeader } from "@/components/form/CreateFormHeader";
import { ClientProps, DetailProps, ProductProps  } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NewSale() {
  const router = useRouter();

  const [date, setDate] = useState("");
  const [total_price, setTotalPrice] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [order_type, setOrderType] = useState("BALCONY");
  const [payment_method, setPaymentMethod] = useState("CASH");
  const [fk_client_id, setFkClientId] = useState("");
  const [fk_nfe_id, setFkNfeId] = useState("");
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productDetails, setProductDetails] = useState<DetailProps[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});
  const [selectedDetails, setSelectedDetails] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    async function fetchClientsAndProducts() {
      try {
        const clientsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`);
        const clientsData = await clientsResponse.json();
        setClients(clientsData);
        if (clientsData.length > 0) {
          setFkClientId(clientsData[0].id.toString());
        }

        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const detailsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/details`);
        const detailsData = await detailsResponse.json();
        setProductDetails(detailsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchClientsAndProducts();
  }, []);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const nfeResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/nfes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serial_number: Math.floor(100000000 + Math.random() * 900000000).toString() }),
      });

      if (!nfeResponse.ok) throw new Error("Failed to create NFE");

      const nfeData = await nfeResponse.json();
      console.log(`Created NFE: ${nfeData.id}`);
      setFkNfeId(nfeData.id);

      const saleOrderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date, total_price, status, order_type, payment_method, fk_client_id, fk_nfe_id: nfeData.id
        }),
      });

      if (!saleOrderResponse.ok) throw new Error("Failed to create sale order");

      const saleOrderData = await saleOrderResponse.json();
      console.log(`Created sale: ${saleOrderData.id}`);

      for (const productId of selectedProducts) {
        console.log(`Creating detail for product ID ${productId}`)
        const quantity = productQuantities[productId];
        const detailId = selectedDetails[productId];
        if (quantity > 0 && detailId) { 
          const detailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fk_product_id: Number(productId),
              fk_sale_order_id: Number(saleOrderData.id),
              fk_detail_id: Number(detailId),
              quantity: quantity
            })
          });

          if (!detailResponse.ok) throw new Error(`Failed to create detail for product ID ${productId}`);
        }
      }

      router.push('/sale');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="p-4 w-full h-full">
      <CreateFormHeader createType="sales" />
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
              defaultValue={"PENDING"}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>ESCOLHA O STATUS</option>
              <option value="PENDING">Pendente</option>
              <option value="COMPLETED">Finalizado</option>
            </select>
          </div>
          <div>
            <label htmlFor="order_type">Tipo de Venda:</label>
            <select
              id="order_type"
              value={order_type}
              onChange={(e) => setOrderType(e.target.value)}
              required
              defaultValue={"BALCONY"}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>ESCOLHA O TIPO</option>
              <option value="BALCONY">Balcao</option>
              <option value="DELIVERY">Entrega</option>
            </select>
          </div>
          <div>
            <label htmlFor="fk_client_id">Cliente:</label>
            <select
              id="fk_client_id"
              value={fk_client_id ? fk_client_id : ""}
              onChange={(e) => setFkClientId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="payment_method">Método de Pagamento:</label>
            <select
              id="payment_method"
              value={payment_method}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              defaultValue={"CASH"}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>ESCOLHA O MÉTODO</option>
              <option value="CASH">Dinheiro</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="DEBIT_CARD">Cartão de Débito</option>
              <option value="PIX">Pix</option>
            </select>
          </div>
          <div>
            <label htmlFor="">Produtos Vendidos</label>
            {products.map(product => (
              <div key={product.id} className="flex gap-2 p-2 items-center">
                <input
                  type="checkbox"
                  id={`product-${product.id}`}
                  checked={selectedProducts.includes(product.id)}
                  onChange={() => setSelectedProducts(selectedProducts.includes(product.id) ? selectedProducts.filter(id => id !== product.id) : [...selectedProducts, product.id])}
                  className="h-5 w-5 text-candy-purple focus:ring-candy-purple-dark border-gray-300 rounded"
                />
                <label htmlFor={`product-${product.id}`}>{product.name}</label>
                {selectedProducts.includes(product.id) && (
                  <>
                    <input
                      type="number"
                      min="0"
                      value={productQuantities[product.id] || 0}
                      onChange={(e) => setProductQuantities({ ...productQuantities, [product.id]: parseInt(e.target.value) })}
                      className="flex py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <select
                      value={selectedDetails[product.id] || ""}
                      onChange={(e) => setSelectedDetails({ ...selectedDetails, [product.id]: parseInt(e.target.value) })}
                      className="ml-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="" disabled>ESCOLHA O DETALHE</option>
                      {productDetails.map(detail => (
                        <option key={detail.id} value={detail.id}>{detail.description}</option>
                      ))}
                    </select>
                  </>
                )}
              </div>
            ))}
          </div>
          <button type="submit" className="flex justify-center py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cadastrar
          </button>
        </form>
    </div>
  );
}
