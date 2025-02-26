import { useEffect, useState } from "react"
import { IngredientCheckbox, IngredientMap, IngredientProportion, IngredientProportionObject, ParsedIngredient } from "../interfaces/ingredient";
import { parseIngredient } from "parse-ingredient";
import { Recipe } from "../interfaces/recipe";
import { IMPERIAL_UNITS, IMPERIAL, METRIC_UNITS, METRIC, getValue } from "../utils/ingredients";

const useIngredientsList = () => {
  const [ingredientProportionMap, setIngredientProportionMap] = useState<IngredientProportionObject>({});
  const [ingredients, setIngredients] = useState<IngredientCheckbox[]>([]);


  const labelMeasurementSystem = (recipeData: Recipe) => {
    const recipeIng: string[] = recipeData?.recipeIngredient || [];
    let parsedIngredients: ParsedIngredient[] = [];

    for (const ing in recipeIng) {
      try {
        let unitOfMeasureType = null;
        const parsed: ParsedIngredient = parseIngredient(recipeIng[ing])[0];

        if (parsed && !parsed.unitOfMeasureType) {
          if (IMPERIAL_UNITS[parsed.unitOfMeasureID || ""]) {
            unitOfMeasureType = IMPERIAL;
          } else if (METRIC_UNITS[parsed.unitOfMeasureID || ""]) {
            unitOfMeasureType = METRIC;
          }
          parsed.unitOfMeasureType = unitOfMeasureType;

          parsedIngredients = [...parsedIngredients, parsed];
        }
      } catch (e) {
        console.error(e, recipeIng[ing]);
      }
    }
    const recipeYield = getValue(recipeData?.recipeYield);

    return {
      proportion: 1,
      recipeYield: recipeYield,
      ingredients: [...parsedIngredients],
    };
  };

  useEffect(() => {
    // takes the ingredient object (ingredientProportionMap) and turns it into a list that's sorted, filtered and grouped by same ingredients
    // whenever ingredientProportionMap gets updated, re-sort/filter/group the ingredient list
    const updateIngredientList = () => {
      const updatedIngObj: IngredientMap = Object.entries(ingredientProportionMap).reduce((acc, curVal) => {
        const ingObj: IngredientProportion = curVal[1];
        let ings = {};

        ingObj.ingredients?.forEach((i) => {
          const curIngs = (acc as IngredientMap)[i.description];
          // if scaling set to x0, the ingredient amount is 0. In this case, don't add the ingredient to the list.
          if (i.quantity === 0) return acc;

          let ingAmt = {
            quantity: i.quantity || 0,
            unit: i.unitOfMeasure || ""
          }
          if (curIngs) {
            if (ingAmt.unit === curIngs.unit) {
              ingAmt = {
                ...ingAmt,
                quantity: ingAmt.quantity + curIngs.quantity
              }
            }
            else { // units don't match so we'll try to match it
              // unitConverter(curIngs.quantity, curIngs.unit, ingAmt.quantity, ingAmt.unit)
              // let's just use imperial unit for now

            }
          }
          ings = {
            ...ings,
            [i.description]: ingAmt
          }

        });
        return { ...acc, ...ings };
      }, {});

      const ingArr = Object.keys(updatedIngObj).map((ing, index) =>
      ({
        name: `${updatedIngObj[ing].quantity === 0
          ? ""
          : updatedIngObj[ing].quantity + " "}${updatedIngObj[ing].unit + " "}${ing}`
          .trim(),
        isChecked: false,
        listOrder: index,
        curOrder: index
      }));
      setIngredients(ingArr);
    }

    updateIngredientList();

  }, [ingredientProportionMap]);

  return {
    labelMeasurementSystem,
    ingredientProportionMap,
    setIngredientProportionMap,
    ingredients,
    setIngredients
  }
}

export default useIngredientsList;