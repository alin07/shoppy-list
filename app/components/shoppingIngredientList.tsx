import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import { IngredientProportion, ParsedIngredient, KeywordIngredients } from "../interfaces/ingredient";
import GroupedIngredients from "./groupedIngredients"
import { RecipeUrl } from "../interfaces/recipe";
// import { Flipper, Flipped } from 'react-flip-toolkit'

export const ShoppingIngredientList = (props: {
  keywordsMap: KeywordIngredients;
  setKeywordsMap: Dispatch<SetStateAction<KeywordIngredients>>;
}) => {
  const {
    keywordsMap,
    setKeywordsMap,
  } = props
  console.log(props, "inside shopping ing list:", keywordsMap);
  // const sortIngredients = (a: ParsedIngredient, b: ParsedIngredient) => {
  //   if (!a.isChecked && b.isChecked) {
  //     return -1;
  //   } else if (!b.isChecked && a.isChecked) {
  //     return 1;
  //   } else return a.curOrder - b.curOrder;
  // }

  const setCheckedKeyword = (e: ChangeEvent<HTMLInputElement>) => {

  }

  const setChecked = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const isChecked = target.checked;

    // let newIng = ingredients;
    // const curOrder: number | undefined = ingredients.findIndex(i => i.name === target.value);

    // if (curOrder === null || curOrder === undefined) return;

    // find the ingredient in the keywordsMap
    // const ingredient = Object.keys(keywordIngredients).find(i => i === target.value || keywordIngredients[i].asdfasdfa.contains(target.value));
    // // update ingredient's isChecked property
    // const updatedIngredient = { ...ingredient, isChecked: isChecked };
    // // update the keywordsMap
    // setKeywordsMap({
    //   ...keywordIngredients,
    //   [ingredient.keyword]: {
    //     ...keywordIngredients[ingredient.keyword],
    //     keywordIngredients: [...keywordIngredients[ingredient.keyword], updatedIngredient],
    //     isChecked
    //   }
    // });

    // const ing: ParsedIngredient = keywordIngredients[curOrder];

    // newIng.splice(curOrder, 1);
    // newIng = [...newIng,
    // {
    //   ...ing,
    //   isChecked: isChecked,
    //   curOrder: isChecked ? curOrder : ing.listOrder
    // }].sort(sortIngredients);
    // setKeywordsMap(newIng);
    // setIngredients(newIng);
  }


  return (
    <div className="left">
      <h2>Shopping List:</h2>
      {/* <Flipper flipKey={keywordIngredients}> */}
      {keywordsMap && Object.keys(keywordsMap).map((keyword) =>
        // <Flipped flipId={ingredients.description} key={ingredients.description}>
        <GroupedIngredients
          key={keyword}
          setChecked={setChecked}
          setCheckedKeyword={setCheckedKeyword}
          keywordIngredient={keywordsMap[keyword]}
          keyword={keyword}
        />
        // <div className="flex items-center mb-4">
        //   <label htmlFor={ingredients.description} className={`ms-2${i.isChecked ? " line-through" : ""}`}>
        //     <input id={ingredients.description} type="checkbox" checked={i.isChecked} value={ingredients.description} className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={setChecked} />
        //     {ingredients.description}
        //   </label>
        // </div>
        // </Flipped>
      )
      }
      {/* </Flipper> */}
    </div >
  )
}
