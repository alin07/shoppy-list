"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { RecipeIngredientList } from './components/recipeIngredientList'
import RecipeUrlInput from "./components/recipeUrlInput";
import { Recipe, RecipeUrl } from './interfaces/recipe';
import { ParsedIngredient, IngredientMap, IngredientProportion, IngredientProportionObject, IngredientCheckbox } from './interfaces/Ingredient';
import { parseIngredient } from 'parse-ingredient';
import { retrieveRecipe, getValue } from "./utils/ingredients";
import { ShoppingIngredientList } from './components/shoppingIngredientList';


export default function Home() {
  const [recipe, setRecipe] = useState<string>("");
  const [recipeUrls, setRecipeUrls] = useState<RecipeUrl[]>([]);
  const [ingredients, setIngredients] = useState<IngredientCheckbox[]>([]);
  const [ingredientProportionMap, setIngredientProportionMap] = useState<IngredientProportionObject>({});
  const [error, setError] = useState<string | null>(null);

  const onChangeRecipe = (url: string) => {
    setRecipe(url);
  }

  const sortIngredients = (a: IngredientCheckbox, b: IngredientCheckbox) => {
    if (!a.isChecked && b.isChecked) {
      return -1;
    } else if (!b.isChecked && a.isChecked) {
      return 1;
    } else return a.curOrder - b.curOrder;
  }

  useEffect(() => {
    const updateIngredientList = () => {

      const updatedIngObj: IngredientMap = Object.entries(ingredientProportionMap).reduce((acc, curVal) => {

        const ingObj: IngredientProportion = curVal[1];

        let ings = {};

        ingObj.ingredientsScaled.forEach((i) => {
          const curIngs = (acc as IngredientMap)[i.description];
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
      setIngredients(ingArr)
    }

    updateIngredientList();

  }, [ingredientProportionMap]);

  const onRecipeUrlAdd = (url: string) => {
    if (recipeUrls.some(ru => ru.url === url)) {
      setError("Recipe URL already in the list");
      setTimeout(() => setError(null), 5000);
      return;
    }

    setRecipeUrls([
      ...recipeUrls,
      {
        url,
        isLoading: true,
        ldJson: {}
      }]);

    setRecipe("");
    fetchRecipeData(url);
  }

  const fetchRecipeData = async (url: string) => {
    try {
      const recipeData: Recipe = await retrieveRecipe(url);
      const recipeIng: string[] | undefined = recipeData?.recipeIngredient || [];

      console.log(recipeData);

      if (recipeData?.recipeIngredient) {

        let parsedIngredients: ParsedIngredient[] = []

        for (const ing in recipeIng) {
          try {
            const parsed = parseIngredient(recipeIng[ing])[0];
            parsedIngredients = [...parsedIngredients, parsed];
          } catch (e) {
            console.error(e, recipeIng[ing]);
          }
        }
        const recipeYield = getValue(recipeData?.recipeYield);

        const ingProportionMap = {
          proportion: 1,
          recipeYield: recipeYield,
          ingredients: [...parsedIngredients],
          ingredientsScaled: [...parsedIngredients]
        };

        setIngredientProportionMap({
          ...ingredientProportionMap,
          [url]: ingProportionMap
        });

        setRecipeUrls(prevUrls =>
          prevUrls.map(ru =>
            ru.url === url ? { ...ru, isLoading: false, ldJson: recipeData } : ru
          )
        );
      }
    } catch (err) {
      console.error('Error fetching recipe:', err);
      setError("Failed to retrieve the recipe");
      setTimeout(() => setError(null), 10000);
      setRecipeUrls(prevUrls =>
        prevUrls.filter(ru =>
          ru.url === url
        )
      );
    }
  }

  const setChecked = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const isChecked = target.checked;
    let newIng = ingredients;
    const curOrder: number | undefined = ingredients.findIndex(i => i.name === target.value);

    if (curOrder === null || curOrder === undefined) return;

    const ing: IngredientCheckbox = ingredients[curOrder];

    newIng.splice(curOrder, 1);
    newIng = [...newIng,
    {
      ...ing,
      isChecked: isChecked,
      curOrder: isChecked ? curOrder : ing.listOrder
    }].sort(sortIngredients);

    setIngredients(newIng);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col row-start-2 items-center sm:items-start">
        <div className="w-full mb-4">
          <RecipeUrlInput
            url={recipe}
            onUrlChange={onChangeRecipe}
            onSubmitUrl={() => onRecipeUrlAdd(recipe)}
            error={error}
          />
        </div>
        <div className="flex w-full justify-between">
          <ShoppingIngredientList
            ingredients={ingredients}
            setChecked={setChecked}
          />

          <div className="right">
            <div>
              {
                recipeUrls.map(recipe =>
                  <div key={recipe.url} className="mb-4">
                    <div className="flex items-center space-x-4">

                      {recipe.isLoading &&
                        <div>
                          <a href={recipe.url}>
                            {recipe.url}
                          </a>
                          <p>Loading...</p>
                        </div>}
                    </div>
                    {!recipe.isLoading && recipe.ldJson && (
                      <RecipeIngredientList
                        url={recipe.url}
                        recipeItems={recipe.ldJson}
                        ingredientProportionMap={ingredientProportionMap}
                        setIngredientProportionMap={setIngredientProportionMap}
                      />
                    )}
                  </div>
                )
              }
            </div>
          </div>

        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
