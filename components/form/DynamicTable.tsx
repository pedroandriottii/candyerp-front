import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionColumn from './ActionColumn';

interface FieldTranslations {
    [key: string]: string;
}

interface DataItem {
    id: number;
    [key: string]: any;
}

interface ColumnDefinition {
    key: string;
    title: string;
}

interface DynamicTableProps {
    data: DataItem[];
    columns: ColumnDefinition[];
    basePath: string;
    onDelete?: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;
    showActions?: boolean;
}

const fields: FieldTranslations = {
    name: 'Nome',
    quantity: 'Quantidade',
    cost: 'Custo',
    price: 'Preço',
    total_price: 'Preço Total',
    measurement_unit: 'Unidade de Medida',
    start_date: 'Data de Início',
    end_date: 'Data de Fim',
    status: 'Status',
    payment_method: 'Método de Pagamento',
    order_type: 'Tipo de Pedido',
    sale_date: 'Data de Venda',
    street: 'Rua',
    number: 'Número',
    neighborhood: 'Bairro',
    complement: 'Complemento',
    cnpj: 'CNPJ',
}

const formattedDate = (date: string): string => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, columns, basePath, onDelete, showActions = true }) => {
    const [geral, setGeral] = useState<DataItem[]>(data);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        setGeral(data);
    }, [data]);

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

    const formatValue = (columnKey: string, value: any): string => {
        if (columnKey === "price" || columnKey === "cost" || columnKey === "total_price") {
            return `R$ ${value.toFixed(2)}`;
        }
        if (columnKey === "start_date" || columnKey === "end_date" || columnKey === "sale_date") {
            return formattedDate(value);
        }
        return value.toString();
    };

    return (
        <table className='w-full bg-white rounded-lg p-4 shadow-sm'>
            <ToastContainer />
            <thead>
                <tr className='text-left'>
                    {columns.map((column) => (
                        <th key={column.key} className='font-bold p-2'>
                            {column.title}
                        </th>
                    ))}
                    {showActions && <th className='font-bold p-2'>Ações</th>}
                </tr>
            </thead>
            <tbody>
                {geral.map((item) => (
                    <React.Fragment key={item.id}>
                        <tr className="border-b cursor-pointer" onClick={() => handleRowClick(item.id)}>
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

                                    <div className='grid grid-cols-4 gap-4'>
                                        {Object.entries(item).filter(([key]) => key in fields).map(([key, value]) => (
                                            <div key={key} className='flex justify-between items-center shadow-sm rounded-2xl bg-candy-soft p-2 m-2'>
                                                <p className='font-bold'>{fields[key]}:</p>
                                                <p>{formatValue(key, value)}</p>
                                            </div>
                                        ))}
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
