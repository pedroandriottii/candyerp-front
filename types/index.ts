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

export interface IngredientProps {
  id: number;
  name: string;
  measurement_unit: MeasurementUnit;
  quantity: number;
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
  start_date: Date;
  end_date: Date;
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