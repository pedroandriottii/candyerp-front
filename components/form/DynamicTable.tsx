'use client';

import React from 'react';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { ColumnDefinition, DataItem, OnDeleteFunction } from '@/types/index';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


interface DynamicTableProps {
    data: DataItem[];
    columns: ColumnDefinition[];
    basePath: string;
    onDelete: OnDeleteFunction;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, columns, basePath, onDelete }) => {
    const [geral, setGeral] = React.useState(data);

    React.useEffect(() => {
        setGeral(data);
    }, [data]);


    const handleDelete = async (event: React.FormEvent, id: number) => {
        event.preventDefault();
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${basePath}s/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setGeral(prevGeral => prevGeral.filter(item => item.id !== id));
                toast('Item excluído com sucesso!', { type: 'success' });
            } else {
                toast.error('Falha ao excluir o item: ' + response.statusText)
            }
        } catch (error) {
            toast('Erro ao tentar excluir o item.', { type: 'error' })
        }
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
                    <th className='font-bold p-2'>Ações</th>
                </tr>
            </thead>
            <tbody>
                {geral.length > 0 ? (
                    geral.map((item) => (
                        <tr key={item.id} className="border-b">
                            {columns.map((column) => (
                                <td key={`${item.id}-${column.key}`} className='p-2'>
                                    {item[column.key]}
                                </td>
                            ))}
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
                                            <form onSubmit={(e) => handleDelete(e, item.id)}>
                                                <Button variant="destructive" type='submit'>
                                                    Remover
                                                </Button>
                                            </form>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length + 1}>Carregando...</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default DynamicTable;