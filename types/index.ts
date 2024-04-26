export interface SupplierProps {
  id: number;
  name: string;
  cnpj: string;
}
enum MeasurementUnit {
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
