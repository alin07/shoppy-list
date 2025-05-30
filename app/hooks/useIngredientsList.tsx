import { useState } from "react"
import { KeywordIngredients, KeywordIngredient, IngredientProportionObject, ParsedIngredient, ConsolidatedIngredient } from "../interfaces/ingredient";
import { parseIngredient } from "parse-ingredient";
import { Recipe } from "../interfaces/recipe";
import { IMPERIAL_UNITS, IMPERIAL, METRIC_UNITS, METRIC, convertToAllUnits } from "../utils/ingredients";


const INGREDIENT_KEYWORDS_TO_REMOVE = new Set([
  // "black", "white", "red", "yellow", "green",
  "minced", "smashed", "extra-virgin", "extra", "virgin",
  "freshly", "ground", "kosher", "fresh", "frozen", "dried", "canned", "bottled", "packaged", "pre-cooked", "pre-chopped", "pre-sliced", "pre-peeled", "pre-washed", "pre-rinsed", "pre-cooked", "pre-chopped", "pre-sliced", "pre-peeled", "pre-washed", "pre-rinsed", "bunch", "roughly", "cooked", "chopped", "sliced", "peeled", "washed", "rinsed", "cooked", "chopped", "sliced", "peeled", "washed", "rinsed", "for", "serving", "to serve"
]);
const KEYWORD_ENDINGS_TO_REMOVE = new Set([
  "and", "or"
]);

const getIngredientKeyword = (ingredient: string): string => {
  const ing =
    ingredient
      .replace(/ *\([^)]*\) */g, "")
      .split(" ")
      .map(i => i.replace(/^\s*,+\s*|\s*,+\s*$/g, ''))
      .filter(word => word && !INGREDIENT_KEYWORDS_TO_REMOVE.has(word.toLowerCase()));

  if (KEYWORD_ENDINGS_TO_REMOVE.has(ing[ing.length - 1])) {
    ing.pop();
  }
  return ing.join(" ");
};

const useIngredientsList = () => {
  const [ingredientProportionMap, setIngredientProportionMap] = useState<IngredientProportionObject>({});
  const [ingredients, setIngredients] = useState<KeywordIngredients>({});
  const [keywordsMap, setKeywordsMap] = useState<KeywordIngredients>({});

  let keywords = {}

  const extractIngredient = (recipeData: Recipe) => {
    const recipeIng: string[] = recipeData?.recipeIngredient || [];
    const parsedIngredients: ParsedIngredient[] = [];
    console.log(recipeIng)

    for (let ind = 0; ind < recipeIng.length; ind++) {
      try {
        const parsed = parseIngredient(recipeIng[ind])[0];
        if (!parsed) continue;

        const keyword: string = getIngredientKeyword(parsed.description);
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
          keyword,
          measurementSystem: unitOfMeasureType,
          recipeTitle: recipeData?.name || ""
        };

        parsedIngredients.push(transformed);
        const keywordData = keywordsMap[keyword];
        const baseKeywordIngredientData: KeywordIngredient =
          keywordData?.unitOfMeasure
            ? keywordData
            :
            {
              isChecked: false,
              ingredients: [transformed],
              quantity: transformed.quantity || 0,
              measurementSystem: unitOfMeasureType,
              unitOfMeasure: transformed.unitOfMeasure,
              unitOfMeasureID: transformed.unitOfMeasureID,
            }

        const initialConsolidatedIng: ConsolidatedIngredient = {
          keyword,
          quantity: -1,
          measurementSystem: null,
          unitOfMeasure: null,
          unitOfMeasureID: null,
        };

        const consolidatedIngredient: ConsolidatedIngredient = keywordData?.ingredients.reduce((accum, val) => {
          if (accum.quantity == -1) {
            return ({
              quantity: val.quantity || 0,
              measurementSystem: val.measurementSystem,
              unitOfMeasure: val.unitOfMeasure,
              unitOfMeasureID: val.unitOfMeasureID,
              keyword
            })
          } else {
            const prevMeasurementSystem = accum.measurementSystem,
              prevUnitOfMeasureID = accum.unitOfMeasureID,
              prevQuantity = accum.quantity || 0;
            let quantity = prevQuantity;

            if (prevMeasurementSystem !== val.measurementSystem || prevUnitOfMeasureID !== val.unitOfMeasureID) {
              const newQuantity = convertToAllUnits(val?.quantity, val.unitOfMeasureID, prevUnitOfMeasureID);
              quantity += newQuantity || 0;
            } else {
              quantity += val.quantity || 0;
            }

            return ({
              ...accum,
              quantity
            });
          }
        }, initialConsolidatedIng) || initialConsolidatedIng;

        const keywordIngs = (keywords as KeywordIngredients)[keyword]?.ingredients || [];

        keywords = {
          ...keywords,
          [keyword]: {
            ...baseKeywordIngredientData,
            ingredients: [...keywordIngs, transformed],
            quantity: consolidatedIngredient?.quantity || 0
          }
        }
        console.log("keywords", keywords);
      } catch (error) {
        console.error('Error parsing ingredient:', error, recipeIng[ind]);
      }
    }

    setKeywordsMap((ki) => ({ ...ki, ...keywords }));
  };


  return {
    extractIngredient,
    ingredientProportionMap,
    setIngredientProportionMap,
    ingredients,
    setIngredients,
    keywordsMap,
    setKeywordsMap
  }
}

export default useIngredientsList;