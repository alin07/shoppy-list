import { useState, useCallback } from 'react';
import { Recipe } from '../interfaces/recipe';
import { retrieveRecipe } from "../utils/ingredients";

const useFetchRecipeUrl = () => {
  const [error, setError] = useState<string>("");
  const [recipeData, setRecipeData] = useState<Recipe>({});
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRecipeData = useCallback(async (url: string) => {
    if (!url) return;
    setLoading(true);
    try {
      const response = await retrieveRecipe(url);
      setRecipeData({ ...response, url: url });
    } catch (err) {
      console.log('Error fetching recipe:', err);
      setError("Failed to retrieve the recipe");
    } finally {
      setLoading(false);
    }
  }, []);

  return { error, setError, loading, fetchRecipeData, recipeData }
}
export default useFetchRecipeUrl;