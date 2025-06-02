import { useState } from "react"
import { KeywordIngredients, KeywordIngredient, ParsedIngredient, ConsolidatedIngredient, MeasurementSystem } from "../interfaces/ingredient";
import { parseIngredient } from "parse-ingredient";
import { Recipe } from "../interfaces/recipe";
import { IMPERIAL_UNITS, IMPERIAL, METRIC_UNITS, METRIC, UNIT_ORDER, convertToAllUnits } from "../utils/ingredients";

const INGREDIENT_SIZES = new Set([
  "small", "medium", "large"
])

const INGREDIENT_KEYWORDS_TO_REMOVE = new Set([
  "minced", "smashed", "extra-virgin", "extra", "virgin", "fresh",
  "freshly", "ground", "kosher", "frozen", "canned", "bottled", "packaged", "pre-cooked",
  "pre-chopped", "pre-sliced", "pre-peeled", "pre-washed", "pre-rinsed", "pre-cooked",
  "pre-chopped", "pre-sliced", "pre-peeled", "pre-washed", "pre-rinsed", "bunch", "roughly",
  "cooked", "chopped", "sliced", "peeled", "washed", "rinsed", "cooked", "chopped", "sliced",
  "peeled", "washed", "rinsed", "for", "serving", "to serve", "black", "white"
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

const removeIfIngSizeExists = (str: string) => {
  if (INGREDIENT_SIZES.has(str)) return ""
  return str;
}

const useIngredientsList = () => {
  const [keywordsMap, setKeywordsMap] = useState<KeywordIngredients>({});

  let keywords = keywordsMap
  /**
   * TODO: fix bug where keyword is "1 whole tomatoes" when whole ing is 
   * "1 (28-ounce can) whole peeled tomatoes"
   */
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
        let additionalQuantity = "";

        if (transformed.unitOfMeasureID
          && !INGREDIENT_SIZES.has(transformed.unitOfMeasureID)
          && !isImperialOrMetric(transformed.unitOfMeasureID)) {
          additionalQuantity = `${transformed.quantity} ${transformed.unitOfMeasure}`
        }

        const baseKeywordIngredientData: KeywordIngredient =
        {
          isChecked: false,
          ingredients: additionalQuantity ? [] : [transformed],
          quantity: additionalQuantity ? 0 : transformed.quantity || 0,
          measurementSystem: unitOfMeasureType,
          unitOfMeasure: transformed.unitOfMeasure,
          unitOfMeasureID: transformed.unitOfMeasureID,
          additionalQuantity
        };

        const initialConsolidatedIng: ConsolidatedIngredient = (({
          isChecked,
          ingredients,
          ...o
        }) => o)({ ...baseKeywordIngredientData, keyword });

        const consolidatedIngredient: ConsolidatedIngredient = keywordData?.ingredients.reduce((accum, val) => {
          const prevMeasurementSystem = accum.measurementSystem,
            prevUnitOfMeasureID = removeIfIngSizeExists(accum.unitOfMeasureID || "") || "",
            currentUnitOfMeasureId = removeIfIngSizeExists(val.unitOfMeasureID || "") || "";

          let quantity = accum.quantity || 0,
            additionalQuantity = accum.additionalQuantity,
            unitOfMeasureID = prevUnitOfMeasureID,
            unitOfMeasure = removeIfIngSizeExists(accum.unitOfMeasure || ""),
            measurementSys = prevMeasurementSystem;

          if (keyword === "parsley")
            console.log("hello world")
          if ((currentUnitOfMeasureId
            && !isImperialOrMetric(currentUnitOfMeasureId)) ||
            (!currentUnitOfMeasureId
              && accum.unitOfMeasureID)) {
            additionalQuantity += `${val.quantity} ${currentUnitOfMeasureId} `
          }
          // if using diff measurement systems or units
          if (prevUnitOfMeasureID !== currentUnitOfMeasureId) {
            // if prev isn't imperial/metric and current one is
            if (!isImperialOrMetric(prevUnitOfMeasureID)
              && isImperialOrMetric(currentUnitOfMeasureId)) {

              unitOfMeasureID = currentUnitOfMeasureId;
              unitOfMeasure = val.unitOfMeasure || "";
              measurementSys = val.measurementSystem;
              quantity = val.quantity || 0;

            } else if (isImperialOrMetric(prevUnitOfMeasureID)
              && isImperialOrMetric(currentUnitOfMeasureId)) {
              // if both are imperial/metric,
              // find the bigger unit and use that unit instead
              const smallerUnitIngredient = UNIT_ORDER[prevUnitOfMeasureID] > UNIT_ORDER[currentUnitOfMeasureId] ? val : accum;
              const largerUnitIngredient = UNIT_ORDER[prevUnitOfMeasureID] > UNIT_ORDER[currentUnitOfMeasureId] ? accum : val;

              if (accum.unitOfMeasureID !== largerUnitIngredient.unitOfMeasureID) {
                quantity = convertToAllUnits(accum.quantity, smallerUnitIngredient.unitOfMeasureID, largerUnitIngredient.unitOfMeasureID) || 0;
              }
              quantity += convertToAllUnits(smallerUnitIngredient.quantity, smallerUnitIngredient.unitOfMeasureID, largerUnitIngredient.unitOfMeasureID) || 0;

              unitOfMeasure = largerUnitIngredient.unitOfMeasure || "";
              unitOfMeasureID = largerUnitIngredient.unitOfMeasureID || "";
              measurementSys = largerUnitIngredient.measurementSystem;
            }

          } else { // if using same measurement systems and units
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
            ...consolidatedIngredient,
            ingredients: [...keywordIngs, transformed],
            quantity: consolidatedIngredient?.quantity || 0,

          }
        }
      } catch (error) {
        console.error('Error parsing ingredient:', error, recipeIng[ind]);
      }
    }



    setKeywordsMap((km) => ({ ...km, ...keywords }));
  };


  return {
    extractIngredients,
    keywordsMap,
    setKeywordsMap
  }
}

export default useIngredientsList;