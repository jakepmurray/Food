$ErrorActionPreference = "Stop"
$root = "C:\Users\jakep\OneDrive\Documents\Food"
$outPath = Join-Path $root "sheets\meal_planner_master.xlsx"
if (Test-Path $outPath) { Remove-Item $outPath -Force }

# ---------------- data ----------------

$recipes = @(
  [PSCustomObject]@{recipe_id='R101';name='Chicken Quinoa Power Bowl';category='Lunch';tags='high-protein,high-fiber,meal-prep';is_vegetarian=$false;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='High protein, high fiber, excellent meal prep option.';waste_tips='Save broccoli stems and kale stems for broth. Use leftover quinoa in future bowls.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R102';name='Salmon Brown Rice Bowl';category='Lunch';tags='omega-3,balanced';is_vegetarian=$false;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Omega-3 rich, balanced carb and protein meal.';waste_tips='Use salmon leftovers in salads. Freeze salmon bones for stock if desired.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R103';name='Slow Cooker Salsa Verde Chicken';category='Dinner';tags='high-protein,freezer-friendly,slow-cooker';is_vegetarian=$false;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Very high protein and freezer friendly.';waste_tips='Save chicken bones and vegetable scraps for broth.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R104';name='Chicken Fried Cauliflower Rice';category='Dinner';tags='high-protein,lower-calorie';is_vegetarian=$false;is_vegan=$false;default_servings=4;prep_time_min='';cook_time_min='';calories_per_serving=350;protein_g_per_serving=43;carbs_g_per_serving=17;fat_g_per_serving=11;notes='High protein, lower calorie dinner. Fiber 6.8g/serving per source.';waste_tips='Use leftover rice if extra carbs are needed. Save scallion ends for broth.';source='nutrition-consult/Chicken fried cauliflower rice.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R105';name='Sheet Pan Pork Chops';category='Dinner';tags='high-protein,sheet-pan,easy';is_vegetarian=$false;is_vegan=$false;default_servings=4;prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Easy high-protein sheet pan meal. No macro numbers were given on the recipe card.';waste_tips='Save vegetable peels and pork bones for broth.';source='nutrition-consult/Sheet Pan Pork Chops with Vegetables.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R106';name='Slow Cooker Turkey Chili';category='Dinner';tags='high-protein,high-fiber,freezer-friendly,slow-cooker';is_vegetarian=$false;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='High fiber, high protein, great leftovers.';waste_tips='Use homemade broth and leftover vegetables.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R107';name='Spinach Feta Chicken Burgers';category='Dinner';tags='lean-protein';is_vegetarian=$false;is_vegan=$false;default_servings=6;prep_time_min='';cook_time_min='';calories_per_serving=131;protein_g_per_serving=17;carbs_g_per_serving=6;fat_g_per_serving=5;notes='Lean protein option with good flavor. Sodium 330mg, fiber 1g per serving.';waste_tips='Use leftover spinach in smoothies or eggs.';source='nutrition-consult/Spinach and Mushroom Quinoa Bowl.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R108';name='Shrimp Whole Wheat Pasta';category='Dinner';tags='recovery,high-carb';is_vegetarian=$false;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Great recovery meal with protein and carbs.';waste_tips='Save shrimp shells for seafood stock.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R109';name='Mushroom Lentil Bolognese';category='Dinner';tags='high-fiber,vegetarian,vegan';is_vegetarian=$true;is_vegan=$true;default_servings=4;prep_time_min='';cook_time_min='';calories_per_serving=296;protein_g_per_serving=17;carbs_g_per_serving=49;fat_g_per_serving=6.5;notes='High fiber vegetarian meal. The red wine is optional; leave it out or use a vegan wine to keep this vegan. Assumes plain (eggless) pasta for the vegan flag -- check your pasta brand. Fiber 15g/serving per source.';waste_tips='Freeze extra sauce. Save celery/carrot scraps.';source='nutrition-consult/Mushroom Lentil Bolognese.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R110';name='Turkey Taco Grain Bowl';category='Lunch';tags='high-protein,meal-prep';is_vegetarian=$false;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='High protein bulk lunch.';waste_tips='Use leftover taco meat in wraps or eggs.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R111';name='Mediterranean Quinoa Bowl';category='Lunch';tags='high-fiber,meal-prep';is_vegetarian=$false;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Fiber-rich and meal prep friendly.';waste_tips='Use leftover vegetables in salads or wraps.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R112';name='Tofu Stir Fry';category='Dinner';tags='plant-protein,vegan,vegetarian';is_vegetarian=$true;is_vegan=$true;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Excellent plant protein meal.';waste_tips='Save vegetable scraps for broth.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R113';name='Slow Cooker Chicken Tortilla Soup';category='Dinner';tags='high-protein,slow-cooker,comfort-food';is_vegetarian=$false;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Comforting high-protein soup.';waste_tips='Excellent use for homemade broth.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R114';name='Slow Cooker Lentil Soup';category='Dinner';tags='high-fiber,slow-cooker,filling';is_vegetarian=$false;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Very high fiber and filling. Swap the chicken sausage for a plant-based sausage to make this vegan.';waste_tips='Perfect for using broth and vegetable scraps.';source='Detailed Recipes tab (dietician consult)'}
  [PSCustomObject]@{recipe_id='R115';name='Black Bean and Quinoa Stuffed Peppers';category='Dinner';tags='freezer-friendly,vegetarian';is_vegetarian=$true;is_vegan=$false;default_servings=6;prep_time_min='';cook_time_min='';calories_per_serving=221;protein_g_per_serving=12;carbs_g_per_serving=32;fat_g_per_serving=6;notes='Freezer friendly. Fiber 7.6g/serving per source.';waste_tips='';source='nutrition-consult/Black Bean and Quinoa Stuffed Pepper.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R116';name='Kale and Brussels Sprouts Winter Salad';category='Side';tags='vegan,vegetarian';is_vegetarian=$true;is_vegan=$true;default_servings=4;prep_time_min='';cook_time_min='';calories_per_serving=187;protein_g_per_serving=4.3;carbs_g_per_serving=14.5;fat_g_per_serving=14.2;notes='Fiber rich side salad. Sat fat 1.7g, fiber 4.2g/serving per source.';waste_tips='';source='nutrition-consult/Kale and Brussels sprouts Winter Salad.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R117';name='Lentil Salad';category='Side';tags='meal-prep,vegan,vegetarian';is_vegetarian=$true;is_vegan=$true;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving=220;protein_g_per_serving=10;carbs_g_per_serving='';fat_g_per_serving=8.4;notes='Meal prep side. Source gave a total-batch ingredient list without a serving count, so default_servings and quantity_per_serving are left blank -- see quantity_per_batch in Ingredients. Sat fat 1.2g, fiber 11g, sugar 3g, sodium 27mg per serving; total carbs were not stated on the recipe card.';waste_tips='';source='nutrition-consult/Lentil Salad.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R118';name='Zucchini Noodle Salad';category='Side';tags='lower-calorie,vegetarian';is_vegetarian=$true;is_vegan=$false;default_servings=4;prep_time_min='';cook_time_min='';calories_per_serving=258;protein_g_per_serving=7;carbs_g_per_serving=22;fat_g_per_serving=15;notes='Low calorie vegetable side. Sat fat 3g, fiber 3.9g/serving per source.';waste_tips='';source='nutrition-consult/Zucchini Noodle salad.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R119';name='Whipped Feta Dip with Scallion Oil';category='Snack';tags='dairy,vegetarian';is_vegetarian=$true;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Snack/party dip, serve with pita chips, toasted baguette, or roasted/raw vegetables. No serving count or macro numbers were given on the recipe card, so quantities are listed as quantity_per_batch in Ingredients.';waste_tips='';source='nutrition-consult/Whipped Feta Dip with Spicy Scallion Oil (1).docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R120';name='Spinach and Mushroom Quinoa Bowl';category='Lunch';tags='vegetarian,side-or-main';is_vegetarian=$true;is_vegan=$false;default_servings=4;prep_time_min='';cook_time_min='';calories_per_serving=175;protein_g_per_serving=12;carbs_g_per_serving=17;fat_g_per_serving=8;notes='Eat alone as a side dish or add a protein (e.g. grilled chicken) for a complete meal. Fiber 6.5g/serving per source.';waste_tips='';source='nutrition-consult/Spinach and Mushroom Quinoa Bowl.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R121';name='Honey Mustard Chicken Salad';category='Lunch';tags='high-protein';is_vegetarian=$false;is_vegan=$false;default_servings=4;prep_time_min='';cook_time_min='';calories_per_serving=172;protein_g_per_serving=24;carbs_g_per_serving=3.5;fat_g_per_serving=6;notes='Sugar 2.3g, sodium 146mg per serving per source.';waste_tips='';source='nutrition-consult/Spinach and Mushroom Quinoa Bowl.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R122';name='Tortilla Egg Bake';category='Breakfast';tags='vegetarian,quick';is_vegetarian=$true;is_vegan=$false;default_servings=1;prep_time_min='';cook_time_min=20;calories_per_serving=233;protein_g_per_serving=24;carbs_g_per_serving=36;fat_g_per_serving=6;notes='Sat fat 4g, fiber 16g per serving per source -- the fiber figure looks high relative to the carbs, worth double-checking with your dietician.';waste_tips='';source='nutrition-consult/Tortilla Egg Bake.docx (dietician recipe card)'}
  [PSCustomObject]@{recipe_id='R123';name='Tossed Salad';category='Side';tags='vegan,vegetarian,quick';is_vegetarian=$true;is_vegan=$true;default_servings=1;prep_time_min=5;cook_time_min=0;calories_per_serving=61;protein_g_per_serving=4;carbs_g_per_serving=13;fat_g_per_serving=1;notes='Sodium 53mg, fiber 4g per serving per source. Appears as a side item throughout the sample meal plan.';waste_tips='';source='nutrition-consult/Murray, Jake sample plan.pdf (recipe detail page)'}
  [PSCustomObject]@{recipe_id='G201';name='Everyday High-Protein Granola';category='Breakfast';tags='smoothie-topping,recovery,meal-prep';is_vegetarian=$true;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min=28;calories_per_serving=300;protein_g_per_serving=13.5;carbs_g_per_serving=26;fat_g_per_serving=17;notes='Best use: daily smoothie bowls and recovery. Store in airtight glass jars; freeze nuts/seeds to extend freshness. Macros are the midpoint of the source range (280-320 kcal, 12-15g protein, 24-28g carbs, 16-18g fat) for an assumed ~1/2 cup serving -- confirm against your actual scoop size.';waste_tips='';source='healthy_granola_recipes.xlsx'}
  [PSCustomObject]@{recipe_id='G202';name='Crunchy Peanut Butter Granola';category='Breakfast';tags='high-activity,recovery';is_vegetarian=$true;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Best use: high activity / biking / frisbee days. Higher calorie, higher healthy fats and carbs for recovery (no exact numbers given in source). Works well with banana and yogurt.';waste_tips='';source='healthy_granola_recipes.xlsx'}
  [PSCustomObject]@{recipe_id='G203';name='Low-Sugar Cinnamon Almond Granola';category='Breakfast';tags='low-sugar,everyday';is_vegetarian=$true;is_vegan=$false;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Best use: lower calorie everyday option. Lower sugar and calories, moderate protein and fiber (no exact numbers given in source). Egg white helps create crunch while keeping calories moderate.';waste_tips='';source='healthy_granola_recipes.xlsx'}
  [PSCustomObject]@{recipe_id='G204';name='Savory Granola';category='Side';tags='topping,savory,crouton-replacement';is_vegetarian=$true;is_vegan=$true;default_servings='';prep_time_min='';cook_time_min='';calories_per_serving='';protein_g_per_serving='';carbs_g_per_serving='';fat_g_per_serving='';notes='Best use: salads, grain bowls, soups. Fiber-rich crunchy topping with savory flavor. Use on grain bowls and soups instead of croutons.';waste_tips='';source='healthy_granola_recipes.xlsx'}
)

$ingredients = @()
function AddIng($rid,$name,$cat,$qb='',$ub='') {
  $script:ingredients += [PSCustomObject]@{recipe_id=$rid;ingredient_name=$name;quantity_per_serving='';unit='';quantity_per_batch=$qb;unit_per_batch=$ub;shopping_category=$cat}
}

AddIng 'R101' 'Quinoa' 'Pantry'; AddIng 'R101' 'Chicken breast' 'Meat'; AddIng 'R101' 'Broccoli' 'Produce'; AddIng 'R101' 'Carrots' 'Produce'; AddIng 'R101' 'Kale' 'Produce'; AddIng 'R101' 'Chickpeas' 'Pantry'; AddIng 'R101' 'Greek yogurt' 'Dairy'; AddIng 'R101' 'Tahini' 'Pantry'; AddIng 'R101' 'Lemon' 'Produce'; AddIng 'R101' 'Feta' 'Dairy'; AddIng 'R101' 'Pumpkin seeds' 'Pantry'

AddIng 'R102' 'Brown rice' 'Pantry'; AddIng 'R102' 'Salmon' 'Meat'; AddIng 'R102' 'Cabbage' 'Produce'; AddIng 'R102' 'Cucumber' 'Produce'; AddIng 'R102' 'Edamame' 'Produce'; AddIng 'R102' 'Sweet potato' 'Produce'; AddIng 'R102' 'Yogurt sauce' 'Dairy'; AddIng 'R102' 'Sesame seeds' 'Pantry'

AddIng 'R103' 'Chicken breast' 'Meat'; AddIng 'R103' 'Salsa verde' 'Pantry'; AddIng 'R103' 'Onions' 'Produce'; AddIng 'R103' 'Peppers' 'Produce'; AddIng 'R103' 'Cumin' 'Pantry'; AddIng 'R103' 'Garlic' 'Produce'; AddIng 'R103' 'Black beans' 'Pantry'; AddIng 'R103' 'Rice' 'Pantry'

function AddIngQ($rid,$name,$cat,$qty,$unit) {
  $script:ingredients += [PSCustomObject]@{recipe_id=$rid;ingredient_name=$name;quantity_per_serving=$qty;unit=$unit;quantity_per_batch='';unit_per_batch='';shopping_category=$cat}
}

# R104 Chicken Fried Cauliflower Rice -- 4 servings (nutrition-consult docx)
AddIngQ 'R104' 'Chicken breast' 'Meat' 4 'oz'; AddIngQ 'R104' 'Frozen riced cauliflower' 'Produce' 3 'oz'; AddIngQ 'R104' 'Frozen peas and carrots' 'Produce' 3 'oz'; AddIngQ 'R104' 'Eggs' 'Dairy' 0.5 'each'; AddIngQ 'R104' 'Soy sauce (low sodium)' 'Pantry' 0.5 'tbsp'; AddIngQ 'R104' 'Scallions' 'Produce' 0.125 'cup'; AddIngQ 'R104' 'Onion' 'Produce' 0.25 'each'; AddIngQ 'R104' 'Garlic' 'Produce' 0.25 'clove'; AddIngQ 'R104' 'Fresh ginger' 'Produce' 0.06 'tsp'; AddIngQ 'R104' 'Olive oil' 'Pantry' 0.75 'tbsp'

# R105 Sheet Pan Pork Chops -- 4 servings (nutrition-consult docx)
AddIngQ 'R105' 'Bone-in pork chops (3/4-inch, 4-5oz each)' 'Meat' 1 'each'; AddIngQ 'R105' 'Butternut squash (or carrots or turnips)' 'Produce' 0.25 'lb'; AddIngQ 'R105' 'Olive or avocado oil' 'Pantry' 0.08 'cup'; AddIngQ 'R105' 'Dijon mustard' 'Pantry' 0.25 'tbsp'; AddIngQ 'R105' 'Maple syrup' 'Pantry' 0.25 'tbsp'; AddIngQ 'R105' 'Garlic' 'Produce' 0.75 'clove'; AddIngQ 'R105' 'Fresh ginger' 'Produce' 0.125 'tsp'; AddIngQ 'R105' 'Shallots' 'Produce' 0.5 'tbsp'; AddIngQ 'R105' 'Kosher salt' 'Pantry' 0.125 'tsp'; AddIngQ 'R105' 'Black pepper' 'Pantry' 0.125 'tsp'; AddIngQ 'R105' 'Fresh parsley' 'Produce' 0.5 'tbsp'

AddIng 'R106' 'Lean ground turkey' 'Meat'; AddIng 'R106' 'Beans' 'Pantry'; AddIng 'R106' 'Tomatoes' 'Pantry'; AddIng 'R106' 'Peppers' 'Produce'; AddIng 'R106' 'Onions' 'Produce'; AddIng 'R106' 'Garlic' 'Produce'; AddIng 'R106' 'Chili powder' 'Pantry'; AddIng 'R106' 'Broth' 'Pantry'

# R107 Spinach Feta Chicken Burgers -- 6 servings (nutrition-consult docx)
AddIngQ 'R107' 'Fresh spinach' 'Produce' 2.67 'oz'; AddIngQ 'R107' 'Ground chicken' 'Meat' 2.67 'oz'; AddIngQ 'R107' 'Feta cheese, crumbled' 'Dairy' 0.67 'oz'; AddIngQ 'R107' 'Breadcrumbs' 'Pantry' 0.083 'cup'; AddIngQ 'R107' 'Onion' 'Produce' 0.167 'each'; AddIngQ 'R107' 'Garlic' 'Produce' 0.67 'clove'; AddIngQ 'R107' 'Oregano' 'Pantry' 0.167 'tsp'; AddIngQ 'R107' 'Olive oil' 'Pantry' 0.167 'tsp'; AddIngQ 'R107' 'Whole-grain buns (optional)' 'Pantry' 0.67 'each'

AddIng 'R108' 'Whole wheat pasta' 'Pantry'; AddIng 'R108' 'Shrimp' 'Meat'; AddIng 'R108' 'Spinach' 'Produce'; AddIng 'R108' 'Tomatoes' 'Produce'; AddIng 'R108' 'Garlic' 'Produce'; AddIng 'R108' 'Olive oil' 'Pantry'; AddIng 'R108' 'Lemon' 'Produce'

# R109 Mushroom Lentil Bolognese -- 4 servings (nutrition-consult docx)
AddIngQ 'R109' 'Baby portobella mushrooms' 'Produce' 2 'oz'; AddIngQ 'R109' 'Lentils' 'Pantry' 4 'oz'; AddIngQ 'R109' 'Onion' 'Produce' 0.125 'cup'; AddIngQ 'R109' 'Carrot' 'Produce' 0.125 'cup'; AddIngQ 'R109' 'Celery' 'Produce' 0.083 'cup'; AddIngQ 'R109' 'Garlic' 'Produce' 0.5 'clove'; AddIngQ 'R109' 'Olive oil' 'Pantry' 0.5 'tbsp'; AddIngQ 'R109' 'Red wine (optional)' 'Pantry' 0.125 'cup'; AddIngQ 'R109' 'Crushed tomatoes' 'Pantry' 1 'cup'; AddIngQ 'R109' 'Fresh basil' 'Produce' 0.5 'tbsp'; AddIngQ 'R109' 'Fresh parsley' 'Produce' 0.5 'tbsp'

AddIng 'R110' 'Lean ground turkey' 'Meat'; AddIng 'R110' 'Rice' 'Pantry'; AddIng 'R110' 'Black beans' 'Pantry'; AddIng 'R110' 'Peppers' 'Produce'; AddIng 'R110' 'Corn' 'Produce'; AddIng 'R110' 'Salsa' 'Pantry'; AddIng 'R110' 'Avocado' 'Produce'

AddIng 'R111' 'Quinoa' 'Pantry'; AddIng 'R111' 'Cucumbers' 'Produce'; AddIng 'R111' 'Tomatoes' 'Produce'; AddIng 'R111' 'Chickpeas' 'Pantry'; AddIng 'R111' 'Olives' 'Pantry'; AddIng 'R111' 'Feta' 'Dairy'; AddIng 'R111' 'Chicken' 'Meat'; AddIng 'R111' 'Hummus' 'Pantry'

AddIng 'R112' 'Tofu' 'Meat'; AddIng 'R112' 'Broccoli' 'Produce'; AddIng 'R112' 'Carrots' 'Produce'; AddIng 'R112' 'Snap peas' 'Produce'; AddIng 'R112' 'Garlic' 'Produce'; AddIng 'R112' 'Ginger' 'Produce'; AddIng 'R112' 'Soy sauce' 'Pantry'; AddIng 'R112' 'Rice' 'Pantry'

AddIng 'R113' 'Chicken breast' 'Meat'; AddIng 'R113' 'Broth' 'Pantry'; AddIng 'R113' 'Tomatoes' 'Pantry'; AddIng 'R113' 'Beans' 'Pantry'; AddIng 'R113' 'Onions' 'Produce'; AddIng 'R113' 'Peppers' 'Produce'; AddIng 'R113' 'Tortillas' 'Pantry'; AddIng 'R113' 'Spices' 'Pantry'

AddIng 'R114' 'Lentils' 'Pantry'; AddIng 'R114' 'Carrots' 'Produce'; AddIng 'R114' 'Celery' 'Produce'; AddIng 'R114' 'Onion' 'Produce'; AddIng 'R114' 'Broth' 'Pantry'; AddIng 'R114' 'Chicken sausage' 'Meat'; AddIng 'R114' 'Herbs' 'Produce'

# R115 Black Bean and Quinoa Stuffed Peppers -- 6 servings (nutrition-consult docx)
AddIngQ 'R115' 'Red bell peppers' 'Produce' 0.5 'each'; AddIngQ 'R115' 'Olive oil' 'Pantry' 0.33 'tbsp'; AddIngQ 'R115' 'Onion' 'Produce' 0.083 'cup'; AddIngQ 'R115' 'Black beans (canned)' 'Pantry' 2.5 'oz'; AddIngQ 'R115' 'Quinoa' 'Pantry' 0.167 'cup'; AddIngQ 'R115' 'Scallions' 'Produce' 0.083 'cup'; AddIngQ 'R115' 'Garlic' 'Produce' 0.33 'clove'; AddIngQ 'R115' 'Canned green chiles' 'Pantry' 0.33 'oz'; AddIngQ 'R115' 'Cumin' 'Pantry' 0.167 'tbsp'; AddIngQ 'R115' 'Shredded cheese' 'Dairy' 0.083 'cup'

# R116 Kale and Brussels Sprouts Winter Salad -- 4 servings (nutrition-consult docx)
AddIngQ 'R116' 'Shallots' 'Produce' 0.25 'tbsp'; AddIngQ 'R116' 'Olive oil' 'Pantry' 0.125 'cup'; AddIngQ 'R116' 'Lemon' 'Produce' 0.125 'each'; AddIngQ 'R116' 'Dijon mustard' 'Pantry' 0.5 'tsp'; AddIngQ 'R116' 'Garlic' 'Produce' 0.25 'clove'; AddIngQ 'R116' 'Brussels sprouts' 'Produce' 2 'oz'; AddIngQ 'R116' 'Kale' 'Produce' 0.75 'cup'; AddIngQ 'R116' 'Mandarin orange' 'Produce' 0.25 'each'; AddIngQ 'R116' 'Slivered almonds' 'Pantry' 0.125 'cup'

# R117 Lentil Salad -- no serving count given in source, so per-serving quantities are blank; totals kept in quantity_per_batch
AddIng 'R117' 'Green or brown lentils' 'Pantry' 1 'lb'; AddIng 'R117' 'Garlic' 'Produce' 1 'clove'; AddIng 'R117' 'Bay leaf' 'Pantry' 1 'each'; AddIng 'R117' 'Crushed red pepper' 'Pantry' 0.5 'tsp'; AddIng 'R117' 'Carrots' 'Produce' 1 'cup'; AddIng 'R117' 'Bell peppers' 'Produce' 0.5 'cup'; AddIng 'R117' 'Red onion' 'Produce' 0.5 'cup'; AddIng 'R117' 'Lemon juice' 'Produce' 0.5 'cup'; AddIng 'R117' 'Olive oil' 'Pantry' 0.5 'cup'; AddIng 'R117' 'Fresh parsley' 'Produce' 1 'tbsp'; AddIng 'R117' 'Oregano' 'Pantry' 0.5 'tsp'; AddIng 'R117' 'Garlic powder' 'Pantry' 0.5 'tsp'

# R118 Zucchini Noodle Salad -- 4 servings (nutrition-consult docx)
AddIngQ 'R118' 'Zucchini' 'Produce' 0.5 'each'; AddIngQ 'R118' 'Red onion' 'Produce' 0.125 'each'; AddIngQ 'R118' 'Artichokes' 'Pantry' 0.25 'cup'; AddIngQ 'R118' 'Grape tomatoes' 'Produce' 0.167 'cup'; AddIngQ 'R118' 'Chickpeas' 'Pantry' 0.167 'cup'; AddIngQ 'R118' 'Kalamata olives' 'Pantry' 0.0625 'cup'; AddIngQ 'R118' 'Feta' 'Dairy' 0.083 'cup'; AddIngQ 'R118' 'Olive oil' 'Pantry' 0.125 'cup'; AddIngQ 'R118' 'Red wine vinegar' 'Pantry' 0.5 'tbsp'; AddIngQ 'R118' 'Lemon juice' 'Produce' 0.25 'tbsp'; AddIngQ 'R118' 'Oregano' 'Pantry' 0.25 'tsp'; AddIngQ 'R118' 'Dijon mustard' 'Pantry' 0.25 'tsp'; AddIngQ 'R118' 'Garlic' 'Produce' 0.25 'clove'; AddIngQ 'R118' 'Shallots' 'Produce' 0.5 'tbsp'; AddIngQ 'R118' 'Fresh parsley' 'Produce' 0.5 'tbsp'

# R119 Whipped Feta Dip -- no serving count given in source; totals kept in quantity_per_batch
AddIng 'R119' 'Extra virgin olive oil' 'Pantry' 3 'tbsp'; AddIng 'R119' 'Scallions' 'Produce' 3 'each'; AddIng 'R119' 'Chili flakes' 'Pantry' 1 'tsp'; AddIng 'R119' 'Honey' 'Pantry' 1.5 'tbsp'; AddIng 'R119' 'Feta cheese' 'Dairy' 7 'oz'; AddIng 'R119' 'Ricotta' 'Dairy' 5 'oz'; AddIng 'R119' 'Plain Greek yogurt' 'Dairy' 4 'oz'

# R120 Spinach and Mushroom Quinoa Bowl -- 4 servings (nutrition-consult docx)
AddIngQ 'R120' 'Quinoa' 'Pantry' 0.25 'cup'; AddIngQ 'R120' 'Olive oil' 'Pantry' 0.5 'tbsp'; AddIngQ 'R120' 'Spinach' 'Produce' 0.5 'lb'; AddIngQ 'R120' 'Garlic' 'Produce' 0.25 'clove'; AddIngQ 'R120' 'Exotic mushroom blend' 'Produce' 2 'oz'; AddIngQ 'R120' 'Thyme' 'Pantry' 0.5 'tsp'; AddIngQ 'R120' 'Parmesan' 'Dairy' 0.083 'cup'

# R121 Honey Mustard Chicken Salad -- 4 servings (nutrition-consult docx)
AddIngQ 'R121' 'Plain low-fat yogurt' 'Dairy' 0.125 'cup'; AddIngQ 'R121' 'Dijon mustard' 'Pantry' 0.25 'tbsp'; AddIngQ 'R121' 'Fresh parsley' 'Produce' 0.5 'tbsp'; AddIngQ 'R121' 'Honey' 'Pantry' 0.25 'tsp'; AddIngQ 'R121' 'Lemon zest' 'Produce' 0.125 'tsp'; AddIngQ 'R121' 'Fresh lemon juice' 'Produce' 0.25 'tsp'; AddIngQ 'R121' 'Chicken breast, cooked and shredded' 'Meat' 0.5 'cup'; AddIngQ 'R121' 'Toasted almonds' 'Pantry' 0.125 'cup'

# R122 Tortilla Egg Bake -- makes 1 serving (nutrition-consult docx)
AddIngQ 'R122' 'Carb-balanced tortilla' 'Pantry' 1 'each'; AddIngQ 'R122' 'Egg whites' 'Dairy' 4 'oz'; AddIngQ 'R122' 'Sauteed mushrooms' 'Produce' 0.33 'cup'; AddIngQ 'R122' 'Sauteed onions' 'Produce' 0.33 'cup'; AddIngQ 'R122' 'Feta, crumbled' 'Dairy' 2 'tbsp'; AddIngQ 'R122' 'Grape tomatoes' 'Produce' 5 'each'; AddIngQ 'R122' 'Olive oil' 'Pantry' 1 'tbsp'

# R123 Tossed Salad -- makes 1 serving (sample plan PDF, recipe detail page)
AddIngQ 'R123' 'Green leaf lettuce, shredded' 'Produce' 3 'cup'; AddIngQ 'R123' 'Onion (large slice, 1/4-inch thick)' 'Produce' 1 'slice'; AddIngQ 'R123' 'Red tomatoes, chopped' 'Produce' 0.25 'cup'; AddIngQ 'R123' 'Cucumber, peeled and chopped' 'Produce' 0.5 'cup'; AddIngQ 'R123' 'Green bell pepper, sliced' 'Produce' 0.25 'cup'

AddIng 'G201' 'Rolled oats' 'Pantry' 3 'cup'; AddIng 'G201' 'Walnuts' 'Pantry' 1 'cup'; AddIng 'G201' 'Almonds' 'Pantry' 1 'cup'; AddIng 'G201' 'Pumpkin seeds' 'Pantry' 0.5 'cup'; AddIng 'G201' 'Chia seeds' 'Pantry' 0.25 'cup'; AddIng 'G201' 'Flax meal' 'Pantry' 0.25 'cup'; AddIng 'G201' 'Cinnamon' 'Pantry'; AddIng 'G201' 'Salt' 'Pantry'; AddIng 'G201' 'Maple syrup' 'Pantry' 0.333 'cup'; AddIng 'G201' 'Olive oil' 'Pantry' 0.25 'cup'; AddIng 'G201' 'Vanilla' 'Pantry'; AddIng 'G201' 'Coconut flakes (optional)' 'Pantry'; AddIng 'G201' 'Whey isolate' 'Pantry' 1 'scoop'

AddIng 'G202' 'Rolled oats' 'Pantry' 3 'cup'; AddIng 'G202' 'Natural peanut butter' 'Pantry' 0.5 'cup'; AddIng 'G202' 'Maple syrup' 'Pantry' 0.25 'cup'; AddIng 'G202' 'Honey' 'Pantry' 2 'tbsp'; AddIng 'G202' 'Chopped peanuts' 'Pantry'; AddIng 'G202' 'Hemp seeds' 'Pantry'; AddIng 'G202' 'Cinnamon' 'Pantry'; AddIng 'G202' 'Salt' 'Pantry'; AddIng 'G202' 'Dark chocolate (optional)' 'Pantry'

AddIng 'G203' 'Rolled oats' 'Pantry' 4 'cup'; AddIng 'G203' 'Almonds' 'Pantry' 1 'cup'; AddIng 'G203' 'Sunflower seeds' 'Pantry' 0.5 'cup'; AddIng 'G203' 'Flax meal' 'Pantry' 0.25 'cup'; AddIng 'G203' 'Egg white' 'Dairy' 1 'each'; AddIng 'G203' 'Applesauce' 'Pantry' 0.25 'cup'; AddIng 'G203' 'Maple syrup' 'Pantry' 2 'tbsp'; AddIng 'G203' 'Cinnamon' 'Pantry'; AddIng 'G203' 'Vanilla' 'Pantry'; AddIng 'G203' 'Salt' 'Pantry'

AddIng 'G204' 'Oats' 'Pantry'; AddIng 'G204' 'Pumpkin seeds' 'Pantry'; AddIng 'G204' 'Sesame seeds' 'Pantry'; AddIng 'G204' 'Olive oil' 'Pantry'; AddIng 'G204' 'Smoked paprika' 'Pantry'; AddIng 'G204' 'Garlic powder' 'Pantry'; AddIng 'G204' 'Black pepper' 'Pantry'; AddIng 'G204' 'Nutritional yeast' 'Pantry'

$instructions = @()
function AddSteps($rid, [string[]]$steps) {
  $n = 1
  foreach ($s in $steps) {
    $script:instructions += [PSCustomObject]@{recipe_id=$rid;step_number=$n;instruction_text=$s}
    $n++
  }
}

AddSteps 'R101' @('Cook quinoa according to package instructions.','Roast broccoli and carrots at 425F until browned.','Season and roast or grill chicken breast.','Massage kale lightly with lemon juice.','Mix greek yogurt, tahini, lemon, garlic, salt, and pepper for sauce.','Assemble bowls and top with feta and pumpkin seeds.')
AddSteps 'R102' @('Cook brown rice.','Roast sweet potatoes.','Bake salmon at 400F until flaky.','Assemble bowls with vegetables and rice.','Top with yogurt sauce and sesame seeds.')
AddSteps 'R103' @('Add chicken, salsa verde, onions, peppers, garlic, and cumin to slow cooker.','Cook 6-8 hours on low.','Shred chicken and stir.','Serve over rice with black beans and cabbage slaw.')
AddSteps 'R104' @('Heat a large skillet over medium heat, add 1.5 tbsp olive oil, add chicken, and stir continuously while cooking until cooked through (no longer pink). Remove from heat.','Add the remaining oil and saute onion until soft but not browned.','Add riced cauliflower and peas and carrots. Cover and cook until vegetables are heated through.','Push vegetables to the edges of the skillet to make a well in the middle. Add eggs and cook while stirring frequently; once they begin to cook, incorporate them throughout the mixture.','Add the chicken back to the mixture, stir in soy sauce, and cook 5 more minutes.','Arrange on a serving plate and sprinkle with chopped scallions.')
AddSteps 'R105' @('Preheat the oven to 450F.','Whisk together 2 tbsp oil, maple syrup, salt, and pepper in a small bowl.','Dip pork chops in the bowl, then place on one side of a large baking sheet.','Toss the butternut squash with 1 tbsp olive oil in a medium bowl, then place on the other side of the sheet pan.','Sprinkle the minced garlic, ginger, and remaining salt and pepper over everything.','Roast 10 minutes, then broil until the pork chops are lightly browned.')
AddSteps 'R106' @('Brown turkey.','Add all ingredients to slow cooker.','Cook 6-8 hours.','Serve with rice, avocado, and greek yogurt.')
AddSteps 'R107' @('Chop washed spinach and saute in 1 tsp olive oil until wilted; allow to cool.','Preheat grill to medium-high.','Place ground chicken in a large bowl. Gently crumble the feta and add along with breadcrumbs, chopped onion, spinach, minced garlic, salt, pepper, and oregano.','Divide into 6 equal portions and form into patties.','Grill 4-5 minutes per side, or until internal temperature reaches 160F.')
AddSteps 'R108' @('Cook pasta.','Saute garlic and shrimp.','Add tomatoes and spinach.','Toss with pasta and lemon juice.')
AddSteps 'R109' @('In a large stockpot, bring 6-8 cups of water to a boil.','Add lentils and cook for 18 minutes, drain, toss with a small amount of olive oil, and set aside.','In a large saute pan, add 2 tbsp olive oil and swirl to coat.','Add onions, celery, and carrots and saute until soft; add mushrooms and red wine, and cook 3 more minutes.','Add the cooked lentils, basil, and parsley; stir together.','Add the crushed tomatoes and simmer for 30 minutes.','Serve over your favorite pasta.')
AddSteps 'R110' @('Brown turkey with taco seasoning.','Cook rice.','Roast peppers and corn.','Assemble bowls with toppings.')
AddSteps 'R111' @('Cook quinoa.','Chop vegetables.','Roast or grill chicken.','Assemble bowls with hummus and feta.')
AddSteps 'R112' @('Press and cube tofu.','Brown tofu.','Stir fry vegetables.','Add sauce and serve over rice.')
AddSteps 'R113' @('Add ingredients to slow cooker.','Cook until chicken is tender.','Shred chicken.','Serve with tortilla strips.')
AddSteps 'R114' @('Add ingredients to slow cooker.','Cook until lentils soften.','Slice and add chicken sausage near end.')
AddSteps 'R115' @('Preheat oven to 400F.','Cook 1 cup quinoa in 2 cups water until tender.','Wipe peppers with olive oil, place on a baking sheet, and roast for 10 minutes.','In a large saute pan, saute onions and scallions for 3-5 minutes; add garlic and saute 1 more minute.','In a large bowl, mix the quinoa, black beans, chiles, sauteed vegetables, and cumin.','Add 1 tbsp olive oil to a baking dish and arrange the peppers; divide the quinoa mixture evenly among them.','Top with shredded cheese and bake at 350F for 25-30 minutes, until heated through and bubbly.','Remove from oven and garnish with the remaining scallions.')
AddSteps 'R116' @('Whisk together the olive oil, lemon juice, garlic, and Dijon mustard in a small bowl until well combined; salt and pepper to taste.','Wash and pat dry the Brussels sprouts, then slice thin.','Wash and dry the kale, cut or tear into bite-size pieces, and add to a large bowl with the Brussels sprouts.','Drizzle dressing over the mixture and top with mandarin orange and almonds.')
AddSteps 'R117' @('Add lentils to a medium bowl and rinse.','Add to a medium stockpot with the water, bring to a boil, then simmer 20-25 minutes until tender but firm.','Whisk together the olive oil, lemon juice, parsley, garlic powder, and oregano for the dressing.','Drain the lentils well and remove the bay leaf.','In a large bowl, toss the lentils together with the vegetables and dressing.')
AddSteps 'R118' @('In a small bowl, whisk together the dressing ingredients.','Spiralize the zucchini and pat dry.','Add the zucchini noodles, onion, artichokes, tomatoes, chickpeas, and olives to a bowl and toss together.','Sprinkle feta on top, then parsley.','Drizzle with dressing.')
AddSteps 'R119' @('Add the oil to a medium saute pan.','Add the scallions and red pepper flakes; saute until softened, about 4-5 minutes.','Remove from heat and pour into a small bowl; drizzle in the honey and stir again, then set aside.','Using a food processor, combine the feta, ricotta, and Greek yogurt. Pulse until smooth and creamy, about 2 minutes; season with a small amount of salt.','Spoon the feta dip into a serving bowl and drizzle the scallion oil over top just before serving.','Serve with pita chips, toasted baguette, or roasted/raw vegetables.')
AddSteps 'R120' @('Bring water to a boil, add quinoa, cover, and reduce to a simmer. Cook until tender and the water is absorbed; remove from heat.','Heat olive oil in a skillet; saute spinach until wilted.','Add garlic and cook 1 more minute; add mushrooms and cook until lightly browned.','Add the spinach back to the pan and mix with the quinoa.','Eat alone as a side dish or add a protein for a complete meal.')
AddSteps 'R121' @('Cook chicken, seasoned with salt and pepper, to an internal temperature of 160F.','Whisk together the yogurt, mustard, honey, chopped parsley, lemon zest, and lemon juice.','Add the chicken and toss together.')
AddSteps 'R122' @('Add 1 tbsp olive oil to a small pie pan.','Place the tortilla shell in the bottom of the pan, allowing it to go up the sides.','Pour the egg whites onto the shell, add the sauteed vegetables and feta, and bake for 20 minutes or until set.','Remove from the oven and sprinkle with grape tomatoes.')
AddSteps 'R123' @('Toss all ingredients together.')
AddSteps 'G201' @('Bake at 325F for approximately 28 minutes, stirring halfway.','Cool completely.','Mix in whey protein.')
AddSteps 'G202' @('Mix all ingredients.','Bake at 325F until golden and crunchy.')
AddSteps 'G203' @('Whisk wet ingredients separately.','Combine wet and dry ingredients.','Bake until crisp.')
AddSteps 'G204' @('Bake until toasted and crispy, stirring occasionally.')

$waste = @(
  [PSCustomObject]@{scrap_id='W01';scrap_source='Chicken bones';match_keywords='chicken';reuse_type='Broth/Stock';reuse_description='Simmer with water, onion, celery, and carrot scraps to make chicken stock.';store_method='Freeze in a gallon bag until you have enough';notes='Roast bones first for deeper flavor.';source='Dietician consult (Broth Workflow / Waste Reduction Strategy tabs)'}
  [PSCustomObject]@{scrap_id='W02';scrap_source='Shrimp shells';match_keywords='shrimp';reuse_type='Broth/Stock';reuse_description='Simmer shells to make a seafood stock for rice or soup bases.';store_method='Freeze separately from other scraps';notes='Excellent for rice or soup bases.';source='Dietician consult (Broth Workflow / Waste Reduction Strategy tabs)'}
  [PSCustomObject]@{scrap_id='W03';scrap_source='Onion skins/ends';match_keywords='onion';reuse_type='Broth/Stock';reuse_description='Add to a vegetable stock bag for broth.';store_method='Freeze in a scrap bag';notes='Adds color and sweetness.';source='Dietician consult (Broth Workflow / Waste Reduction Strategy tabs)'}
  [PSCustomObject]@{scrap_id='W04';scrap_source='Celery tops/leaves';match_keywords='celery';reuse_type='Broth/Stock';reuse_description='Add to a vegetable stock bag for broth.';store_method='Freeze';notes='Adds aromatic flavor.';source='Dietician consult (Broth Workflow / Waste Reduction Strategy tabs)'}
  [PSCustomObject]@{scrap_id='W05';scrap_source='Carrot peels';match_keywords='carrot';reuse_type='Broth/Stock';reuse_description='Add to a vegetable stock bag for broth.';store_method='Freeze';notes='Adds sweetness.';source='Dietician consult (Broth Workflow / Waste Reduction Strategy tabs)'}
  [PSCustomObject]@{scrap_id='W06';scrap_source='Herb stems (parsley/cilantro)';match_keywords='herbs,parsley,cilantro';reuse_type='Broth/Stock';reuse_description='Add to stocks and soups for extra flavor.';store_method='Freeze';notes='Parsley/cilantro stems work especially well.';source='Dietician consult (Broth Workflow / Waste Reduction Strategy tabs)'}
  [PSCustomObject]@{scrap_id='W07';scrap_source='Parmesan rinds';match_keywords='parmesan';reuse_type='Broth/Stock';reuse_description='Simmer in lentil or vegetable soups for extra umami, then discard.';store_method='Freeze';notes='Excellent in lentil soups.';source='Dietician consult (Broth Workflow / Waste Reduction Strategy tabs)'}
  [PSCustomObject]@{scrap_id='W08';scrap_source='Broccoli stems / kale stems';match_keywords='broccoli,kale';reuse_type='Broth/Stock';reuse_description='Chop and add to a vegetable stock bag, or dice finely into stir-fries.';store_method='Freeze or use within a few days';notes='Called out specifically in the Chicken Quinoa Power Bowl tips.';source='Dietician consult (Detailed Recipes tab, per-recipe tips)'}
  [PSCustomObject]@{scrap_id='W09';scrap_source='Salmon skin/bones';match_keywords='salmon';reuse_type='Broth/Stock';reuse_description='Freeze and simmer for a light fish stock, if desired.';store_method='Freeze';notes='Optional -- only if you want to make fish stock.';source='Dietician consult (Detailed Recipes tab, per-recipe tips)'}
  [PSCustomObject]@{scrap_id='W10';scrap_source='Scallion ends';match_keywords='scallion';reuse_type='Repurposed Meal';reuse_description='Add to a vegetable stock bag, or place cut ends in a glass of water on a sunny windowsill to regrow a second harvest.';store_method='Freeze, or regrow in water';notes='Called out in the Chicken Fried Cauliflower Rice tips.';source='Dietician consult (Detailed Recipes tab, per-recipe tips)'}
  [PSCustomObject]@{scrap_id='W11';scrap_source='Pork bones';match_keywords='pork';reuse_type='Broth/Stock';reuse_description='Simmer with vegetable scraps for a rich pork stock.';store_method='Freeze';notes='Called out in the Sheet Pan Pork Chops tips.';source='Dietician consult (Detailed Recipes tab, per-recipe tips)'}
  [PSCustomObject]@{scrap_id='W12';scrap_source='Leftover rice or quinoa';match_keywords='rice,quinoa';reuse_type='Repurposed Meal';reuse_description='Reuse in fried rice, soup, or the next grain bowl instead of cooking a fresh batch.';store_method='Refrigerate up to 4 days';notes='"Prep once, use twice."';source='Dietician consult (Waste Reduction Strategy tab)'}
  [PSCustomObject]@{scrap_id='W13';scrap_source='Roasted vegetables (leftover)';match_keywords='';reuse_type='Repurposed Meal';reuse_description='Blend with broth into a quick pureed soup.';store_method='Refrigerate';notes='';source='Dietician consult (Waste Reduction Strategy tab)'}
  [PSCustomObject]@{scrap_id='W14';scrap_source='Leftover shredded/cooked chicken';match_keywords='';reuse_type='Repurposed Meal';reuse_description='Reuse in wraps or salads for a fast lunch protein.';store_method='Refrigerate up to 3-4 days';notes='';source='Dietician consult (Waste Reduction Strategy tab)'}
  [PSCustomObject]@{scrap_id='W15';scrap_source='Extra sauce/chili/bolognese portions';match_keywords='';reuse_type='Repurposed Meal';reuse_description='Portion and freeze rather than letting extras go to waste.';store_method='Freeze in single-meal portions';notes='Called out for the Turkey Chili and Mushroom Lentil Bolognese.';source='Dietician consult (Monthly Meal Plan tab)'}
  [PSCustomObject]@{scrap_id='W16';scrap_source='Eggshells';match_keywords='egg';reuse_type='Compost/Fertilizer';reuse_description='Rinse, air-dry, and crush for a calcium-rich garden fertilizer, or use a larger piece as a natural abrasive for scrubbing pans.';store_method='Rinse and air-dry before crushing or storing';notes='';source='App suggestion (general knowledge, not from your source sheets) -- added per your request'}
)

# Daily nutrition targets from Jake's 2/14/2025 consult with Laura Zervos, MBA, RDN, LDN.
# target_amount is left as text since a couple of rows are ranges, not single numbers --
# the app only does numeric math on calories/protein/carbs/fat.
$targets = @(
  [PSCustomObject]@{metric='calories';target_amount='2771';unit='kcal';notes='Recommended Nutritional Breakdown handout, 2/14/2025. The consult letter rounds this to ~2775, and suggests raising it to 2900-3000 on days with more biking/Ultimate Frisbee activity.'}
  [PSCustomObject]@{metric='protein';target_amount='152';unit='g';notes='22% of calories.'}
  [PSCustomObject]@{metric='carbohydrates';target_amount='346';unit='g';notes='50% of calories.'}
  [PSCustomObject]@{metric='fat';target_amount='86';unit='g';notes='28% of calories. Keep total fat to <=30% of calories; favor sources like avocado, nuts, and salmon.'}
  [PSCustomObject]@{metric='saturated_fat';target_amount='30';unit='g';notes='Keep saturated fat under 10% of total calories.'}
  [PSCustomObject]@{metric='fiber';target_amount='35-40';unit='g';notes='Consult letter recommendation.'}
  [PSCustomObject]@{metric='sugar';target_amount='40';unit='g';notes='Less than 40g/day, consult letter recommendation.'}
  [PSCustomObject]@{metric='sodium';target_amount='2300';unit='mg';notes='Consult letter: "it may be closer to 2800" at this calorie level.'}
  [PSCustomObject]@{metric='fruit_veg_servings';target_amount='5-7';unit='servings/day';notes='Combined fruit and vegetable servings per day, with emphasis on vegetables.'}
)

# ---------------- write workbook via Excel COM ----------------

$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false
$wb = $excel.Workbooks.Add()

function Get-Sheet($wb, $name) {
  $ws = $wb.Worksheets.Add([System.Reflection.Missing]::Value, $wb.Worksheets.Item($wb.Worksheets.Count))
  $ws.Name = $name
  return $ws
}

function Write-Sheet($ws, [array]$data, [string[]]$columns, [int[]]$textColumns = @()) {
  $rows = $data.Count + 1
  $cols = $columns.Count
  # Force these 1-based column indices to Text format first, so values like "5-7" don't get
  # auto-parsed into dates by Excel.
  foreach ($tc in $textColumns) {
    $ws.Range($ws.Cells.Item(2,$tc), $ws.Cells.Item([Math]::Max($rows,2),$tc)).NumberFormat = "@"
  }
  $grid = New-Object 'object[,]' $rows,$cols
  for ($c = 0; $c -lt $cols; $c++) { $grid[0,$c] = $columns[$c] }
  for ($r = 0; $r -lt $data.Count; $r++) {
    for ($c = 0; $c -lt $cols; $c++) {
      $val = $data[$r].($columns[$c])
      if ($null -eq $val) { $val = "" }
      $grid[($r+1),$c] = $val
    }
  }
  $range = $ws.Range($ws.Cells.Item(1,1), $ws.Cells.Item($rows,$cols))
  $range.Value2 = $grid
  $headerRange = $ws.Range($ws.Cells.Item(1,1), $ws.Cells.Item(1,$cols))
  $headerRange.Font.Bold = $true
  $headerRange.Interior.Color = 13561798
  $ws.Columns.AutoFit() | Out-Null
}

# ReadMe
$readme = @(
  [PSCustomObject]@{Section='Purpose';Details='Master recipe and meal-planning data for the GitHub Pages meal planner app.'}
  [PSCustomObject]@{Section='Tabs the app reads';Details='Recipes, Ingredients, Instructions, WasteReduction, NutritionTargets'}
  [PSCustomObject]@{Section='NutritionTargets tab';Details='One row per daily target metric (calories, protein, carbs, fat, saturated fat, fiber, sugar, sodium, fruit/veg servings), sourced from your 2/14/2025 dietician consult. The app compares your Weekly Planner totals against calories/protein/carbs/fat; the rest are shown for reference.'}
  [PSCustomObject]@{Section='Reference-only tabs';Details="Everything prefixed 'Ref - ' is preserved from your original planning docs for your own use; the app does not read these."}
  [PSCustomObject]@{Section='TBD fields';Details='Many recipes are missing exact ingredient quantities, default servings, prep/cook time, and macros because the source material did not specify them. Fill these in over time -- blanks are handled gracefully by the app (it will show "add quantity" / hide macros rather than displaying a false zero).'}
  [PSCustomObject]@{Section='Vegan / Vegetarian flags';Details='TRUE/FALSE where confidently determined from the listed ingredients; blank means not yet determined (usually because the recipe still needs its full ingredient list added -- see the "needs-detail" tag in Recipes).'}
  [PSCustomObject]@{Section='quantity_per_batch / unit_per_batch';Details='Informational only, not read by the app. A few recipes (the granolas) gave a total-batch quantity rather than a per-serving amount in the source material. Use these to work out your own quantity_per_serving once you know your batch/serving size.'}
  [PSCustomObject]@{Section='Adding a new recipe';Details='Add one row to Recipes with a new recipe_id, one row per ingredient to Ingredients, and one row per step to Instructions, all sharing that recipe_id. No other tab needs to change.'}
  [PSCustomObject]@{Section='Waste reduction matching';Details='The app matches WasteReduction.match_keywords (comma-separated, case-insensitive) against ingredient names in your current weekly plan to auto-suggest scrap reuse ideas. Leave match_keywords blank for general tips that should always show rather than being ingredient-triggered.'}
  [PSCustomObject]@{Section='Publishing to the app';Details='File > Share > Publish to web > CSV, per tab (must be link-shareable). Then set spreadsheetId and each tab gid in js/data-adapter.js in the app, and flip CONFIG.source to "sheet".'}
)
$wsReadme = $wb.Worksheets.Item(1)
$wsReadme.Name = "ReadMe"
Write-Sheet $wsReadme $readme @('Section','Details')
$wsReadme.Columns.Item(2).ColumnWidth = 100
$wsReadme.Columns.Item(2).WrapText = $true

$wsRecipes = Get-Sheet $wb "Recipes"
Write-Sheet $wsRecipes $recipes @('recipe_id','name','category','tags','is_vegetarian','is_vegan','default_servings','prep_time_min','cook_time_min','calories_per_serving','protein_g_per_serving','carbs_g_per_serving','fat_g_per_serving','notes','waste_tips','source')

$wsIngredients = Get-Sheet $wb "Ingredients"
Write-Sheet $wsIngredients $ingredients @('recipe_id','ingredient_name','quantity_per_serving','unit','quantity_per_batch','unit_per_batch','shopping_category')

$wsInstructions = Get-Sheet $wb "Instructions"
Write-Sheet $wsInstructions $instructions @('recipe_id','step_number','instruction_text')

$wsWaste = Get-Sheet $wb "WasteReduction"
Write-Sheet $wsWaste $waste @('scrap_id','scrap_source','match_keywords','reuse_type','reuse_description','store_method','notes','source')

$wsTargets = Get-Sheet $wb "NutritionTargets"
Write-Sheet $wsTargets $targets @('metric','target_amount','unit','notes') @(2)

# ---------------- copy reference sheets from source workbooks ----------------

function Copy-RefSheet($srcWb, $srcName, $newName) {
  $srcSheet = $srcWb.Worksheets.Item($srcName)
  $srcSheet.Copy([System.Reflection.Missing]::Value, $wb.Worksheets.Item($wb.Worksheets.Count))
  $wb.Worksheets.Item($wb.Worksheets.Count).Name = $newName
}

$monthlyWb = $excel.Workbooks.Open((Join-Path $root "sheets\monthly_meal_plan_jake_murray.xlsx"), 0, $true)
Copy-RefSheet $monthlyWb "Week 1" "Ref - Week 1"
Copy-RefSheet $monthlyWb "Week 2" "Ref - Week 2"
Copy-RefSheet $monthlyWb "Week 3" "Ref - Week 3"
Copy-RefSheet $monthlyWb "Week 4" "Ref - Week 4"
Copy-RefSheet $monthlyWb "Master Shopping List" "Ref - Master Shopping List"
Copy-RefSheet $monthlyWb "Recipe Rotation" "Ref - Recipe Rotation"
$monthlyWb.Close($false)

$granolaWb = $excel.Workbooks.Open((Join-Path $root "sheets\healthy_granola_recipes.xlsx"), 0, $true)
Copy-RefSheet $granolaWb "Ingredient Overlap" "Ref - Granola Overlap"
$granolaWb.Close($false)

$detailWb = $excel.Workbooks.Open((Join-Path $root "sheets\detailed_recipe_collection_jake_murray.xlsx"), 0, $true)
Copy-RefSheet $detailWb "Broth Workflow" "Ref - Broth Workflow (raw)"
$detailWb.Close($false)

$consultLetter = @(
  [PSCustomObject]@{Paragraph='February 14, 2025 -- Subject: Nutrition Consult for Jake Murray'}
  [PSCustomObject]@{Paragraph='Dear Jake, It was a pleasure to meet you today to discuss your nutritional concerns and other activities related to your wellness. Below find my recommendations as per the initial consult. I am recommending an intake of approximately 2775 calories to maintain your current weight at your current activity level. After you begin increasing biking and the Ultimate Frisbee summer league, that may increase to 2900-3000. Attached is a handout with your goals for fat, protein, and carbohydrate. Below are the additional recommendations for general wellness.'}
  [PSCustomObject]@{Paragraph='Keep fat to 30% of your total calories (it can be higher if it is from sources like avocado, nuts, or salmon) and saturated fat to less than 10% of your total calories; for 2775 calories, that would be thirty grams or less of saturated fat per day.'}
  [PSCustomObject]@{Paragraph='Recommend dietary fiber intake: 35-40 grams per day.'}
  [PSCustomObject]@{Paragraph='Avoid processed foods and limit foods with refined flour and sugar.'}
  [PSCustomObject]@{Paragraph='The total recommended intake for sugar: less than 40 grams per day.'}
  [PSCustomObject]@{Paragraph='Continue with your current water intake.'}
  [PSCustomObject]@{Paragraph='Enjoy a combined fruit and vegetable intake of 5-7 servings per day, with emphasis on vegetables.'}
  [PSCustomObject]@{Paragraph='The recommendation for sodium is 2300mg per day; at your calorie level, it may be closer to 2800.'}
  [PSCustomObject]@{Paragraph='I may make other recommendations for supplements after I review your intake. Again, I am excited to work with you to help you achieve your wellness goals. Please let me know if you have any questions. -- Laura Zervos, MBA, RDN, LDN'}
)
$wsConsult = Get-Sheet $wb "Ref - Consult Letter"
Write-Sheet $wsConsult $consultLetter @('Paragraph')
$wsConsult.Columns.Item(1).ColumnWidth = 120
$wsConsult.Columns.Item(1).WrapText = $true

$wsReadme.Activate()
$wb.Worksheets.Item(1).Range("A1").Select() | Out-Null

$wb.SaveAs($outPath, 51)  # 51 = xlOpenXMLWorkbook (.xlsx)
$wb.Close($false)
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
[GC]::Collect()
[GC]::WaitForPendingFinalizers()

Write-Host "Saved $outPath"
