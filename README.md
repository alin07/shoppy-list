# Shoppy List

A grocery list generator that lets users enter recipe urls then adds and condenses all the ingredients (and units) into the shopping list.
This is a personal project that I wanted to create to make my life easier when I need to do grocery shopping for multiple recipes.

# Demo

You can check out a live demo of this app [here](https://shoppy-list.vercel.app/).

# How to set up locally

1. Download the project
2. In your terminal, change your directory to the root directory of this project
3. (running dev only) Install chromium on your computer. If you're on MacOS, you can run `brew install chromium` in your terminal. Then run `which chromium` to find the path. Copy and paste the path on line 19 in `pages/api/recipe.ts`
4. Install all dependancies with `npm i`
5. Run `npm run build && npm run start` if you want to run prod mode or `npm run dev` if you want to run development mode
6. type in `localhost:3000` in your browser

# Current Features:

- an input to allow users to enter a recipe url
- after a user submits a url string, the application will pull recipe ingredients and create a shopping list with ingredients.
- user can continue to add more urls and the application will add the new ingredients to the shopping list
- user can check/uncheck ingredients from recipe list. there is a transition when you check/uncheck.
- condense ingredients and their measurement units

# Things to improve/wip/bugs/features/etc:

- need to group plural/singular ingredients together
- group similar ingredients together if one of the keywords have 2 ingredients (eg: "1 medium onion or 3 shallots" and "1 onion" should be grouped into the keyword "2 onions or 3 shallots")
- add tests
- some recipes would load forever -> add timeout
- set all ingredient units to one consistent metric (allow user to choose imperial or metric)
- if page is refreshed, all data is erased. I plan to make all shopping lists shareable. The ones that don't belong to a registered user will live for a week before expiring.
- will add functionality to register and login, but login/registration is not required to use the app, but will help if you want to use the app on multiple devices.
- more to come...
