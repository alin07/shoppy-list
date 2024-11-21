export interface RecipeUrl {
  url: string;
  isLoading?: boolean | false;
  ldJson?: Recipe;
}
export interface RecipeLdJson2 {
  "@context": string;
}
export type RecipeLdJson = Record<"@context", string>;

export interface Recipe {
  "@context"?: string;
  "@type"?: string;
  articleBody?: string;
  alternativeHeadline?: string;
  keywords?: string[];
  thumbnailUrl?: string;
  publisher?: Publisher;
  isPartOf?: IsPartOf;
  isAccessibleForFree?: boolean;
  author?: Author[];
  aggregateRating?: AggregateRating;
  description?: string;
  image?: string[];
  headline?: string;
  name?: string;
  recipeIngredient?: string[];
  recipeInstructions?: RecipeInstruction[];
  recipeYield?: string | string[];
  url?: string;
  dateModified?: Date;
  datePublished?: Date;
}

export interface AggregateRating {
  "@type": string;
  ratingValue: number;
  ratingCount: number;
}

export interface Author {
  "@type": string;
  name: string;
  sameAs: string;
}

export interface IsPartOf {
  "@type": string;
  name: string;
}

export interface Publisher {
  "@context": string;
  "@type": string;
  name: string;
  logo: Logo;
  url: string;
}

export interface Logo {
  "@type": string;
  url: string;
  width: string;
  height: string;
}

export interface RecipeInstruction {
  "@type": string;
  text: string;
}

