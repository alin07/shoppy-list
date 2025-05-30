import { Conversion } from "../interfaces/ingredient";

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

// export const getValue = (p: string | string[] | undefined) => {
//   if (!p) return null;
//   return Array.isArray(p) ? p[0] : p;
// };

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

export const UNIT_CONVERSIONS: Record<string, Conversion> = {
  teaspoon: {
    tablespoon: 1 / 3,
    cup: 1 / 48,
    pint: 1 / 96,
    quart: 1 / 192,
    gallon: 1 / 768,
    milliliter: 1 / 4.929,
    liter: 1 / 202.9
  },
  tablespoon: {
    teaspoon: 3,
    cup: 1 / 16,
    pint: 1 / 32,
    quart: 1 / 64,
    gallon: 1 / 256,
    milliliter: 14.787,
    liter: 1 / 67.628
  },
  cup: {
    teaspoon: 48.692,
    tablespoon: 16.231,
    pint: 1 / 1.972,
    quart: 1 / 3.943,
    gallon: 1 / 15.772,
    milliliter: 240,
    liter: 1 / 4.167
  },
  pint: {
    teaspoon: 96,
    tablespoon: 32,
    cup: 1.972,
    quart: 1 / 2,
    gallon: 1 / 8,
    milliliter: 473.2,
    liter: 1 / 2.113
  },
  quart: {
    teaspoon: 192,
    tablespoon: 64,
    cup: 3.943,
    pint: 2,
    gallon: 1 / 4,
    milliliter: 946.4,
    liter: 1 / 1.057
  },
  gallon: {
    teaspoon: 768,
    tablespoon: 256,
    cup: 128,
    pint: 8,
    quart: 4,
    milliliter: 3785,
    liter: 3.785
  },
  milliliter: {
    teaspoon: 1 / 4.929,
    tablespoon: 1 / 14.787,
    cup: 1 / 240,
    pint: 1 / 473.2,
    quart: 1 / 946.4,
    gallon: 1 / 3785,
    liter: 1 / 1000
  },
  liter: {
    teaspoon: 202.9,
    tablespoon: 67.628,
    cup: 4.167,
    pint: 2.113,
    quart: 1.057,
    gallon: 3.785,
    milliliter: 1000
  },
  ounce: {
    pound: 1 / 16,
    milligram: 28350,
    gram: 28.35,
    kilogram: 35.274
  },
  pound: {
    ounce: 16,
    milligram: 453600,
    gram: 453.6,
    kilogram: 1 / 2.205
  },
  milligram: {
    ounce: 28350,
    pound: 453600,
    gram: 1000,
    kilogram: 1e+6
  },
  gram: {
    ounce: 1 / 28.35,
    pound: 453.6,
    milligram: 1000,
    kilogram: 1 / 1000
  },
  kilogram: {
    ounce: 35.274,
    pound: 2.205,
    milligram: 1e+6,
    gram: 1000
  }
};

export function convertToAllUnits(
  quantity: number | null,
  fromUnit: string | null,
  toUnit: string | null
): number | null {

  if (!quantity || !fromUnit || !toUnit) return null;

  const fromDef = UNIT_CONVERSIONS[fromUnit], toDef = UNIT_CONVERSIONS[toUnit];

  if (!fromDef || !toDef) {
    console.warn(`Unsupported conversion input: ${fromUnit} to ${toUnit}`);
    return null;
  }
  return parseFloat((quantity * UNIT_CONVERSIONS[fromUnit][toUnit]).toFixed(2));
}
