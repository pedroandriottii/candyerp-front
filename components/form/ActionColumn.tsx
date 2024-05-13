import React from 'react';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ActionColumnProps {
  basePath: string;
  item: {
    id: number;
    [key: string]: any;
  };
  onDelete: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;
  expandedId: number | null;
  handleRowClick: (id: number) => void;
}

const ActionColumn: React.FC<ActionColumnProps> = ({ basePath, item, onDelete, expandedId, handleRowClick }) => {
  return (
    <td className='p-2 flex gap-3 items-center'>
      <Link href={`/${basePath}/${item.id}/update`} passHref>
        <span className='text-blue-500 hover:bg-[#bfd7ff] p-2 rounded-2xl'>
          <EditIcon />
        </span>
      </Link>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button onClick={(e) => e.stopPropagation()} className='text-red-500 hover:bg-[#fcb8b8] p-2 rounded-2xl'>
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
            <Button variant="destructive" onClick={(e) => onDelete(e, item.id)} type='button'>
              Remover
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {expandedId === item.id ? <ExpandLessIcon onClick={() => handleRowClick(item.id)} /> : <ExpandMoreIcon onClick={() => handleRowClick(item.id)} />}
    </td>
  );
};

export default ActionColumn;
