export interface Recipe {
  url: string;
  recipeIngredient: string[];
  recipeYield?: string | number;
}

export interface RecipeUrl {
  url: string;
  isLoading: boolean;
  ldJson: Recipe;
} 