# Shoppy List
A grocery list generator that lets users enter recipe urls then adds and condenses all the ingredients (and units) into the shopping list. 
This is a personal project that I wanted to create to make my life easier when I need to do grocery shopping for multiple recipes.

# How to set up
1. Download the project
2. In your terminal, change your directory to the root directory of this project
3. install all dependancies with `npm i`
4. run `npm run build && npm run start` if you want to run prod mode or `npm run dev` if you want to run development mode (TODO: Currently prod mode not working. will come back to address this later)

# Current Features:
- an input to allow users to enter a recipe url
- after a user submits a url string, the application will pull recipe ingredients and create a shopping list with ingredients.
- user can continue to add more urls and the application will add the new ingredients to the shopping list
- if 2 of the exact same recipe url is added, an error would appear saying the user already entered that recipe url
- if user enters url and the same one again but with query param, no errors would appear and the shopping list would condense itself
- user can check/uncheck ingredients from recipe list. there is a transition when you check/uncheck.
- user can adjust serving scale bar of each recipe entered

# Things to improve/wip/bugs/features/etc:
- add tests
- some recipes would load forever
- condense ingredients and their measurement units
- set all ingredient units to one consistent metric (allow user to choose imperial or metric)
- page.tsx is too big
- a console error regarding onChange on checkbox input (currently using onClick on checkbox, will probably have to refactor)
- if page is refreshed, all data is erased.
- will add functionality to register and login, but login/registration is not required to use the app, but will help if you want to use the app on multiple devices
- will add functionality to store recipe data in browser's storage
- more to come...

