import React from 'react';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import { ColumnDefinition, DataItem, OnDeleteFunction } from '@/types/index';

interface DynamicTableProps {
    data: DataItem[];
    columns: ColumnDefinition[];
    basePath: string;
    onDelete: OnDeleteFunction;
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data, columns, basePath, onDelete }) => {
    return (
        <table className='w-full bg-white rounded-lg p-4 shadow-sm'>
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
                {data.length > 0 ? (
                    data.map((item) => (
                        <tr key={item.id} className="border-b">
                            {columns.map((column) => (
                                <td key={`${item.id}-${column.key}`} className='p-2'>
                                    {item[column.key]}
                                </td>
                            ))}
                            <td className='p-2 flex gap-3'>
                                <Link href={`/${basePath}/${item.id}`}>
                                    <InfoIcon />
                                </Link>
                                <Link href={`/${basePath}/${item.id}/update`}>
                                    <EditIcon />
                                </Link>
                                <button className='text-red-500' onClick={(event) => onDelete(event, item.id)}>
                                    <DeleteIcon />
                                </button>
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
