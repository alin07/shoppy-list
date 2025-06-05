import React, { ChangeEvent } from "react";
import { KeywordIngredients } from "../interfaces/ingredient";
import GroupedIngredients from "./groupedIngredients"

// import { Flipper, Flipped } from 'react-flip-toolkit'

export const ShoppingIngredientList = (props: {
  keywordsMap: KeywordIngredients;
  toggleCheckedKeyword: (isChecked: boolean, keyword: string) => void;
  toggleCheckedIngredient: (isChecked: boolean, keyword: string, ingredientDesc: string) => void;
}) => {
  const {
    keywordsMap,
    toggleCheckedKeyword,
    toggleCheckedIngredient
  } = props

  const setCheckedKeyword = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked, id = e.target.id;
    toggleCheckedKeyword(isChecked, id);
  }

  const setChecked = (e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked, id = e.target.id.split(" - ");
    toggleCheckedIngredient(isChecked, id[0], id[1]);
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
          keyword={keyword} />
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
