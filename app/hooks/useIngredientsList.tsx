import { useCallback, useState } from "react"
import {
  KeywordIngredients,
  KeywordIngredient,
  ParsedIngredient,
  ConsolidatedIngredient,
  MeasurementSystem
} from "../interfaces/ingredient";
import { parseIngredient } from "parse-ingredient";
import { Recipe } from "../interfaces/recipe";
import {
  IMPERIAL_UNITS,
  IMPERIAL,
  METRIC_UNITS,
  METRIC,
  UNIT_ORDER,
  convertToAllUnits
} from "../utils/ingredients";

const INGREDIENT_SIZES = new Set([
  "small", "medium", "large"
])

const INGREDIENT_KEYWORDS_TO_REMOVE = new Set([
  "minced", "smashed", "extra-virgin", "extra", "virgin", "fresh",
  "freshly", "ground", "kosher", "frozen", "canned", "bottled", "packaged", "pre-chopped",
  "pre-cooked", "pre-sliced", "pre-peeled", "pre-washed", "pre-rinsed", "bunch", "roughly", "cooked",
  "chopped", "sliced", "peeled", "washed", "rinsed", "for", "serving", "to serve", "black", "white"
]);

const KEYWORD_ENDINGS_TO_REMOVE = new Set([
  "and", "or"
]);


const determineUnitSystem = (unitId: string | null): MeasurementSystem => {
  if (!unitId) return null;
  if (IMPERIAL_UNITS[unitId]) return IMPERIAL;
  if (METRIC_UNITS[unitId]) return METRIC;
  return null;
};

const isImperialOrMetric = (unit: string | null) => {
  if (!unit) return false;
  return IMPERIAL_UNITS[unit] || METRIC_UNITS[unit];
}

const removeIngredientSize = (str: string): string => {
  return INGREDIENT_SIZES.has(str) ? "" : str;
};

const cleanIngredientKeyword = (ingredient: string): string => {
  if (!ingredient?.trim()) return "";

  try {
    const words = ingredient
      .replace(/ *\([^)]*\) */g, "") // Remove content in parentheses
      .split(" ")
      .map(word => word.replace(/^\s*,+\s*|\s*,+\s*$/g, "")) // Remove leading/trailing commas
      .filter(word => word && !INGREDIENT_KEYWORDS_TO_REMOVE.has(word.toLowerCase()));


    while (words.length > 0 && KEYWORD_ENDINGS_TO_REMOVE.has(words[words.length - 1]?.toLowerCase())) {
      words.pop();
    }

    return words.join(" ");
  } catch (error) {
    console.warn(`Error cleaning ingredient keyword: ${ingredient}`, error);
    return ingredient;
  }
};

const parseRecipeIngredient = (
  ingredientText: string,
  recipeData: Recipe
): ParsedIngredient | null => {
  try {
    const parsed = parseIngredient(ingredientText)[0];
    if (!parsed) return null;
    const keyword = cleanIngredientKeyword(parsed.description);
    const unitSystem = determineUnitSystem(parsed.unitOfMeasureID);

    return {
      recipeUrl: recipeData.url,
      description: parsed.description,
      quantity: Number(parsed.quantity) || 0,
      unitOfMeasure: parsed.unitOfMeasure,
      unitOfMeasureID: parsed.unitOfMeasureID,
      isChecked: false,
      keyword,
      measurementSystem: unitSystem,
      recipeTitle: recipeData?.name || ""
    };
  } catch (error) {
    console.error("Error parsing ingredient:", error, ingredientText);
    return null;
  }
};

const shouldAddAdditionalQuantity = (unitId: string | null): boolean => {
  if (!unitId) return false;
  return !isImperialOrMetric(unitId) && !INGREDIENT_SIZES.has(unitId);

};

const getConversionUnitPriority = (unitId: string): number => {
  return UNIT_ORDER[unitId] || 0;
};

const generateAdditionalQuantity = (
  prevAdditionalQuantity: string | null | undefined,
  newQuantity: number | null,
  currentUnitOfMeasurementId: string | null): string => {

  const parts = [
    prevAdditionalQuantity,
    newQuantity,
    currentUnitOfMeasurementId
  ].filter(Boolean);
  return parts.join(" ").trim();
}

const consolidateToLargerUnit = (
  existingIngredient: ConsolidatedIngredient,
  newIngredient: ParsedIngredient,
  prevUnitId: string,
  currentUnitId: string
): ConsolidatedIngredient => {

  const existingOrder = getConversionUnitPriority(prevUnitId);
  const newOrder = getConversionUnitPriority(currentUnitId);

  const largerUnit = existingOrder > newOrder ? existingIngredient : newIngredient;
  const smallerUnit = existingOrder > newOrder ? newIngredient : existingIngredient;

  let totalQuantity = largerUnit.quantity || 0;

  const convertedQuantity = convertToAllUnits(
    smallerUnit.quantity,
    smallerUnit.unitOfMeasureID,
    largerUnit.unitOfMeasureID
  );

  if (convertedQuantity !== null) {
    totalQuantity += convertedQuantity;
  }

  return {
    ...existingIngredient,
    quantity: totalQuantity,
    unitOfMeasure: largerUnit.unitOfMeasure || "",
    unitOfMeasureID: largerUnit.unitOfMeasureID || "",
    measurementSystem: largerUnit.measurementSystem
  };
};

const consolidateUnits = (
  existingIngredient: ConsolidatedIngredient | null | undefined,
  newIngredient: ParsedIngredient
): ConsolidatedIngredient => {

  if (!existingIngredient) {
    return {
      ...newIngredient,
      keyword: newIngredient.keyword || "",
      quantity: newIngredient.quantity || 0
    };
  }

  const prevUnitId = removeIngredientSize(existingIngredient.unitOfMeasureID || ""),
    currentUnitId = removeIngredientSize(newIngredient.unitOfMeasureID || "");

  if (shouldAddAdditionalQuantity(currentUnitId)) {

    const newAdditionalQuantity = generateAdditionalQuantity(
      existingIngredient.additionalQuantity,
      newIngredient.quantity,
      currentUnitId
    );

    return {
      ...existingIngredient,
      additionalQuantity: newAdditionalQuantity
    };

  } else if (!isImperialOrMetric(prevUnitId) && isImperialOrMetric(currentUnitId)) {
    // If accumulated unit is not imperial or metric but new one is, replace it
    return {
      ...existingIngredient,
      keyword: existingIngredient.keyword || "",
      unitOfMeasureID: currentUnitId,
      unitOfMeasure: newIngredient.unitOfMeasure || "",
      measurementSystem: newIngredient.measurementSystem,
      quantity: newIngredient.quantity || 0
    };

  } else if (prevUnitId !== currentUnitId && isImperialOrMetric(prevUnitId) && isImperialOrMetric(currentUnitId)) {
    // If both are either metric or imperial units, convert to larger unit
    return consolidateToLargerUnit(
      existingIngredient,
      newIngredient,
      prevUnitId,
      currentUnitId
    );

  } else if (prevUnitId === currentUnitId) {
    return {
      ...existingIngredient,
      quantity: (existingIngredient.quantity || 0) + (newIngredient.quantity || 0)
    };
  }

  return {
    ...existingIngredient,
    additionalQuantity: generateAdditionalQuantity(
      existingIngredient?.additionalQuantity,
      newIngredient.quantity,
      currentUnitId
    )
  };
};


const consolidateKeywordIngredient = (
  currentKeywordData: KeywordIngredient | undefined,
  newIngredient: ParsedIngredient
): KeywordIngredient => {

  if (!currentKeywordData) {
    return {
      quantity: newIngredient?.quantity || 0,
      measurementSystem: newIngredient.measurementSystem,
      unitOfMeasure: newIngredient.unitOfMeasure,
      unitOfMeasureID: newIngredient.unitOfMeasureID,
      additionalQuantity: shouldAddAdditionalQuantity(newIngredient.unitOfMeasureID)
        ? generateAdditionalQuantity(
          null,
          newIngredient?.quantity,
          newIngredient.unitOfMeasureID
        )
        : "",
      isChecked: false,
      ingredients: [newIngredient],
    };
  };

  const baseIngredientData: ConsolidatedIngredient = {
    quantity: currentKeywordData.quantity || 0,
    measurementSystem: currentKeywordData.measurementSystem,
    unitOfMeasure: currentKeywordData.unitOfMeasure,
    unitOfMeasureID: currentKeywordData.unitOfMeasureID,
    additionalQuantity: shouldAddAdditionalQuantity(currentKeywordData.unitOfMeasureID)
      ? generateAdditionalQuantity(
        currentKeywordData?.additionalQuantity,
        currentKeywordData.quantity,
        currentKeywordData.unitOfMeasureID
      )
      : currentKeywordData?.additionalQuantity || "",
    keyword: newIngredient?.keyword || ""
  };

  const consolidatedIngredient = consolidateUnits(baseIngredientData, newIngredient);

  return {
    ...consolidatedIngredient,
    ingredients: [...currentKeywordData.ingredients, newIngredient],
    isChecked: currentKeywordData.isChecked || false
  };
};

const useIngredientsList = () => {
  const [keywordsMap, setKeywordsMap] = useState<KeywordIngredients>({});

  const extractIngredients = useCallback((recipeData: Recipe) => {
    if (!recipeData?.recipeIngredient?.length) {
      console.warn("No recipe ingredients found in recipe data");
      return;
    }

    try {
      const parsedIngredients = recipeData.recipeIngredient
        .map(ingredientText => parseRecipeIngredient(ingredientText, recipeData))
        .filter((ingredient): ingredient is ParsedIngredient => ingredient !== null);

      if (parsedIngredients.length === 0) {
        console.warn("No ingredients could be parsed from recipe");
        return;
      }

      setKeywordsMap(prevKeywordsMap => {
        const updatedMap = { ...prevKeywordsMap };

        parsedIngredients.forEach(ing => {
          if (ing.keyword) {
            updatedMap[ing.keyword] = consolidateKeywordIngredient(updatedMap[ing.keyword], ing);
          }
        });

        return {
          ...updatedMap
        };
      });

    } catch (error) {
      console.error("Error extracting ingredients from recipe:", error, recipeData);
    }
  }, []);

  const toggleCheckedKeyword = (isChecked: boolean, keyword: string) => {
    const keywordIngredient = keywordsMap[keyword],
      ingredients = keywordIngredient.ingredients.map((ing: ParsedIngredient) => ({
        ...ing,
        isChecked: isChecked
      }));

    setKeywordsMap({
      ...keywordsMap,
      [keyword]: {
        ...keywordIngredient,
        ingredients,
        isChecked
      }
    });
  }

  const toggleCheckedIngredient = (isChecked: boolean, keyword: string, ingredientDesc: string) => {
    const keywordIngredient = keywordsMap[keyword],
      ingredients = keywordIngredient.ingredients.map((i: ParsedIngredient) => (
        i.description === ingredientDesc
          ? {
            ...i,
            isChecked: isChecked
          }
          : i
      ));

    setKeywordsMap({
      ...keywordsMap,
      [keyword]: {
        ...keywordIngredient,
        ingredients,
        isChecked: ingredients.every(ing => ing.isChecked)
      }
    });
  }

  return {
    extractIngredients,
    keywordsMap,
    setKeywordsMap,
    toggleCheckedKeyword,
    toggleCheckedIngredient
  };
};

export default useIngredientsList;