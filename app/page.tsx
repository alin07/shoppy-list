"use client";
import React, { useState, useCallback, useEffect, memo } from 'react';
// import { RecipeIngredientList } from './components/recipeIngredientList'
import RecipeUrlInput from "./components/recipeUrlInput";
import { Recipe, RecipeUrl } from './interfaces/recipe';
// import { IngredientMap, IngredientProportion, IngredientProportionObject, IngredientCheckbox } from './interfaces/ingredient';
// import { setUpIngredientMap } from "./utils/ingredients";
import { ShoppingIngredientList } from './components/shoppingIngredientList';
import useFetchRecipeUrl from './hooks/useFetchRecipeUrl';
import useIngredientsList from "./hooks/useIngredientsList"

// Memoized components for better performance
const MemoizedRecipeUrlInput = memo(RecipeUrlInput);
// const MemoizedShoppingIngredientList = memo(ShoppingIngredientList);
// const MemoizedRecipeIngredientList = memo(RecipeIngredientList);

export default function Home() {
  const [recipe, setRecipe] = useState<string>("");
  const [recipeUrls, setRecipeUrls] = useState<RecipeUrl[]>([]);

  const {
    error,
    setError,
    loading,
    fetchRecipeData,
    recipeData
  } = useFetchRecipeUrl();

  const {
    extractIngredient,
    // ingredientProportionMap,
    // setIngredientProportionMap,
    keywordsMap,
    setKeywordsMap
  } = useIngredientsList();

  const extractIngredients = useCallback((recipeData: Recipe) => extractIngredient(recipeData), []);

  // console.log(loading, ingredients, ingredientProportionMap, recipeData);

  const onChangeRecipeUrl = useCallback((url: string) => {
    setRecipe(url);
  }, []);

  // useEffect(() => {
  //   if (recipe) {
  //     setRecipeUrls([
  //       ...recipeUrls,
  //       {
  //         url: recipe,
  //         isLoading: loading,
  //         ldJson: {}
  //       }]);
  //   } else {
  //     const loadingRecipe = recipeUrls.filter(r => r.isLoading)[0]
  //     const recipeList = recipeUrls.filter(r => !r.isLoading)

  //     setRecipeUrls([
  //       ...recipeList,
  //       {
  //         ...loadingRecipe,
  //         isLoading: loading,
  //         ldJson: recipeData
  //       }]);
  //   }
  // }, [loading, recipeData])

  useEffect(() => {
    const url: string = recipeData.url;

    // setIngredientProportionMap(map => ({
    //   ...map,
    //   [url]: ingredientMap
    // }));
    extractIngredients(recipeData);

    setRecipeUrls((prevUrls) =>
      prevUrls.map((ru: RecipeUrl) =>
        ru.url === url
          ? { ...ru, isLoading: false, ldJson: recipeData }
          : ru
      ));
  }, [extractIngredients, recipeData]);

  const onRecipeUrlAdd = useCallback((url: string) => {
    if (recipeUrls.some(ru => ru.url === url)) {
      setError("Recipe URL already in the list");
      setTimeout(() => setError(""), 5000);
      return;
    }
    fetchRecipeData(url);
    setRecipe("");
  }, [recipeUrls, setError, fetchRecipeData]);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full flex flex-col row-start-2  sm:items-start">
        <h1 className="text-4xl mb-4">Shoppy List</h1>
        <div className="w-full mb-4">
          <MemoizedRecipeUrlInput
            url={recipe}
            onUrlChange={onChangeRecipeUrl}
            onSubmitUrl={() => onRecipeUrlAdd(recipe)}
            error={error}
          />
        </div>

        <div className="flex w-full justify-between">
          <ShoppingIngredientList
            keywordsMap={keywordsMap}
            setKeywordsMap={setKeywordsMap}
          />
          <div className="right">
            <div>
              {recipeUrls.map(recipe => (
                <div key={recipe.url} className="mb-4">
                  <div className="flex items-center space-x-4">
                    {loading && (
                      <div>
                        <a href={recipe.url} className="text-blue-600 hover:text-blue-800">
                          {recipe.url}
                        </a>
                        <p className="text-gray-600">Loading...</p>
                      </div>
                    )}
                  </div>
                  {/* {!recipe.isLoading && recipe.ldJson && (
                    <MemoizedRecipeIngredientList
                      url={recipe.url}
                      recipeItems={recipe.ldJson}
                      ingredientProportionMap={ingredientProportionMap}
                      setIngredientProportionMap={setIngredientProportionMap}
                    />
                  )} */}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}


