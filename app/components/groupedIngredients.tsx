import { Dispatch, SetStateAction } from "react";
import { KeywordIngredient, KeywordIngredients, ParsedIngredient } from "../interfaces/ingredient";
import Accordion from "./accordian";
import { RecipeUrl } from "../interfaces/recipe";

const GroupedIngredients = (props: {
  setChecked: Dispatch<SetStateAction<KeywordIngredients>>;
  setCheckedKeyword: Dispatch<SetStateAction<KeywordIngredients>>;
  keywordIngredient: KeywordIngredient;
  keyword: string;
  recipeUrls: RecipeUrl[];
}) => {
  const {
    setChecked,
    setCheckedKeyword,
    keywordIngredient,
    keyword,
  } = props

  const escapeHTML = (str: string) => str.replace(/[&<>"']/g, tag => ({
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'"
  }[tag] || tag));

  return (
    <div>
      <Accordion
        title={
          <label htmlFor={keyword} className={`ms-2${keywordIngredient.isChecked ? " line-through" : ""}`}>
            <input
              id={keyword}
              type="checkbox"
              checked={keywordIngredient.isChecked}
              value={keyword}
              className="peer/showLabel mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              onChange={setCheckedKeyword}
            />
            {keyword}
          </label>
        }
        content={
          keywordIngredient?.ingredients.map((i) =>
            <div
              key={i.keyword}
              className="flex items-center mb-4 pl-8" >
              <label
                htmlFor={i.description}
                className={`ms-2${i.isChecked ? " line-through" : ""}`}>
                <input
                  id={i.description}
                  type="checkbox"
                  checked={i.isChecked}
                  value={i.description}
                  className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={setChecked}
                />
                {i.description} - ({[escapeHTML(i.recipeTitle)]})
              </label>
            </div>
          )
        }
      />


    </div>
  )
}

export default GroupedIngredients;