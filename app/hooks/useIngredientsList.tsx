import { useEffect, useState } from "react"
import { KeywordIngredients, IngredientProportionObject, ParsedIngredient } from "../interfaces/ingredient";
import { parseIngredient } from "parse-ingredient";
import { Recipe } from "../interfaces/recipe";
import { IMPERIAL_UNITS, IMPERIAL, METRIC_UNITS, METRIC, getValue } from "../utils/ingredients";

const INGREDIENT_KEYWORDS_TO_REMOVE = new Set([
  "or", "black", "white", "red", "yellow", "green", "freshly", "ground", "kosher", "fresh", "frozen", "dried", "canned", "bottled", "packaged", "pre-cooked", "pre-chopped", "pre-sliced", "pre-peeled", "pre-washed", "pre-rinsed", "pre-cooked", "pre-chopped", "pre-sliced", "pre-peeled", "pre-washed", "pre-rinsed", "bunch"
]);

const getIngredientKeyword = (ingredient: string): string => {
  return ingredient
    .replace(/ *\([^)]*\) */g, "")
    .split(" ")
    .filter(word => word && !INGREDIENT_KEYWORDS_TO_REMOVE.has(word))
    .join(" ");
};

const useIngredientsList = () => {
  const [ingredientProportionMap, setIngredientProportionMap] = useState<IngredientProportionObject>({});
  const [ingredients, setIngredients] = useState<KeywordIngredients>({});
  const [keywordsMap, setKeywordsMap] = useState<KeywordIngredients>({});
  // const keywordsMap = useMemo(() => new Map(), []);

  // TODO: should be renamed to something else -> this function gets extracted ing and transforms it to parsedIngredient. It also sets up keyword map while looping through extracted ingredients
  const labelMeasurementSystem = (recipeData: Recipe) => {
    const recipeIng: string[] = recipeData?.recipeIngredient || [];
    const parsedIngredients: ParsedIngredient[] = [];

    for (let ind = 0; ind < recipeIng.length; ind++) {
      try {
        const parsed = parseIngredient(recipeIng[ind])[0];
        if (!parsed) continue;

        const keyword = getIngredientKeyword(parsed.description);
        const recipeUrl = recipeData.url;

        let unitOfMeasureType: 'imperial' | 'metric' | null = null;
        if (IMPERIAL_UNITS[parsed.unitOfMeasureID || ""]) {
          unitOfMeasureType = IMPERIAL;
        } else if (METRIC_UNITS[parsed.unitOfMeasureID || ""]) {
          unitOfMeasureType = METRIC;
        }

        const transformed: ParsedIngredient = {
          recipeUrl,
          description: parsed.description,
          quantity: Number(parsed.quantity),
          unitOfMeasure: parsed.unitOfMeasure,
          unitOfMeasureID: parsed.unitOfMeasureID,
          isChecked: false,
          origOrder: ind,
          curOrder: ind,
          keyword,
          unitOfMeasureType: unitOfMeasureType || undefined
        };

        parsedIngredients.push(transformed);
        const existingIngredients = keywordsMap[keyword] || [];
        setKeywordsMap({ ...keywordsMap, [keyword]: [...existingIngredients, transformed] })

      } catch (error) {
        console.error('Error parsing ingredient:', error, recipeIng[ind]);
      }
    }

    const recipeYield = typeof recipeData?.recipeYield === 'string' ? getValue(recipeData.recipeYield) : 0;

    return {
      proportion: 1,
      recipeYield,
      ingredients: parsedIngredients,
    };
  };

  /**
   * returns the list of ingredients unders shopping list
   */
  useEffect(() => {
    // takes the ingredient object (ingredientProportionMap) and turns it into a list that's sorted, filtered and grouped by same ingredients
    // whenever ingredientProportionMap gets updated, re-sort/filter/group the ingredient list

    // const updateIngredientList = () => {
    //   try {

    // const condensedIngredients = Object.entries(keywordsMap).reduce((acc, [, ingredient]) => {



    // }, {});

    // console.log("condensedIngredients", condensedIngredients);

    // const updatedIngObj: IngredientMap = Object.entries(ingredientProportionMap).reduce((acc, [, ingredient]) => {
    //   const ingredientsMap: IngredientMap = {};

    //   console.log("ingredient", ingredient);

    //   ingredient.ingredients?.forEach((ing) => {
    //     if (ing.quantity === 0) return;

    //     const currentIng = acc[ing.description];
    //     const ingAmt = {
    //       quantity: ing.quantity || 0,
    //       unit: ing.unitOfMeasure || ""
    //     };

    //     if (currentIng) {
    //       if (ingAmt.unit === currentIng.unit) {
    //         ingAmt.quantity += currentIng.quantity;
    //       }
    //       // TODO: Implement unit conversion for different units
    //     }

    //     ingredientsMap[ing.description] = ingAmt;
    //   });

    //   return { ...acc, ...ingredientsMap };
    // }, {} as IngredientMap);

    // const ingArr = Object.entries(updatedIngObj).map(([name, details], index) => ({
    //   name: `${details.quantity === 0 ? "" : details.quantity + " "}${details.unit + " "}${name}`.trim(),
    //   isChecked: false,
    //   listOrder: index,
    //   curOrder: index
    // }));

    // setIngredients(keywordsMap);
    // } catch (error) {
    //   console.error('Error updating ingredient list:', error);
    // }
    // };

    // updateIngredientList();
  }, [keywordsMap]);

  // useEffect(() => {
  //   console.log("keywordsMap", keywordsMap);
  // }, [keywordsMap]);

  return {
    labelMeasurementSystem,
    ingredientProportionMap,
    setIngredientProportionMap,
    ingredients,
    setIngredients,
    keywordsMap,
    setKeywordsMap
  }
}

export default useIngredientsList;