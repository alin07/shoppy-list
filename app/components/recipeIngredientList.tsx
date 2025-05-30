import React from "react";
import { Recipe } from "../interfaces/recipe";
// import { parseIngredient } from 'parse-ingredient';
// import { getValue } from "../utils/ingredients";
// import { IngredientProportionObject, ParsedIngredient } from "../interfaces/ingredient";


export const RecipeIngredientList = (props: {
  recipeItems: Recipe;
  url: string;
}) => {
  const {
    recipeItems,
    url,
  } = props

  // const servingSize = ingredientProportionMap[url]?.proportion

  // const onServingSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // const ingList = ingredientProportionMap[url].ingredients?.map((ing: ParsedIngredient) => ({
  //   ...ing,
  //   scaledQuantity: ing.quantity
  //     ? ing.quantity * e.target.valueAsNumber
  //     : 0
  // }));

  // setIngredientProportionMap({
  //   ...ingredientProportionMap,
  //   [url]: {
  //     ...ingredientProportionMap[url],
  //     proportion: e.target.valueAsNumber,
  //     ingredients: ingList
  //   }
  // });
  // }

  // const recipeYield = recipeItems?.recipeYield
  //   ? getValue(recipeItems.recipeYield)
  //   : null;

  // const recipeYieldParsed = recipeYield ? parseIngredient(recipeYield)[0] : null;

  return (
    <div>
      {/* {recipeItems.name &&
        <h3><a href={url} target="_blank">{recipeItems.name}</a></h3>
      } */}

      {/* {recipeYield &&
        <h4>
          {recipeYieldParsed?.quantity && servingSize
            ? recipeYieldParsed.quantity * servingSize
            : servingSize}
          {` `}
          {recipeYieldParsed?.description || "serving(s)"}
        </h4>
      } */}

      {/* <div className="slidecontainer">
        <input
          type="range"
          min="0"
          max="4"
          step="0.25"
          value={servingSize}
          className="slider w-full h-3 outline-none opacity-70"
          id="myRange"
          onChange={onServingSizeChange} />

        <p>{servingSize} x</p>
      </div> */}

      <label>
        <input className="peer/showLabel scale-0" type="checkbox" />
        <span className="block w-auto max-h-14 overflow-hidden rounded-lg px-4 py-0 shadow-lg transition-all duration-300 peer-checked/showLabel:max-h-full">
          <h5 className="flex justify-between h-14 cursor-pointer items-center font-bold" >Ingredients from recipe:
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </h5>
          <ul className="mb-2">
            {recipeItems.recipeIngredient &&
              recipeItems.recipeIngredient.map((ing: string) =>
                <li key={url + ing}>{ing}</li>
              )
            }
          </ul>
        </span>
      </label>
    </div >
  )
}
