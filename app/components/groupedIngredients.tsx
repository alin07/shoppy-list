import { ChangeEventHandler } from "react";
import { KeywordIngredient } from "../interfaces/ingredient";
import Accordion from "./accordian";

const GroupedIngredients = (props: {
  setChecked: ChangeEventHandler<HTMLInputElement>;
  setCheckedKeyword: ChangeEventHandler<HTMLInputElement>;
  keywordIngredient: KeywordIngredient;
  keyword: string;
}) => {
  const {
    setChecked,
    setCheckedKeyword,
    keywordIngredient,
    keyword,
  } = props

  const additionalQuantities = keywordIngredient.additionalQuantities &&
    Object.keys(keywordIngredient.additionalQuantities).length > 0
    ? Object.values(keywordIngredient.additionalQuantities).map(q =>
      `${q.quantity}${" " + q.unitOfMeasure || ""}`
    )
    : ""

  return (
    <div>
      <Accordion
        defaultExpanded={true}
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
            {keywordIngredient?.quantity > 0
              ? keywordIngredient.quantity
              : ""
            }
            {" "}
            {keywordIngredient.unitOfMeasure}
            {keywordIngredient?.quantity > 0 && additionalQuantities ? " & " : ""}
            {additionalQuantities}
            {" "}
            {keyword}
          </label>
        }
        content={
          keywordIngredient?.ingredients.map((i) =>
          (
            <div
              key={i.description}
              className="flex items-center mb-4 pl-8" >
              <label
                htmlFor={i.description}
                className={`ms-2${i.isChecked ? " line-through" : ""}`}>
                <input
                  id={keyword + " - " + i.description}
                  type="checkbox"
                  checked={i.isChecked}
                  value={i.description}
                  className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  onChange={setChecked}
                />
                {i.description} - ({i.recipeTitle})
              </label>
            </div>
          ))
        }
      />


    </div>
  )
}

export default GroupedIngredients;