import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DataItem, DynamicTableProps } from '@/interface';
import { formatValue } from '@/utils';
import { fields } from '@/fields';
import ActionColumn from './ActionColumn';
import { useRouter } from 'next/navigation';

const DynamicTable: React.FC<DynamicTableProps> = ({ data, columns, basePath, onDelete, showActions = true }) => {
    const [geral, setGeral] = useState<DataItem[]>(data);
    const [filteredData, setFilteredData] = useState<DataItem[]>(data);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const router = useRouter();
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

    const handleFatiarProduto = (id: number) => {
        router.push(`/product/${id}/fatiar`);
    };


    const handleRowClick = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
        event.stopPropagation();
        if (onDelete) {
            onDelete(event, id);
            setGeral(prevGeral => prevGeral.filter(item => item.id !== id));
            toast('Item excluído com sucesso!', { type: 'success' });
        }
    };

    const handleCompleteProduction = async (id: number) => {
        const production = geral.find(item => item.id === id);
        if (!production) return;

        const { name, start_date, end_date } = production;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/productions/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, start_date, end_date, status: "COMPLETED" })
        });

        if (response.ok) {
            toast('Produção completada com sucesso!', { type: 'success' });
            setGeral(prevGeral => prevGeral.map(item => item.id === id ? { ...item, status: "COMPLETED" } : item));

            const productionProductsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/production-products?fkProductionId=${id}`);
            const productionProducts = await productionProductsResponse.json();

            await Promise.all(productionProducts.map(async (prodProd: { fkProductId: number, quantity: number }) => {
                const productResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${prodProd.fkProductId}`);
                const productData = await productResponse.json();

                const updatedQuantity = productData.quantity + prodProd.quantity;

                const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${prodProd.fkProductId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...productData, quantity: updatedQuantity })
                });
            }));
        } else {
            toast('Erro ao completar produção.', { type: 'error' });
        }
    };

    return (
        <div className="overflow-auto">
            <table className='w-full bg-white rounded-lg p-4 shadow-sm'>
                <ToastContainer />
                <thead className="sticky top-0 bg-white">
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
                                {
                                    basePath === 'product' && item.fk_product_id == null && item.quantity != 0 && (
                                        <td>
                                            <button
                                                className='text-white bg-green-500 hover:bg-green-700 w-full max-w-[120px] font-bold py-2 px-4 rounded'
                                                onClick={() => handleFatiarProduto(item.id)}
                                            >
                                                Fatiar
                                            </button>
                                        </td>
                                    )
                                }
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DynamicTable;
