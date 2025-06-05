export const retrieveRecipe = async (url: string) => {
  try {
    const response = await fetch(`/api/recipe?url=${url}`);
    const data = await response.json();
    return data;
  } catch (err: unknown) {
    console.error("Error fetching recipe from site", err);
    throw new Error((err as Error).message);
  }
};