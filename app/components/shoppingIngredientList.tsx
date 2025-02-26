import React, { ChangeEvent } from "react";
import { IngredientCheckbox } from "../interfaces/ingredient";
import { Flipper, Flipped } from 'react-flip-toolkit'

export const ShoppingIngredientList = (props: {
  ingredients: IngredientCheckbox[];
  setIngredients: React.Dispatch<React.SetStateAction<IngredientCheckbox[]>>;
}) => {
  const {
    ingredients,
    setIngredients
  } = props

  const sortIngredients = (a: IngredientCheckbox, b: IngredientCheckbox) => {
    if (!a.isChecked && b.isChecked) {
      return -1;
    } else if (!b.isChecked && a.isChecked) {
      return 1;
    } else return a.curOrder - b.curOrder;
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
