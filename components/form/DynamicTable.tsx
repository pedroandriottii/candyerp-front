import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Supplier, Ingredient, DataItem, DynamicTableProps, ProductionProduct } from '@/interface';
import { formatValue } from '@/utils';
import { fields } from '@/fields';
import ActionColumn from './ActionColumn';

const DynamicTable: React.FC<DynamicTableProps> = ({ data, columns, basePath, onDelete, showActions = true }) => {
    const [geral, setGeral] = useState<DataItem[]>(data);
    const [filteredData, setFilteredData] = useState<DataItem[]>(data);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [productionProducts, setProductionProducts] = useState<{ [key: number]: ProductionProduct[] }>({});
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [productDetails, setProductDetails] = useState<{ [key: number]: { name: string, quantity: number } | null }>({});

    useEffect(() => {
        setGeral(data);
        setFilteredData(data);
    }, [data]);

    useEffect(() => {
        applyFilters();
    }, [filters]);

    const applyFilters = () => {
        let filtered = geral;

        Object.keys(filters).forEach(key => {
            const value = filters[key];
            if (value) {
                filtered = filtered.filter(item =>
                    item[key]?.toString().toLowerCase().includes(value.toLowerCase())
                );
            }
        });

        setFilteredData(filtered);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const fetchProductDetails = async (fkProductId: number) => {
        if (!productDetails[fkProductId]) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${fkProductId}`);
            const productData = await response.json();
            setProductDetails(prev => ({ ...prev, [fkProductId]: { name: productData.name, quantity: productData.quantity } }));
        }
    };

    const handleRowClick = async (id: number) => {
        if (expandedId === id) {
            setExpandedId(null);
            return;
        }

        const item = geral.find(item => item.id === id);
        if (item && item.fk_product_id) {
            await fetchProductDetails(item.fk_product_id);
        }

        if (!productionProducts[id]) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/production-products?productionId=${id}`);
            const productionProductsData = await response.json();
            const products = await Promise.all(productionProductsData.map(async (prodProd: ProductionProduct) => {
                const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${prodProd.fkProductId}`);
                const productData = await productResponse.json();
                return { ...prodProd, product: productData };
            }));
            setProductionProducts((prev) => ({ ...prev, [id]: products }));
        }
        setExpandedId(id);
    };

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
        event.stopPropagation();
        if (onDelete) {
            onDelete(event, id);
            setGeral(prevGeral => prevGeral.filter(item => item.id !== id));
            toast('Item excluído com sucesso!', { type: 'success' });
        }
    };

    const fetchData = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions/${expandedId}`);
        const productionData = await response.json();
        setName(productionData.name);
        setStartDate(new Date(productionData.start_date).toISOString().split("T")[0]);
        setEndDate(new Date(productionData.end_date).toISOString().split("T")[0]);
    }

    const handleCompleteProduction = async (id: number) => {
        await fetchData();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, start_date: startDate, end_date: endDate, status: "COMPLETED" })
        });

        if (response.ok) {
            const updatedProducts = productionProducts[id];

            await Promise.all(updatedProducts.map(async (prodProd) => {
                const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${prodProd.fkProductId}`);
                const productData = await productResponse.json();

                const newQuantity = productData.quantity + prodProd.quantity;

                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${prodProd.fkProductId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...productData, quantity: newQuantity })
                });
            }));

            toast('Produção completada com sucesso!', { type: 'success' });
            setGeral(prevGeral => prevGeral.map(item => item.id === id ? { ...item, status: "COMPLETED" } : item));
        } else {
            toast('Erro ao completar produção.', { type: 'error' });
        }
    };

    return (
        <table className='w-full bg-white rounded-lg p-4 shadow-sm'>
            <ToastContainer />
            <thead>
                <tr className='text-left'>
                    {columns.map((column) => (
                        <th key={column.key} className='font-bold p-2'>
                            {fields[column.key] || column.title}
                            <input
                                type="text"
                                placeholder={`Filtrar ${fields[column.key] || column.title}`}
                                value={filters[column.key] || ''}
                                onChange={(e) => handleFilterChange(column.key, e.target.value)}
                                className="mt-1 block w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                            />
                        </th>
                    ))}
                    {showActions && <th className='font-bold p-2'>Ações</th>}
                </tr>
            </thead>
            <tbody>
                {filteredData.map((item) => (
                    <React.Fragment key={item.id}>
                        <tr className="border-b cursor-pointer hover:bg-[#e3e3e3]" onClick={() => handleRowClick(item.id)}>
                            {columns.map((column) => (
                                <td key={`${item.id}-${column.key}`} className='p-2'>
                                    {formatValue(column.key, item[column.key])}
                                </td>
                            ))}
                            {showActions && (
                                <ActionColumn
                                    basePath={basePath}
                                    item={item}
                                    onDelete={handleDelete}
                                    expandedId={expandedId}
                                    handleRowClick={handleRowClick}
                                />
                            )}
                            {basePath === 'production' && (
                                <td>
                                    {item.status === "IN_PROGRESS" ? (
                                        <button
                                            className="text-white bg-green-500 hover:bg-green-700 w-full max-w-[120px] font-bold py-2 px-4 rounded"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCompleteProduction(item.id);
                                            }}
                                        >
                                            Finalizar
                                        </button>
                                    ) : (
                                        <button
                                            className="text-white bg-gray-500 cursor-not-allowed font-bold py-2 px-4 w-full max-w-[120px] rounded"
                                            disabled
                                        >
                                            Finalizada
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                        {expandedId === item.id && (
                            <tr key={`details-${item.id}`}>
                                <td colSpan={columns.length + (showActions ? 1 : 0)} className="bg-gray-100 p-4 rounded-b-2xl shadow-sm">
                                    <div className='flex items-center gap-2 w-full'>
                                        <div className='flex items-center gap-2'>
                                            <h1 className='uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-900'>Detalhes</h1>
                                        </div>
                                        <hr className="flex-grow border-none h-0.5 bg-gradient-to-r from-purple-600 to-purple-300" />
                                    </div>
                                    <div className='grid grid-cols-4'>
                                        {Object.entries(item).filter(([key]) => key in fields && key !== 'suppliers' && key !== 'ingredients' && key !== 'productionProducts').map(([key, value]) => (
                                            <div key={key} className='flex items-center shadow-sm rounded-2xl bg-candy-soft p-2 m-2'>
                                                <p className='font-bold text-sm pr-1'>{fields[key]}:</p>
                                                <p> {formatValue(key, value)}</p>
                                            </div>
                                        ))}
                                        {item.suppliers && (
                                            <div className='col-span-4'>
                                                <h2 className='font-bold'>{fields['suppliers']}:</h2>
                                                {item.suppliers.map((supplier: Supplier) => (
                                                    <div key={supplier.id} className='grid grid-cols-4 items-center shadow-sm rounded-2xl bg-candy-soft p-2 m-2'>
                                                        <p><span className='font-bold text-sm'>{fields['name']}:</span> {supplier.name}</p>
                                                        <p><span className='font-bold text-sm'>{fields['cnpj']}:</span> {supplier.cnpj}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {item.ingredients && (
                                            <div className='col-span-4'>
                                                <h2 className='font-bold'>{fields['ingredients']}:</h2>
                                                {item.ingredients.map((ingredient: Ingredient) => (
                                                    <div key={ingredient.id} className='grid grid-cols-4 items-center shadow-sm rounded-2xl bg-candy-soft p-2 m-2'>
                                                        <p> <span className='font-bold text-sm'>{fields['name']}:</span> {ingredient.name}</p>
                                                        <p> <span className='font-bold text-sm'>{fields['quantity']}:</span> {ingredient.quantity}</p>
                                                        <p> <span className='font-bold text-sm'>{fields['measurementUnit']}:</span> {fields[ingredient.measurementUnit]}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {item.fk_product_id && basePath === "products" && (
                                            <div className='col-span-4'>
                                                <h2 className='font-bold'>{fields['product']}:</h2>
                                                <div className='grid grid-cols-4 items-center shadow-sm rounded-2xl bg-candy-soft p-2 m-2'>
                                                    <p><span className='font-bold text-sm'>{fields['name']}:</span> {productDetails[item.fk_product_id]?.name || 'N/A'}</p>
                                                    <p><span className='font-bold text-sm'>{fields['quantity']}:</span> {productDetails[item.fk_product_id]?.quantity || 'N/A'}</p>
                                                </div>
                                            </div>
                                        )}
                                        {productionProducts[item.id] && basePath === 'production' && (
                                            <div className='col-span-4'>
                                                <h2 className='font-bold'>{fields['products']}:</h2>
                                                {productionProducts[item.id].filter(prodProd => prodProd.fkProductionId === item.id).map((prodProd: ProductionProduct) => (
                                                    <div key={prodProd.fkProductId} className='grid grid-cols-4 items-center shadow-sm rounded-2xl bg-candy-soft p-2 m-2'>
                                                        <p><span className='font-bold text-sm'>{fields['name']}:</span> {prodProd.product?.name || 'N/A'}</p>
                                                        <p><span className='font-bold text-sm'>{fields['quantity']}:</span> {prodProd.quantity}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default DynamicTable;
