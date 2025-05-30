import { useState } from "react"
import { KeywordIngredients, KeywordIngredient, ParsedIngredient, ConsolidatedIngredient, MeasurementSystem } from "../interfaces/ingredient";
import { parseIngredient } from "parse-ingredient";
import { Recipe } from "../interfaces/recipe";
import { IMPERIAL_UNITS, IMPERIAL, METRIC_UNITS, METRIC, convertToAllUnits } from "../utils/ingredients";


const INGREDIENT_KEYWORDS_TO_REMOVE = new Set([
  // "black", "white", "red", "yellow", "green",
  "minced", "smashed", "extra-virgin", "extra", "virgin",
  "freshly", "ground", "kosher", "fresh", "frozen", "dried", "canned", "bottled", "packaged", "pre-cooked", "pre-chopped", "pre-sliced", "pre-peeled", "pre-washed", "pre-rinsed", "pre-cooked", "pre-chopped", "pre-sliced", "pre-peeled", "pre-washed", "pre-rinsed", "bunch", "roughly", "cooked", "chopped", "sliced", "peeled", "washed", "rinsed", "cooked", "chopped", "sliced", "peeled", "washed", "rinsed", "for", "serving", "to serve", "black", "white"
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

  while (KEYWORD_ENDINGS_TO_REMOVE.has(ing[ing.length - 1])) {
    ing.pop();
  }
  return ing.join(" ");
};

const isImperialOrMetric = (unit: string) => {
  return IMPERIAL_UNITS[unit] || METRIC_UNITS[unit];
}

const useIngredientsList = () => {
  const [keywordsMap, setKeywordsMap] = useState<KeywordIngredients>({});

  let keywords = keywordsMap

  const extractIngredients = (recipeData: Recipe) => {
    const recipeIng: string[] = recipeData?.recipeIngredient || [];

    for (let ind = 0; ind < recipeIng.length; ind++) {
      try {
        const parsed = parseIngredient(recipeIng[ind])[0];
        if (!parsed) continue;

        const keyword: string = getIngredientKeyword(parsed.description);
        const recipeUrl = recipeData.url;

        let unitOfMeasureType: MeasurementSystem = null;
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

        const keywordData = keywordsMap[keyword];

        const baseKeywordIngredientData: KeywordIngredient =
          keywordData?.unitOfMeasure
            ? keywordData
            : {
              isChecked: false,
              ingredients: [transformed],
              quantity: transformed.quantity || 0,
              measurementSystem: unitOfMeasureType,
              unitOfMeasure: transformed.unitOfMeasure,
              unitOfMeasureID: transformed.unitOfMeasureID,
            };

        const initialConsolidatedIng: ConsolidatedIngredient = {
          keyword,
          quantity: transformed.quantity,
          measurementSystem: transformed.measurementSystem,
          unitOfMeasure: transformed.unitOfMeasure,
          unitOfMeasureID: transformed.unitOfMeasureID,
        };

        const consolidatedIngredient: ConsolidatedIngredient = keywordData?.ingredients.reduce((accum, val) => {

          const prevMeasurementSystem = accum.measurementSystem,
            prevUnitOfMeasureID = accum.unitOfMeasureID || "";

          let quantity = accum.quantity || 0,
            additionalQuantity = "",
            unitOfMeasureID = prevUnitOfMeasureID,
            unitOfMeasure = accum.unitOfMeasure,
            measurementSys = prevMeasurementSystem;
          if (keyword === "parsley")
            console.log("switching unitOfMeasure")
          if (prevMeasurementSystem !== val.measurementSystem
            || prevUnitOfMeasureID !== val.unitOfMeasureID) {
            if (!isImperialOrMetric(prevUnitOfMeasureID)
              && isImperialOrMetric(val.unitOfMeasureID || "")) {
              unitOfMeasureID = val.unitOfMeasureID || "";
              unitOfMeasure = val.unitOfMeasure;
              measurementSys = val.measurementSystem;

            } else if (!isImperialOrMetric(val.unitOfMeasureID || "")) {
              additionalQuantity += `${val.quantity} ${val.unitOfMeasure} `
              console.log(additionalQuantity)
            } else {
              const newQuantity = convertToAllUnits(val?.quantity, prevUnitOfMeasureID, val.unitOfMeasureID) || 0;
              quantity += newQuantity;
              // unitOfMeasure = accum.unitOfMeasure || "";
              // unitOfMeasureID = val.unitOfMeasureID || "";

              console.log(keyword, ": new quantity is from ", val?.quantity, val.unitOfMeasureID, "=>", val.unitOfMeasureID, newQuantity, "total quantity=", quantity)
            }
          } else {
            quantity += val.quantity || 0;
          }

          return ({
            ...accum,
            quantity,
            additionalQuantity,
            unitOfMeasureID,
            unitOfMeasure,
            measurementSystem: measurementSys
          });
        }, initialConsolidatedIng) || initialConsolidatedIng;

        const keywordIngs = keywords[keyword]?.ingredients || [];

        keywords = {
          ...keywords,
          [keyword]: {
            ...baseKeywordIngredientData,
            ingredients: [...keywordIngs, transformed],
            quantity: consolidatedIngredient?.quantity || 0
          }
        }
      } catch (error) {
        console.error('Error parsing ingredient:', error, recipeIng[ind]);
      }
    }



    setKeywordsMap((km) => {
      console.log("current keywords map ", { ...km, ...keywords })
      return ({ ...km, ...keywords })
    });
  };


  return {
    extractIngredients,
    keywordsMap,
    setKeywordsMap
  }
}

export default useIngredientsList;