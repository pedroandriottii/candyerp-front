import React from 'react';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface DataItem {
    id: number;
    [key: string]: any;  // Define additional properties dynamically
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
    const [geral, setGeral] = React.useState<DataItem[]>(data);

    React.useEffect(() => {
        setGeral(data);
    }, [data]);

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
        event.preventDefault();
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
        <table className='w-full bg-white rounded-lg p-4 shadow-sm '>
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
                {geral.length > 0 ? (
                    geral.map((item) => (
                        <tr key={item.id} className="border-b">
                            {columns.map((column) => (
                                <td key={`${item.id}-${column.key}`} className='p-2'>
                                    {formatValue(column.key, item[column.key])}
                                </td>
                            ))}
                            {showActions && (
                                <td className='p-2 flex gap-3'>
                                    <Link href={`/${basePath}/${item.id}`}>
                                        <span className='text-blue-500'>
                                            <InfoIcon />
                                        </span>
                                    </Link>
                                    <Link href={`/${basePath}/${item.id}/update`}>
                                        <span className='text-blue-500'>
                                            <EditIcon />
                                        </span>
                                    </Link>
                                    {onDelete && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className='text-red-500'><DeleteIcon /></button>
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
                                    )}
                                </td>
                            )}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length + (showActions ? 1 : 0)}>Carregando...</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DynamicTable;
