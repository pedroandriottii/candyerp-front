"use client";

import { ClientProps, DetailProps, ProductProps } from "@/types";
import FormLabel from "@/components/form/FormLabel";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Link from "next/link";

export default function NewSale() {
  const router = useRouter();

  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [orderType, setOrderType] = useState<string>("BALCONY");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");
  const [fkClientId, setFkClientId] = useState<string>("");
  const [fkNfeId, setFkNfeId] = useState<string>("");
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
        const availableProducts = productsData.filter((product: ProductProps) => product.quantity > 0);
        setProducts(availableProducts);

        const detailsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/details`);
        const detailsData = await detailsResponse.json();
        setProductDetails(detailsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    fetchClientsAndProducts();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedProducts, productQuantities]);

  const calculateTotalPrice = () => {
    let total = 0;
    selectedProducts.forEach(productId => {
      const product = products.find(p => p.id === productId);
      const quantity = productQuantities[productId] || 0;
      if (product) {
        total += product.price * quantity;
      }
    });
    setTotalPrice(total);
  };

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
          date, total_price: totalPrice, order_type: orderType, payment_method: paymentMethod, fk_client_id: fkClientId, fk_nfe_id: nfeData.id
        }),
      });

      if (!saleOrderResponse.ok) throw new Error("Failed to create sale order");

      const saleOrderData = await saleOrderResponse.json();
      console.log(`Created sale: ${saleOrderData.id}`);

      for (const productId of selectedProducts) {
        const quantity = productQuantities[productId];
        const detailId = selectedDetails[productId];
        if (quantity > 0 && detailId) {
          const detailResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              fk_product_id: productId,
              fk_sale_order_id: saleOrderData.id,
              fk_detail_id: detailId,
              quantity: quantity
            })
          });

          if (!detailResponse.ok) throw new Error(`Failed to create detail for product ID ${productId}`);
        }
      }

      for (const productId of selectedProducts) {
        const quantity = productQuantities[productId];
        const product = products.find(p => p.id === productId);
        if (quantity > 0 && product) {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
            method: "PUT",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: product.name,
              price: product.price,
              quantity: product.quantity - quantity
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
    <div className="flex flex-col p-4 w-full h-full items-center bg-candy-purple max-h-40">
      <FormLabel labelType="createSales" />
      <div className="w-full h-full flex flex-col items-center justify-center align-center bg-white m-6 p-4 rounded-lg shadow-md mb-10">
        <form onSubmit={handleSubmit} className="w-full">
          <div className='w-full grid grid-cols-2 gap-4  align-center justify-center max-h-[70vh] overflow-auto mb-4'>
            <div>
              <label htmlFor="order_type">Tipo de Venda:</label>
              <select
                id="order_type"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>ESCOLHA O TIPO</option>
                <option value="BALCONY">Balcao</option>
                <option value="DELIVERY">Entrega</option>
              </select>
            </div>
            <div>
              <label htmlFor="fk_client_id">Cliente:</label>
              <div className="flex items-center gap-2">
                <select
                  id="fk_client_id"
                  value={fkClientId}
                  onChange={(e) => setFkClientId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
                <Link href='/client/create' className="flex bg-candy-purple rounded-md">
                  <AddCircleIcon className="text-white mx-3 my-2" />
                </Link>
              </div>

            </div>
            <div>
              <label htmlFor="payment_method">Método de Pagamento:</label>
              <select
                id="payment_method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="" disabled>ESCOLHA O MÉTODO</option>
                <option value="CASH">Dinheiro</option>
                <option value="CREDIT_CARD">Cartão de Crédito</option>
                <option value="DEBIT_CARD">Cartão de Débito</option>
                <option value="PIX">Pix</option>
              </select>
            </div>
          </div>
          <div className="py-4">
            <label htmlFor="">Produtos disponíveis em estoque</label>
            <div className="grid grid-cols-2 gap-4">
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
                  <div className="flex flex-1 justify-between">
                    <p>
                      {product.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      Preço: R$ {product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-slate-500">
                      Estoque: {product.quantity}
                    </p>
                  </div>

                  {selectedProducts.includes(product.id) && (
                    <>
                      <input
                        type="number"
                        min="0"
                        max={product.quantity}
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
                        className="ml-2 max-w-[10vw] border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
          <div className="py-4">
            <p className="text-center justify-center uppercase font-bold text-candy-purple" >Valor Total</p>
            <input
              id="total_price"
              type="number"
              value={totalPrice}
              onChange={(e) => setTotalPrice(parseFloat(e.target.value))}
              required
              disabled
              placeholder='1000.00'
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button type="submit" className="w-full justify-center py-2  border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-candy-purple hover:bg-candy-purple-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cadastrar
            </button>
          </div>
        </form >
      </div >
    </div >
  );
}
