"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductDetailSaleProps, ProductProps, DetailProps, SaleProps, StatusEnum, OrderTypeEnum, PaymentMethodEnum } from "@/types";

const UpdateSaleOrder = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [status, setStatus] = useState<SaleProps["status"]>(StatusEnum.COMPLETED);
  const [orderType, setOrderType] = useState<SaleProps["orderType"]>(OrderTypeEnum.BALCONY);
  const [paymentMethod, setPaymentMethod] = useState<SaleProps["paymentMethod"]>(PaymentMethodEnum.CASH);
  const [clientId, setClientId] = useState("");
  const [nfeId, setNfeId] = useState("");
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [details, setDetails] = useState<DetailProps[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [originalProductIds, setOriginalProductIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [productDetail, setProductDetail] = useState<{ [key: number]: { quantity: number; fk_detail_id: number } }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        const productsData = await productsResponse.json();
        setProducts(productsData);

        const detailsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/details`);
        const detailsData = await detailsResponse.json();
        setDetails(detailsData);

        const saleOrderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders/${params.id}`);
        const saleOrderData = await saleOrderResponse.json();
        setDate(new Date(saleOrderData.date).toISOString().split("T")[0]);
        setTotalPrice(saleOrderData.total_price.toString());
        setStatus(saleOrderData.status);
        setOrderType(saleOrderData.order_type);
        setPaymentMethod(saleOrderData.payment_method);
        setClientId(saleOrderData.fk_client_id.toString());
        setNfeId(saleOrderData.fk_nfe_id.toString());

        const productIds = saleOrderData.productDetails.map((pd: ProductDetailSaleProps) => pd.fk_product_id);
        setSelectedProducts(productIds);
        setOriginalProductIds(productIds);
        const detailMapping: { [key: number]: { quantity: number; fk_detail_id: number } } = {};
        saleOrderData.productDetails.forEach((pd: any) => {
          detailMapping[pd.fk_product_id] = {
            quantity: pd.quantity,
            fk_detail_id: pd.fk_detail_id
          };
        });
        setProductDetail(detailMapping);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleProductDetailChange = (productId: number, field: 'quantity' | 'fk_detail_id', value: number) => {
    setProductDetail(prevDetails => ({
      ...prevDetails,
      [productId]: {
        ...prevDetails[productId],
        [field]: value
      }
    }));
  };

  const handleProductChange = (productId: number) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        const updatedDetails = { ...productDetail };
        delete updatedDetails[productId];
        setProductDetail(updatedDetails);
        return prev.filter(id => id !== productId);
      } else {
        setProductDetail(prevDetails => ({
          ...prevDetails,
          [productId]: { quantity: 0, fk_detail_id: 0 }
        }));
        return [...prev, productId];
      }
    });
  };

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const saleOrderResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sale-orders/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          total_price: parseFloat(totalPrice),
          status,
          order_type: orderType,
          payment_method: paymentMethod,
          fk_client_id: parseInt(clientId),
          fk_nfe_id: parseInt(nfeId)
        })
      });

      if (!saleOrderResponse.ok) {
        throw new Error("Failed to update sale order");
      }

      const saleOrder = await saleOrderResponse.json();
      const { id: saleOrderId } = saleOrder;

      const productsToAdd = selectedProducts.filter(id => !originalProductIds.includes(id));
      const productsToRemove = originalProductIds.filter(id => !selectedProducts.includes(id));

      const addPromises = productsToAdd.map(productId => {
        const detail = productDetail[productId];
        return fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fk_sale_order_id: saleOrderId, fk_product_id: productId, fk_detail_id: detail.fk_detail_id, quantity: detail.quantity })
        });
      });

      const deletePromises = productsToRemove.map(productId =>
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/product-detail-sales/${saleOrderId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        })
      );

      const relationResponses = await Promise.all([...addPromises, ...deletePromises]);
      const allOk = relationResponses.every(response => response && response.ok);

      if (allOk) {
        router.push("/sale");
      } else {
        throw new Error("Failed to update some product-sale relationships");
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col max-w-lg gap-4 bg-white p-4 m-6 rounded-lg shadow-md">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="totalPrice" className="block text-sm font-medium text-gray-700">Preço Total</label>
            <input
              id="totalPrice"
              value={totalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
              required
              placeholder="100.00"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as SaleProps["status"])}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
            </select>
          </div>
          <div>
            <label htmlFor="orderType" className="block text-sm font-medium text-gray-700">Tipo de Pedido</label>
            <select
              id="orderType"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value as SaleProps["orderType"])}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="BALCONY">Balcony</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>
          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">Método de Pagamento</label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as SaleProps["paymentMethod"])}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="CASH">Cash</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="PIX">PIX</option>
            </select>
          </div>
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">ID do Cliente</label>
            <input
              id="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              placeholder="123"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="nfeId" className="block text-sm font-medium text-gray-700">ID da NFe</label>
            <input
              id="nfeId"
              value={nfeId}
              onChange={(e) => setNfeId(e.target.value)}
              required
              placeholder="456"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Produtos</label>
            {products.map(product => (
              <div key={product.id} className="flex gap-2 p-2 items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-candy-purple focus:ring-candy-purple-dark border-gray-300 rounded"
                    checked={selectedProducts.includes(product.id)}
                    onChange={() => handleProductChange(product.id)}
                  />
                  {product.name}
                </label>
                {selectedProducts.includes(product.id) && (
                  <>
                    <input
                      type="number"
                      className="flex py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      value={productDetail[product.id]?.quantity || ''}
                      onChange={e => handleProductDetailChange(product.id, 'quantity', parseFloat(e.target.value))}
                      min="0"
                      step="0.1"
                    />
                    <select
                      value={productDetail[product.id]?.fk_detail_id || ''}
                      onChange={e => handleProductDetailChange(product.id, 'fk_detail_id', parseInt(e.target.value))}
                      className="flex py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="" disabled>Escolha um Detalhe</option>
                      {details.map(detail => (
                        <option key={detail.id} value={detail.id}>{detail.description}</option>
                      ))}
                    </select>
                  </>
                )}
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

export default UpdateSaleOrder;
