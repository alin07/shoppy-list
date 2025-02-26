export interface ParsedIngredient {
  description: string;
  isGroupHeader: boolean;
  quantity: number | null;
  quantity2: number | null;
  scaledQuantity?: number | null;
  unitOfMeasure: string | null;
  unitOfMeasureID: string | null;
  unitOfMeasureType?: string | null;
}

export interface IngredientProportion {
  ingredients?: ParsedIngredient[];
  proportion?: number;
  recipeYield?: string | null;
}

export type IngredientProportionObject = Record<string, IngredientProportion>;

export interface IngredientMap {
  [ingredient: string]: IngredientMapItem;
}

export interface IngredientMapItem {
  quantity: number;
  unit: string;
}

export interface IngredientCheckbox {
  isChecked: boolean;
  name: string;
  listOrder: number;
  curOrder: number;
}
