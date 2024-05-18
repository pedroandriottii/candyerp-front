import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionColumn from './ActionColumn';

interface FieldTranslations {
    [key: string]: string;
}

interface Supplier {
    id: number;
    name: string;
    cnpj: string;
}


interface Ingredient {
    id: number;
    name: string;
    quantity: number;
    measurementUnit: string;
}

interface DataItem {
    id: number;
    ingredients?: Ingredient[];
    suppliers?: Supplier[];
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
    measurementUnit: 'Unidade de Medida',
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
    suppliers: 'Fornecedores',
    ingredients: 'Ingredientes',
    KILOGRAM: 'Kg',
    GRAM: 'g',
    LITER: 'L',
    MILLILITER: 'mL',
    UNIT: 'Unidade',
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

    const formattedDate = (date: string): string => {
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }


    const formatValue = (columnKey: string, value: any): string => {
        if (value === undefined || value === null) {
            return ''
        }
        if (columnKey === "price" || columnKey === "cost" || columnKey === "total_price") {
            return `R$ ${value.toFixed(2)}`;
        }
        if (columnKey === "start_date" || columnKey === "end_date" || columnKey === "sale_date" || columnKey === "date") {
            return formattedDate(value);
        }
        if (columnKey === "measurementUnit" && value in fields) {
            return fields[value];
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
                                        {Object.entries(item).filter(([key]) => key in fields && key !== 'suppliers' && key !== 'ingredients').map(([key, value]) => (
                                            <div key={key} className='flex items-center shadow-sm rounded-2xl bg-candy-soft p-2 m-2'>
                                                <p className='font-bold text-sm pr-1'>{fields[key]}:</p>
                                                <p> {formatValue(key, value)}</p>
                                            </div>
                                        ))}
                                        {item.suppliers && (
                                            <div className='col-span-4'>
                                                <h2 className='font-bold'>Fornecedores:</h2>
                                                {item.suppliers.map((supplier: Supplier) => (
                                                    <div key={supplier.id} className='grid grid-cols-4 items-center shadow-sm rounded-2xl bg-candy-soft p-2 m-2'>
                                                        <p><span className='font-bold text-sm'>Nome:</span> {supplier.name}</p>
                                                        <p><span className='font-bold text-sm'>CNPJ:</span> {supplier.cnpj}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {item.ingredients && (
                                            <div className='col-span-4'>
                                                <h2 className='font-bold'>Ingredientes:</h2>
                                                {item.ingredients.map((ingredient: Ingredient) => (
                                                    <div key={ingredient.id} className='grid grid-cols-4 items-centershadow-sm rounded-2xl bg-candy-soft p-2 m-2'>
                                                        <p> <span className='font-bold text-sm'>Nome:</span> {ingredient.name}</p>
                                                        <p> <span className='font-bold text-sm'>Quantidade:</span> {ingredient.quantity}</p>
                                                        <p> <span className='font-bold text-sm'>Unidade de Medida:</span> {fields[ingredient.measurementUnit]}</p>
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
