import { UnitDefinition } from "../interfaces/ingredient";

export const retrieveRecipe = async (url: string) => {
  try {
    const response = await fetch(`/api/recipe?url=${url}`);
    const data = await response.json();
    return data;
  } catch (err: unknown) {
    console.error("Error fetching recipe from site", err);
    throw new Error((err as Error).message);
  }
};

export const getValue = (p: string | string[] | undefined) => {
  if (!p) return null;
  return Array.isArray(p) ? p[0] : p;
};

export const IMPERIAL = "imperial";
export const METRIC = "metric";

export const IMPERIAL_UNITS: Record<string, boolean> = {
  // weight
  ounce: true,
  pound: true,
  // capacity
  pint: true,
  quart: true,
  gallon: true,
  cup: true,
  tablespoon: true,
  teaspoon: true,
};

export const METRIC_UNITS: Record<string, boolean> = {
  // capacity
  liter: true,
  milliliter: true,
  // mass
  gram: true,
  milligram: true,
  kilogram: true,
};


export const UNIT_DEFINITIONS: Record<string, UnitDefinition> = {
  // Volume (base: milliliter)
  teaspoon: { type: "volume", toBase: 4.92892, fromBase: 1 / 4.92892 },
  tablespoon: { type: "volume", toBase: 14.7868, fromBase: 1 / 14.7868 },
  cup: { type: "volume", toBase: 240, fromBase: 1 / 240 },
  pint: { type: "volume", toBase: 473.176, fromBase: 1 / 473.176 },
  quart: { type: "volume", toBase: 946.353, fromBase: 1 / 946.353 },
  gallon: { type: "volume", toBase: 3785.41, fromBase: 1 / 3785.41 },
  milliliter: { type: "volume", toBase: 1, fromBase: 1 },
  liter: { type: "volume", toBase: 1000, fromBase: 1 / 1000 },

  // Mass (base: gram)
  ounce: { type: "mass", toBase: 28.3495, fromBase: 1 / 28.3495 },
  pound: { type: "mass", toBase: 453.592, fromBase: 1 / 453.592 },
  milligram: { type: "mass", toBase: 0.001, fromBase: 1 / 0.001 },
  gram: { type: "mass", toBase: 1, fromBase: 1 },
  kilogram: { type: "mass", toBase: 1000, fromBase: 1 / 1000 },
};

/**
 * Converts a quantity from one unit into another unit (mass or volume).
 */
export function convertToAllUnits(
  quantity: number | null,
  fromUnit: string | null,
  toUnit: string | null
): number | null {

  if (!quantity || !fromUnit || toUnit) return null;

  const fromDef = UNIT_DEFINITIONS[fromUnit], toDef = UNIT_DEFINITIONS[toUnit];

  if (!fromDef || !toDef) {
    console.warn(`Unsupported conversion input: ${fromUnit} to ${toUnit}`);
    return null;
  }

  const baseQuantity = quantity * fromDef.toBase;
  const converted = baseQuantity * toDef.fromBase;
  return parseFloat(converted.toFixed(2));
}
