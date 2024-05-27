"use client";

import { ClientProps, DetailProps, ProductProps, ProductDetailSaleProps } from "@/types";
import FormLabel from "@/components/form/FormLabel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditSale({ params }: { params: { id: string } }) {
  const router = useRouter();

  const saleOrderId = params.id;

  const [date, setDate] = useState("");
  const [total_price, setTotalPrice] = useState("");
  const [order_type, setOrderType] = useState("BALCONY");
  const [payment_method, setPaymentMethod] = useState("CASH");
  const [fk_client_id, setFkClientId] = useState<string | null>(null);
  const [fk_nfe_id, setFkNfeId] = useState("");
  const [clients, setClients] = useState<ClientProps[]>([]);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [productDetails, setProductDetails] = useState<DetailProps[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [originalSelectedProducts, setOriginalSelectedProducts] = useState<number[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ [key: number]: number }>({});
  const [selectedDetails, setSelectedDetails] = useState<{ [key: number]: number }>({});
  const [originalSelectedDetails, setOriginalSelectedDetails] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    async function fetchClientsAndProducts() {
      try {
        const clientsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients`);
        const clientsData = await clientsResponse.json();
        setClients(clientsData);

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

    async function fetchSaleOrder() {
      try {
        const saleOrderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders/${saleOrderId}`);
        const saleOrderData = await saleOrderResponse.json();

        setDate(saleOrderData.date);
        setTotalPrice(saleOrderData.total_price);
        setOrderType(saleOrderData.order_type);
        setPaymentMethod(saleOrderData.payment_method);
        setFkClientId(saleOrderData.fk_client_id ? saleOrderData.fk_client_id.toString() : null);
        setFkNfeId(saleOrderData.fk_nfe_id);

        const detailSalesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales/${saleOrderId}`);
        const detailSalesData: ProductDetailSaleProps[] = await detailSalesResponse.json();

        const selectedProducts = detailSalesData.map(detail => detail.fk_product_id);
        setSelectedProducts(selectedProducts);
        setOriginalSelectedProducts(selectedProducts);

        const quantities: { [key: number]: number } = {};
        const details: { [key: number]: number } = {};
        detailSalesData.forEach(detail => {
          quantities[detail.fk_product_id] = detail.quantity;
          details[detail.fk_product_id] = detail.fk_detail_id;
        });
        setProductQuantities(quantities);
        setSelectedDetails(details);
        setOriginalSelectedDetails(details);
      } catch (error) {
        console.error("Failed to fetch sale order:", error);
      }
    }

    fetchClientsAndProducts();
    fetchSaleOrder();
  }, [saleOrderId]);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      const saleOrderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders/${saleOrderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date, total_price, order_type, payment_method, fk_client_id: fk_client_id || null, fk_nfe_id
        }),
      });

      if (!saleOrderResponse.ok) throw new Error("Failed to update sale order");

      for (const productId of selectedProducts) {
        const quantity = productQuantities[productId];
        const detailId = selectedDetails[productId];
        if (quantity > 0 && detailId) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales/${saleOrderId}/${productId}/${detailId}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fk_product_id: Number(productId),
              fk_sale_order_id: Number(saleOrderId),
              fk_detail_id: Number(detailId),
              quantity: quantity
            })
          });
        }
      }

      const productsToRemove = originalSelectedProducts.filter(productId => !selectedProducts.includes(productId));
      for (const productId of productsToRemove) {
        const detailId = originalSelectedDetails[productId];
        if (detailId) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales/${saleOrderId}/${productId}/${detailId}`, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      }

      for (const productId of selectedProducts) {
        const originalDetailId = originalSelectedDetails[productId];
        const newDetailId = selectedDetails[productId];
        if (originalDetailId !== newDetailId) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales/${saleOrderId}/${productId}/${originalDetailId}`, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
            },
          });
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fk_product_id: Number(productId),
              fk_sale_order_id: Number(saleOrderId),
              fk_detail_id: Number(newDetailId),
              quantity: productQuantities[productId]
            })
          });
        }
      }

      router.push('/sale');
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col p-4 w-full h-full bg-candy-purple max-h-40">
      <FormLabel labelType="updateSales" />
      <form onSubmit={handleSubmit} className="flex-col flex-1 bg-white rounded-lg shadow-md p-4 m-6 overflow-y-auto min-h-[85vh]">
        <div className='grid grid-cols-2 gap-4'>
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
              disabled
            />
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
            <label htmlFor="fk_client_id">Cliente:</label>
            <select
              id="fk_client_id"
              value={fk_client_id ? fk_client_id : ""}
              onChange={(e) => setFkClientId(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>Selecione um Cliente</option>
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="CASH">Dinheiro</option>
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="DEBIT_CARD">Cartão de Débito</option>
              <option value="PIX">Pix</option>
            </select>
          </div>
        </div>
        <div>
          <div className="pt-4">
            <label htmlFor="">Produtos Vendidos</label>
            <div className="grid grid-cols-2 gap-4 pb-4">
              {products.map((product) => (
                <div key={product.id} className="flex gap-2 p-2 items-center border border-gray-300 rounded-md">
                  <input
                    type="checkbox"
                    id={`product-${product.id}`}
                    checked={selectedProducts.includes(product.id)}
                    onChange={() =>
                      setSelectedProducts(
                        selectedProducts.includes(product.id)
                          ? selectedProducts.filter((id) => id !== product.id)
                          : [...selectedProducts, product.id]
                      )
                    }
                    className="h-5 w-5 text-candy-purple focus:ring-candy-purple-dark border-gray-300 rounded"
                  />
                  <label htmlFor={`product-${product.id}`} className="flex-1">
                    {product.name}
                  </label>
                  {selectedProducts.includes(product.id) && (
                    <>
                      <input
                        type="number"
                        min="0"
                        value={productQuantities[product.id] || 0}
                        onChange={(e) =>
                          setProductQuantities({
                            ...productQuantities,
                            [product.id]: parseInt(e.target.value),
                          })
                        }
                        className="flex py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                      <select
                        value={selectedDetails[product.id] || ""}
                        onChange={(e) =>
                          setSelectedDetails({
                            ...selectedDetails,
                            [product.id]: parseInt(e.target.value),
                          })
                        }
                        className="ml-2 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="" disabled>
                          ESCOLHA O DETALHE
                        </option>
                        {productDetails.map((detail) => (
                          <option key={detail.id} value={detail.id}>
                            {detail.description}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button type="submit" className="flex w-full justify-center py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Atualizar
        </button>
      </form>
    </div>
  );
}
