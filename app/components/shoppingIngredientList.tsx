import React, { ChangeEventHandler } from "react";
import { IngredientCheckbox } from "../interfaces/Ingredient";
import { Flipper, Flipped } from 'react-flip-toolkit'

export const ShoppingIngredientList = (props: {
  ingredients: IngredientCheckbox[];
  setChecked: ChangeEventHandler<HTMLInputElement>;
}) => {
  const {
    ingredients,
    setChecked
  } = props
  // className = "flex items-center mb-4"
  return (
    <div className="left">
      <h2>Shopping List:</h2>
      <Flipper flipKey={ingredients}>
        {ingredients.map(i =>
          <Flipped flipId={i.name} key={i.name}>
            <div className="flex items-center mb-4">
              <label htmlFor={i.name} className={`ms-2${i.isChecked ? " line-through" : ""}`}>
                <input id={i.name} type="checkbox" checked={i.isChecked} value={i.name} className="mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" onChange={setChecked} />
                {i.name}
              </label>
            </div>
          </Flipped>
        )}
      </Flipper>
    </div >
  )
}
