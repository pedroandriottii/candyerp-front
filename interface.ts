export interface FieldTranslations {
  [key: string]: string;
}

export interface Supplier {
  id: number;
  name: string;
  cnpj: string;
}

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  measurementUnit: string;
}

export interface Product {
  id: number;
  name: string;
  quantity: number;
}

export interface ProductionProduct {
  quantity: number;
  fkProductId: number;
  fkProductionId: number;
  product?: Product;
}

export interface DataItem {
  id: number;
  ingredients?: Ingredient[];
  suppliers?: Supplier[];
  productionProducts?: ProductionProduct[];
  [key: string]: any;
}

export interface ColumnDefinition {
  key: string;
  title: string;
}

export interface DynamicTableProps {
  data: DataItem[];
  columns: ColumnDefinition[];
  basePath: string;
  onDelete?: (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;
  showActions?: boolean;
}

export interface ProductDetail {
  fkProductId: number;
  fkDetailId: number;
  fkSaleOrderId: number;
  quantity: number;
  productName: string;
  productPrice: number;
}
