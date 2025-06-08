import * as cheerio from "cheerio";

const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) &&
      !['localhost', '127.0.0.1'].includes(parsed.hostname);
  } catch {
    return false;
  }
};

const replaceBadControlCharacters = (jsonString: string) => {
  return jsonString.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ message: "URL is required" });
  }

  try {
    if (!isValidUrl(url)) {
      return res.status(400).json({ message: "url is invalid" });
    }
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 10000);
    const jsonStringified = fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'ShoppyList/1.0' }
    })
      .then((resp) => resp.text())
      .then((text) => {
        const $ = cheerio.load(text);
        let ldJson = $(`script[type="application/ld+json"]`).html();
        if (ldJson) {
          ldJson = replaceBadControlCharacters(ldJson)
        }
        return ldJson;
      });
    const jsonString = await jsonStringified;
    if (jsonString) {
      const json = JSON.parse(jsonString);
      let recipeObj = json;

      if (Array.isArray(recipeObj)) {
        recipeObj = recipeObj[0];
      }
      if (json["@graph"]?.length > 1 && Array.isArray(json["@graph"])) {
        recipeObj = json["@graph"].filter(
          (obj: { [x: string]: string }) => obj["@type"] === "Recipe"
        )[0];
      }
      return res.status(200).json(json);
      // console.log(test)
      // return res.status(200).json(test);
    } else {
      return res.status(404).json({ message: "No ld+json found on the page" });
    }
  } catch (err) {
    console.error("Error fetching recipe:", err);
    return res.status(500).json({ message: "Error fetching recipe " + err });
  }
}



const test = {
  '@context': 'http://schema.org/',
  '@type': 'Recipe',
  mainEntityOfPage: 'https://food52.com/recipes/4597-roasted-salmon-with-a-cheat-s-vietnamese-caramel-sauce',
  name: 'Roasted Salmon with a Cheat&#39;s Vietnamese Caramel Sauce',
  image: [
    'https://images.food52.com/MY7GzvmD7RG4RN1mWqNCdwav1Kk=/1200x1200/3c22faa4-ff9e-4f51-949f-d94d6741857c--2014-0121_WC_roasted-salmon-003.jpg',
    'https://images.food52.com/evuLP0jl628TF6xgEqSXkQkY5Ds=/1200x900/3c22faa4-ff9e-4f51-949f-d94d6741857c--2014-0121_WC_roasted-salmon-003.jpg',
    'https://images.food52.com/XHC442r1TTNqmZO0LoBwgnYWjyM=/1200x675/3c22faa4-ff9e-4f51-949f-d94d6741857c--2014-0121_WC_roasted-salmon-003.jpg'
  ],
  recipeCategory: 'Entree',
  recipeCuisine: 'Vietnamese',
  author: {
    '@type': 'Person',
    name: 'Kristin',
    url: 'https://food52.com/users/3173-kristin'
  },
  dateModified: '2019-08-20 10:41:50 -0400',
  datePublished: '2010-05-14 16:05:14 -0400',
  description: 'This recipe Vietnamese salmon recipe has been adapted from Chef Granger but with the flavor boosted by the addition of ginger, cilantro, scallions, and chili.',
  recipeYield: 'Serves 4',
  prepTime: 'PT0H0M',
  cookTime: 'PT0H0M',
  totalTime: 'PT0H0M',
  recipeInstructions: [
    {
      '@type': 'HowToStep',
      name: 'Preheat the oven to 425°F. Line a baking sheet with parchment paper or foil. Place the salmon, skin side down, on the sheet. Brush or lightly drizzle the salmon with the olive oil, then sprinkle with salt and pepper. Roast for about 11 or 12 minutes, until the salmon is just opaque in the center.',
      text: 'Preheat the oven to 425°F. Line a baking sheet with parchment paper or foil. Place the salmon, skin side down, on the sheet. Brush or lightly drizzle the salmon with the olive oil, then sprinkle with salt and pepper. Roast for about 11 or 12 minutes, until the salmon is just opaque in the center.'
    },
    {
      '@type': 'HowToStep',
      name: 'Meanwhile, heat a frying pan over a medium heat. Add the soy sauce, fish sauce, brown sugar, ginger and lime juice and stir together, until the sugar has dissolved and the sauce is syrupy. ',
      text: 'Meanwhile, heat a frying pan over a medium heat. Add the soy sauce, fish sauce, brown sugar, ginger and lime juice and stir together, until the sugar has dissolved and the sauce is syrupy. '
    },
    {
      '@type': 'HowToStep',
      name: 'Serve the salmon on steamed rice with the sauce generously drizzled over, then sprinkle over some chopped cilantro, scallions and red chili with lime wedges on the side.',
      text: 'Serve the salmon on steamed rice with the sauce generously drizzled over, then sprinkle over some chopped cilantro, scallions and red chili with lime wedges on the side.'
    }
  ],
  recipeIngredient: [
    'Four  7-ounce salmon fillets',
    '1 tablespoon olive oil',
    ' Salt and freshly ground black pepper',
    '3 tablespoons soy sauce',
    '3 tablespoons fish sauce',
    '1/2 cup soft brown sugar',
    '1 teaspoon freshly grated ginger',
    ' Juice of 1 lime',
    ' Steamed rice, to serve',
    ' Handful of fresh cilantro, chopped, to serve',
    ' 3 to 4 scallions, chopped, to serve',
    ' 1 red chili, deseeded and finely chopped, to serve',
    ' Lime wedges, to serve'
  ],
  commentCount: 22,
  aggregateRating: { ratingCount: '5', ratingValue: '4.6' },
  keywords: 'Cilantro, Summer, Salmon, Green Onion/Scallion, Seafood, Winter, Spring, Soy Sauce, Gluten-Free, Fall',
  publisher: {
    '@type': 'Organization',
    name: 'Food52',
    logo: 'https://food52.com/assets/logo-food52.png',
    url: 'https://food52.com/',
    sameAs: [
      'https://www.facebook.com/food52',
      'https://www.instagram.com/Food52/',
      'https://twitter.com/Food52',
      'https://www.pinterest.com/food52/',
      'https://www.youtube.com/channel/UCfFI8jIjvIApUACJ3qjax2w'
    ]
  }
}