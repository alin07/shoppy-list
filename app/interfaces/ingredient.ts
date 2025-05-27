export interface ParsedIngredient {
  recipeUrl: string;
  description: string;
  quantity: number;
  unitOfMeasure?: string | null;
  unitOfMeasureID?: string | null;
  isChecked: boolean;
  origOrder: number;
  curOrder: number;
  keyword: string;
  unitOfMeasureType?: 'imperial' | 'metric';
}

export interface IngredientCheckbox {
  name: string;
  isChecked: boolean;
  listOrder: number;
  curOrder: number;
}

export interface IngredientAmount {
  quantity: number;
  unit: string;
}

export interface IngredientMap {
  [key: string]: IngredientAmount;
}

export interface IngredientProportion {
  proportion: number;
  recipeYield: number;
  ingredients: ParsedIngredient[];
}

export interface IngredientProportionObject {
  [key: string]: IngredientProportion;
} 