import { fields } from '@/fields';

export const formattedDate = (date: string): string => {
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
}

export const formatValue = (columnKey: string, value: any): string => {
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
  if (columnKey === 'order_type' || columnKey === 'payment_method') {
    return fields[value] || value;
  }
  if (columnKey === 'status') {
    return fields[value] || value;
  }

  return value;
  return value.toString();
};
