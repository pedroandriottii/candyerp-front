export interface SupplierProps {
  id: number;
  name: string;
  cnpj: string;
}
export enum MeasurementUnit {
  GRAM = "GRAM",
  KILOGRAM = "KILOGRAM",
  LITER = "LITER",
  MILLILITER = "MILLILITER",
  UNIT = "UNIT"
}

export interface DetailProps {
  id: number;
  description: string;
  additional_value: number;
}

export interface IngredientProps {
  id: number;
  name: string;
  measurementUnit: MeasurementUnit;
  quantity: number;
  cost: number;
}

export interface ProductProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface ClientProps {
  id: number;
  name: string;
  street: string;
  number: string;
  neighborhood: string;
  complement: string;
}

export interface ProductionProps {
  id: number;
  start_date: Date | string;
  end_date: Date | string;
}

export enum StatusEnum {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED"
}

export enum OrderTypeEnum {
  BALCONY = "BALCONY",
  DELIVERY = "DELIVERY"
}

export enum PaymentMethodEnum {
  CASH = "CASH",
  DEBIT_CARD = "DEBIT_CARD",
  CREDIT_CARD = "CREDIT_CARD",
  PIX = "PIX"
}

export interface SaleProps {
  id: number;
  total: number;
  status: StatusEnum;
  orderType: OrderTypeEnum;
  paymentMethod: PaymentMethodEnum;
}

export interface ColumnDefinition {
  key: string;
  title: string;
  path?: string;
}

export interface DataItem {
  id: number;
  [key: string]: any;
}

export interface DetailProps {
  id: number;
  description: string;
  additional_value: number;
}

export interface ProductDetailSaleProps {
  id: number;
  quantity: number;
  fk_product_id: number;
  fk_sale_order_id: number;
  fk_detail_id: number;
}

export type OnDeleteFunction = (event: React.MouseEvent<HTMLButtonElement>, id: number) => void;