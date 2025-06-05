import { IMPERIAL, METRIC } from "../utils/units"
// ingredients extracted and then parsed by nlp

export type MeasurementSystem = typeof IMPERIAL | typeof METRIC | null;

// export interface ExtractedIngredient {
//   description: string;
//   isGroupHeader: boolean;
//   quantity: number | null;
//   quantity2: number | null;
//   scaledQuantity?: number | null;
//   unitOfMeasure: string | null;
//   unitOfMeasureID: string | null;
//   measurementSystem: MeasurementSystem;
// }

export type ConsolidatedIngredient = {
  keyword: string;
  quantity: number;
  unitOfMeasure: string | null;
  unitOfMeasureID: string | null;
  measurementSystem: MeasurementSystem;
  additionalQuantities?: AdditionalQuantities;
}

export interface ParsedIngredient {
  keyword?: string | null;
  description: string;
  quantity: number | null;
  unitOfMeasure: string | null;
  unitOfMeasureID: string | null;
  measurementSystem: MeasurementSystem;
  isChecked: boolean;
  recipeUrl: string | null;
  recipeTitle: string;
}

export type AdditionalQuantities = Record<string, AdditionalQuantity>;

export type AdditionalQuantity = {
  quantity: number;
  unitOfMeasure: string | null;
  // description: string;
  // unitOfMeasureID: string | null;
}

export type KeywordIngredient = {
  isChecked: boolean;
  ingredients: ParsedIngredient[];
  quantity: number,
  unitOfMeasure: string | null;
  unitOfMeasureID: string | null;
  measurementSystem: MeasurementSystem;
  additionalQuantities?: AdditionalQuantities;
};

export type KeywordIngredients = {
  [keyword: string]: KeywordIngredient
}

export type Conversion = Record<string, number>;

export type ConversionOption = {
  [unit: string]: { quantity: number }
}

// export interface IngredientProportion {
//   ingredients?: ParsedIngredient[];
//   proportion?: number;
//   recipeYield?: string | null;
// }


// export type IngredientProportionObject = Record<string, IngredientProportion>;

// export interface IngredientMap {
//   [ingredient: string]: IngredientMapItem;
// }

// export interface IngredientMapItem {
//   quantity: number;
//   unit: string;
// }

// export interface IngredientCheckbox {
//   isChecked: boolean;
//   name: string;
//   listOrder: number;
//   curOrder: number;
// }
