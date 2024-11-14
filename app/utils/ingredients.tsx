export const retrieveRecipe = async (url: string) => {
  try {
    const response = await fetch(`/api/recipe?url=${url}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('Error fetching recipe from site', err);
  }
}
export const getValue = (p: string | string[] | undefined) => {
  if (!p) return null;
  return Array.isArray(p) ? p[0] : p
}

// converts from unit1 to unit2
// export const unitConverter = (
//   amt1: number,
//   unit1: Measurement,
//   amt2: number,
//   unit2: Measurement
// ) => {
//   console.log(UNIT_OF_MEASUREMENTS[unit2], amt1, amt2, unit1, unit2);
//   return null;
// }


// export const getMeasurementValue = (key: Measurement) => {
//   return UNIT_OF_MEASUREMENTS[key]
// }


// const UNIT_OF_MEASUREMENTS: UnitOfMeasurements = {
//   teaspoon: {
//     mililiter: {
//       quantity: 5
//     }
//   },
//   tablespoon: {
//     teaspoon: {
//       quantity: 3
//     },
//     mililiter: {
//       quantity: 15
//     }
//   },
//   cup: {
//     "fluid ounce": {
//       quantity: 8
//     },
//     tablespoon: {
//       quantity: 16
//     },
//     mililiter: {
//       quantity: 250
//     }
//   },
//   pint: {
//     cup: {
//       quantity: 2
//     },
//     "fluid ounce": {
//       quantity: 16
//     },
//     tablespoon: {
//       quantity: 32
//     },
//     mililiter: {
//       quantity: 500
//     }
//   },
//   quart: {
//     pint: {
//       quantity: 2
//     },
//     cup: {
//       quantity: 4
//     },
//     "fluid ounce": {
//       quantity: 32
//     },
//     tablespoon: {
//       quantity: 64
//     },
//     mililiter: {
//       quantity: 946.353
//     },
//     liter: {
//       quantity: 1.1
//     }
//   },
//   gallon: {
//     quart: {
//       quantity: 4
//     },
//     pint: {
//       quantity: 8
//     },
//     cup: {
//       quantity: 16
//     },
//     "fluid ounce": {
//       quantity: 128
//     },
//     tablespoon: {
//       quantity: 256
//     },
//     mililiter: {
//       quantity: 3785.41
//     },
//     liter: {
//       quantity: 3.78541
//     }
//   },
//   ounce: {
//     gram: {
//       quantity: 28
//     }
//   },
//   "fluid ounce": {
//     tablespoon: {
//       quantity: 2
//     },
//     cups: {
//       quantity: 0.125
//     },
//     mililiter: {
//       quantity: 30
//     }
//   },
//   pound: {
//     ounce: {
//       quantity: 16
//     },
//     gram: {
//       quantity: 450
//     }
//   }
// }

// export type Measurements = Record<string, number>;
// export type ParentMeasurement = Record<string, Measurements>;
// export interface UnitOfMeasurements {
//   teaspoon: Measurements | ParentMeasurement;
//   tablespoon: Measurements | ParentMeasurement;
//   cup: Measurements | ParentMeasurement;
//   pint: Measurements | ParentMeasurement;
//   quart: Measurements | ParentMeasurement;
//   gallon: Measurements | ParentMeasurement;
//   ounce: Measurements | ParentMeasurement;
//   "fluid ounce": Measurements | ParentMeasurement;
//   pound: Measurements | ParentMeasurement;
// }

// type Measurement = keyof UnitOfMeasurements;