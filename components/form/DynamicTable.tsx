import React, { useState } from 'react';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface FieldTranslations {
    [key: string]: string;

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

const DynamicTable: React.FC<DynamicTableProps> = ({ data, columns, basePath, onDelete, showActions = true }) => {
    const [geral, setGeral] = useState<DataItem[]>(data);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    React.useEffect(() => {
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
                    <>
                        <tr key={item.id} className="border-b cursor-pointer" onClick={() => handleRowClick(item.id)}>
                            {columns.map((column) => (
                                <td key={`${item.id}-${column.key}`} className='p-2'>
                                    {formatValue(column.key, item[column.key])}
                                </td>
                            ))}
                            {showActions && (
                                <td className='p-2 flex gap-3'>
                                    <Link href={`/${basePath}/${item.id}`}>

                                    </Link>
                                    <Link href={`/${basePath}/${item.id}/update`}>
                                        <span className='text-blue-500'>
                                            <EditIcon />
                                        </span>
                                    </Link>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button onClick={(e) => e.stopPropagation()} className='text-red-500'>
                                                <DeleteIcon />
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Esta ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <Button variant="destructive" onClick={(e) => handleDelete(e, item.id)} type='button'>
                                                    Remover
                                                </Button>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    {expandedId ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </td>
                            )}
                        </tr>
                        {expandedId === item.id && (
                            <tr key={`details-${item.id}`}>
                                <td colSpan={columns.length + (showActions ? 1 : 0)} className="bg-gray-100 p-4 rounded-b-2xl shadow-sm">
                                    <col className='flex items-center gap-2 w-full'>
                                        <col className='flex items-center gap-2'>
                                            <span className='text-candy-purple text-sm'>
                                                <InfoIcon />
                                            </span>
                                            <h1 className='uppercase font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-purple-900'>Detalhes</h1>
                                        </col>
                                        <hr className="flex-grow border-none h-0.5 bg-gradient-to-r from-purple-600 to-purple-300" />
                                    </col>

                                    <col className='grid grid-cols-4 gap-4'>
                                        {Object.entries(item).filter(([key]) => key in fields).map(([key, value]) => (
                                            <col key={key} className='flex justify-between items-center shadow-sm rounded-2xl bg-candy-soft p-2 m-2 '>
                                                <p className='font-bold'>{fields[key]}:</p>
                                                <p>{formatValue(key, value)}</p>
                                            </col>
                                        ))}
                                    </col>
                                </td>
                            </tr>
                        )}
                    </>
                ))}
            </tbody>
        </table>
    );
};

export default DynamicTable;
