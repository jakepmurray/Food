/*
 * Placeholder data — shaped exactly like the Google Sheet tabs described in
 * README.md (Recipes / Ingredients / Instructions / WasteReduction).
 * Once the real sheet is published, data-adapter.js fetches the same shape
 * from Google instead of this file, and nothing else in the app changes.
 *
 * R001-R010: fully-worked example recipes (quantities + macros filled in)
 *   used to demonstrate every feature end to end.
 * R101-R119, G201-G204: real recipes organized from Jake's dietician
 *   consult and granola sheets — see sheets/meal_planner_master.xlsx for
 *   the canonical, more heavily-annotated version of this same data.
 *   Many of these are missing quantities/macros because the source
 *   material didn't specify them; the app is written to handle that
 *   gracefully rather than showing false zeros.
 */

const MOCK_RECIPES = [
  { recipe_id: "R001", name: "Overnight Oats", category: "Breakfast", tags: "vegetarian,make-ahead,quick", is_vegetarian: true, is_vegan: false, default_servings: 2, prep_time_min: 10, cook_time_min: 0, calories_per_serving: 350, protein_g_per_serving: 14, carbs_g_per_serving: 52, fat_g_per_serving: 10, notes: "Best made the night before.", waste_tips: "" },
  { recipe_id: "R002", name: "Veggie Scramble", category: "Breakfast", tags: "vegetarian,quick", is_vegetarian: true, is_vegan: false, default_servings: 2, prep_time_min: 5, cook_time_min: 10, calories_per_serving: 300, protein_g_per_serving: 20, carbs_g_per_serving: 10, fat_g_per_serving: 20, notes: "", waste_tips: "" },
  { recipe_id: "R003", name: "Grilled Chicken Salad", category: "Lunch", tags: "high-protein,gluten-free", is_vegetarian: false, is_vegan: false, default_servings: 4, prep_time_min: 15, cook_time_min: 15, calories_per_serving: 420, protein_g_per_serving: 38, carbs_g_per_serving: 18, fat_g_per_serving: 22, notes: "", waste_tips: "" },
  { recipe_id: "R004", name: "Turkey Chili", category: "Dinner", tags: "make-ahead,freezer-friendly", is_vegetarian: false, is_vegan: false, default_servings: 6, prep_time_min: 15, cook_time_min: 40, calories_per_serving: 380, protein_g_per_serving: 30, carbs_g_per_serving: 35, fat_g_per_serving: 12, notes: "Freezes well for up to 3 months.", waste_tips: "" },
  { recipe_id: "R005", name: "Baked Salmon & Asparagus", category: "Dinner", tags: "gluten-free,high-protein,quick", is_vegetarian: false, is_vegan: false, default_servings: 4, prep_time_min: 10, cook_time_min: 20, calories_per_serving: 450, protein_g_per_serving: 36, carbs_g_per_serving: 8, fat_g_per_serving: 28, notes: "", waste_tips: "" },
  { recipe_id: "R006", name: "Veggie Stir Fry", category: "Dinner", tags: "vegetarian,vegan,quick", is_vegetarian: true, is_vegan: true, default_servings: 4, prep_time_min: 15, cook_time_min: 15, calories_per_serving: 320, protein_g_per_serving: 12, carbs_g_per_serving: 45, fat_g_per_serving: 10, notes: "", waste_tips: "" },
  { recipe_id: "R007", name: "Greek Yogurt & Berries", category: "Snack", tags: "vegetarian,quick,gluten-free", is_vegetarian: true, is_vegan: false, default_servings: 1, prep_time_min: 3, cook_time_min: 0, calories_per_serving: 180, protein_g_per_serving: 15, carbs_g_per_serving: 22, fat_g_per_serving: 3, notes: "", waste_tips: "" },
  { recipe_id: "R008", name: "Hummus & Veggies", category: "Snack", tags: "vegetarian,vegan,quick", is_vegetarian: true, is_vegan: true, default_servings: 2, prep_time_min: 5, cook_time_min: 0, calories_per_serving: 150, protein_g_per_serving: 5, carbs_g_per_serving: 16, fat_g_per_serving: 8, notes: "", waste_tips: "" },
  { recipe_id: "R009", name: "Beef & Broccoli", category: "Dinner", tags: "high-protein", is_vegetarian: false, is_vegan: false, default_servings: 4, prep_time_min: 15, cook_time_min: 15, calories_per_serving: 410, protein_g_per_serving: 32, carbs_g_per_serving: 25, fat_g_per_serving: 20, notes: "", waste_tips: "" },
  { recipe_id: "R010", name: "Quinoa Buddha Bowl", category: "Lunch", tags: "vegetarian,vegan,gluten-free,make-ahead", is_vegetarian: true, is_vegan: true, default_servings: 4, prep_time_min: 20, cook_time_min: 20, calories_per_serving: 390, protein_g_per_serving: 14, carbs_g_per_serving: 55, fat_g_per_serving: 14, notes: "", waste_tips: "" },

  // ---- Real recipes from the dietician consult (sheets/meal_planner_master.xlsx: Recipes) ----
  { recipe_id: "R101", name: "Chicken Quinoa Power Bowl", category: "Lunch", tags: "high-protein,high-fiber,meal-prep", is_vegetarian: false, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "High protein, high fiber, excellent meal prep option.", waste_tips: "Save broccoli stems and kale stems for broth. Use leftover quinoa in future bowls." },
  { recipe_id: "R102", name: "Salmon Brown Rice Bowl", category: "Lunch", tags: "omega-3,balanced", is_vegetarian: false, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Omega-3 rich, balanced carb and protein meal.", waste_tips: "Use salmon leftovers in salads. Freeze salmon bones for stock if desired." },
  { recipe_id: "R103", name: "Slow Cooker Salsa Verde Chicken", category: "Dinner", tags: "high-protein,freezer-friendly,slow-cooker", is_vegetarian: false, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Very high protein and freezer friendly.", waste_tips: "Save chicken bones and vegetable scraps for broth." },
  { recipe_id: "R104", name: "Chicken Fried Cauliflower Rice", category: "Dinner", tags: "high-protein,lower-calorie", is_vegetarian: false, is_vegan: false, default_servings: 4, prep_time_min: "", cook_time_min: "", calories_per_serving: 350, protein_g_per_serving: 43, carbs_g_per_serving: 17, fat_g_per_serving: 11, notes: "High protein, lower calorie dinner. Fiber 6.8g/serving per source.", waste_tips: "Use leftover rice if extra carbs are needed. Save scallion ends for broth." },
  { recipe_id: "R105", name: "Sheet Pan Pork Chops", category: "Dinner", tags: "high-protein,sheet-pan,easy", is_vegetarian: false, is_vegan: false, default_servings: 4, prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Easy high-protein sheet pan meal. No macro numbers were given on the recipe card.", waste_tips: "Save vegetable peels and pork bones for broth." },
  { recipe_id: "R106", name: "Slow Cooker Turkey Chili", category: "Dinner", tags: "high-protein,high-fiber,freezer-friendly,slow-cooker", is_vegetarian: false, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "High fiber, high protein, great leftovers.", waste_tips: "Use homemade broth and leftover vegetables." },
  { recipe_id: "R107", name: "Spinach Feta Chicken Burgers", category: "Dinner", tags: "lean-protein", is_vegetarian: false, is_vegan: false, default_servings: 6, prep_time_min: "", cook_time_min: "", calories_per_serving: 131, protein_g_per_serving: 17, carbs_g_per_serving: 6, fat_g_per_serving: 5, notes: "Lean protein option with good flavor. Sodium 330mg, fiber 1g per serving.", waste_tips: "Use leftover spinach in smoothies or eggs." },
  { recipe_id: "R108", name: "Shrimp Whole Wheat Pasta", category: "Dinner", tags: "recovery,high-carb", is_vegetarian: false, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Great recovery meal with protein and carbs.", waste_tips: "Save shrimp shells for seafood stock." },
  { recipe_id: "R109", name: "Mushroom Lentil Bolognese", category: "Dinner", tags: "high-fiber,vegetarian,vegan", is_vegetarian: true, is_vegan: true, default_servings: 4, prep_time_min: "", cook_time_min: "", calories_per_serving: 296, protein_g_per_serving: 17, carbs_g_per_serving: 49, fat_g_per_serving: 6.5, notes: "High fiber vegetarian meal. The red wine is optional — leave it out or use a vegan wine to keep this vegan. Assumes plain (eggless) pasta for the vegan flag — check your pasta brand. Fiber 15g/serving per source.", waste_tips: "Freeze extra sauce. Save celery/carrot scraps." },
  { recipe_id: "R110", name: "Turkey Taco Grain Bowl", category: "Lunch", tags: "high-protein,meal-prep", is_vegetarian: false, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "High protein bulk lunch.", waste_tips: "Use leftover taco meat in wraps or eggs." },
  { recipe_id: "R111", name: "Mediterranean Quinoa Bowl", category: "Lunch", tags: "high-fiber,meal-prep", is_vegetarian: false, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Fiber-rich and meal prep friendly.", waste_tips: "Use leftover vegetables in salads or wraps." },
  { recipe_id: "R112", name: "Tofu Stir Fry", category: "Dinner", tags: "plant-protein,vegan,vegetarian", is_vegetarian: true, is_vegan: true, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Excellent plant protein meal.", waste_tips: "Save vegetable scraps for broth." },
  { recipe_id: "R113", name: "Slow Cooker Chicken Tortilla Soup", category: "Dinner", tags: "high-protein,slow-cooker,comfort-food", is_vegetarian: false, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Comforting high-protein soup.", waste_tips: "Excellent use for homemade broth." },
  { recipe_id: "R114", name: "Slow Cooker Lentil Soup", category: "Dinner", tags: "high-fiber,slow-cooker,filling", is_vegetarian: false, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Very high fiber and filling. Swap the chicken sausage for a plant-based sausage to make this vegan.", waste_tips: "Perfect for using broth and vegetable scraps." },

  // ---- Full recipe cards from the dietician's nutrition-consult docx files ----
  { recipe_id: "R115", name: "Black Bean and Quinoa Stuffed Peppers", category: "Dinner", tags: "freezer-friendly,vegetarian", is_vegetarian: true, is_vegan: false, default_servings: 6, prep_time_min: "", cook_time_min: "", calories_per_serving: 221, protein_g_per_serving: 12, carbs_g_per_serving: 32, fat_g_per_serving: 6, notes: "Freezer friendly. Fiber 7.6g/serving per source.", waste_tips: "" },
  { recipe_id: "R116", name: "Kale and Brussels Sprouts Winter Salad", category: "Side", tags: "vegan,vegetarian", is_vegetarian: true, is_vegan: true, default_servings: 4, prep_time_min: "", cook_time_min: "", calories_per_serving: 187, protein_g_per_serving: 4.3, carbs_g_per_serving: 14.5, fat_g_per_serving: 14.2, notes: "Fiber rich side salad. Sat fat 1.7g, fiber 4.2g/serving per source.", waste_tips: "" },
  { recipe_id: "R117", name: "Lentil Salad", category: "Side", tags: "meal-prep,vegan,vegetarian", is_vegetarian: true, is_vegan: true, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: 220, protein_g_per_serving: 10, carbs_g_per_serving: "", fat_g_per_serving: 8.4, notes: "Meal prep side. Source gave a total-batch ingredient list without a serving count, so default_servings and per-serving ingredient quantities are left blank. Sat fat 1.2g, fiber 11g, sugar 3g, sodium 27mg per serving; total carbs weren't stated on the recipe card.", waste_tips: "" },
  { recipe_id: "R118", name: "Zucchini Noodle Salad", category: "Side", tags: "lower-calorie,vegetarian", is_vegetarian: true, is_vegan: false, default_servings: 4, prep_time_min: "", cook_time_min: "", calories_per_serving: 258, protein_g_per_serving: 7, carbs_g_per_serving: 22, fat_g_per_serving: 15, notes: "Low calorie vegetable side. Sat fat 3g, fiber 3.9g/serving per source.", waste_tips: "" },
  { recipe_id: "R119", name: "Whipped Feta Dip with Scallion Oil", category: "Snack", tags: "dairy,vegetarian", is_vegetarian: true, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Snack/party dip — serve with pita chips, toasted baguette, or roasted/raw vegetables. No serving count or macro numbers were given on the recipe card.", waste_tips: "" },
  { recipe_id: "R120", name: "Spinach and Mushroom Quinoa Bowl", category: "Lunch", tags: "vegetarian,side-or-main", is_vegetarian: true, is_vegan: false, default_servings: 4, prep_time_min: "", cook_time_min: "", calories_per_serving: 175, protein_g_per_serving: 12, carbs_g_per_serving: 17, fat_g_per_serving: 8, notes: "Eat alone as a side dish or add a protein (e.g. grilled chicken) for a complete meal. Fiber 6.5g/serving per source.", waste_tips: "" },
  { recipe_id: "R121", name: "Honey Mustard Chicken Salad", category: "Lunch", tags: "high-protein", is_vegetarian: false, is_vegan: false, default_servings: 4, prep_time_min: "", cook_time_min: "", calories_per_serving: 172, protein_g_per_serving: 24, carbs_g_per_serving: 3.5, fat_g_per_serving: 6, notes: "Sugar 2.3g, sodium 146mg per serving per source.", waste_tips: "" },
  { recipe_id: "R122", name: "Tortilla Egg Bake", category: "Breakfast", tags: "vegetarian,quick", is_vegetarian: true, is_vegan: false, default_servings: 1, prep_time_min: "", cook_time_min: 20, calories_per_serving: 233, protein_g_per_serving: 24, carbs_g_per_serving: 36, fat_g_per_serving: 6, notes: "Sat fat 4g, fiber 16g per serving per source — the fiber figure looks high relative to the carbs, worth double-checking with your dietician.", waste_tips: "" },
  { recipe_id: "R123", name: "Tossed Salad", category: "Side", tags: "vegan,vegetarian,quick", is_vegetarian: true, is_vegan: true, default_servings: 1, prep_time_min: 5, cook_time_min: 0, calories_per_serving: 61, protein_g_per_serving: 4, carbs_g_per_serving: 13, fat_g_per_serving: 1, notes: "Sodium 53mg, fiber 4g per serving per source. Appears as a side item throughout the sample meal plan.", waste_tips: "" },

  // ---- Granola recipes (sheets/healthy_granola_recipes.xlsx) ----
  { recipe_id: "G201", name: "Everyday High-Protein Granola", category: "Breakfast", tags: "smoothie-topping,recovery,meal-prep", is_vegetarian: true, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: 28, calories_per_serving: 300, protein_g_per_serving: 13.5, carbs_g_per_serving: 26, fat_g_per_serving: 17, notes: "Best use: daily smoothie bowls and recovery. Store in airtight glass jars; freeze nuts/seeds to extend freshness. Macros are the midpoint of the source range (280-320 kcal, 12-15g protein, 24-28g carbs, 16-18g fat) for an assumed ~1/2 cup serving — confirm against your actual scoop size.", waste_tips: "" },
  { recipe_id: "G202", name: "Crunchy Peanut Butter Granola", category: "Breakfast", tags: "high-activity,recovery", is_vegetarian: true, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Best use: high activity / biking / frisbee days. Higher calorie, higher healthy fats and carbs for recovery (no exact numbers given in source). Works well with banana and yogurt.", waste_tips: "" },
  { recipe_id: "G203", name: "Low-Sugar Cinnamon Almond Granola", category: "Breakfast", tags: "low-sugar,everyday", is_vegetarian: true, is_vegan: false, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Best use: lower calorie everyday option. Lower sugar and calories, moderate protein and fiber (no exact numbers given in source). Egg white helps create crunch while keeping calories moderate.", waste_tips: "" },
  { recipe_id: "G204", name: "Savory Granola", category: "Side", tags: "topping,savory,crouton-replacement", is_vegetarian: true, is_vegan: true, default_servings: "", prep_time_min: "", cook_time_min: "", calories_per_serving: "", protein_g_per_serving: "", carbs_g_per_serving: "", fat_g_per_serving: "", notes: "Best use: salads, grain bowls, soups. Fiber-rich crunchy topping with savory flavor. Use on grain bowls and soups instead of croutons.", waste_tips: "" },
];

const MOCK_INGREDIENTS = [
  // R001 Overnight Oats (per serving)
  { recipe_id: "R001", ingredient_name: "Rolled oats", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R001", ingredient_name: "Milk", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Dairy" },
  { recipe_id: "R001", ingredient_name: "Chia seeds", quantity_per_serving: 1, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R001", ingredient_name: "Honey", quantity_per_serving: 1, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R001", ingredient_name: "Blueberries", quantity_per_serving: 0.25, unit: "cup", shopping_category: "Produce" },

  // R002 Veggie Scramble
  { recipe_id: "R002", ingredient_name: "Eggs", quantity_per_serving: 2, unit: "each", shopping_category: "Dairy" },
  { recipe_id: "R002", ingredient_name: "Bell pepper", quantity_per_serving: 0.25, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R002", ingredient_name: "Spinach", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R002", ingredient_name: "Onion", quantity_per_serving: 0.125, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R002", ingredient_name: "Olive oil", quantity_per_serving: 1, unit: "tsp", shopping_category: "Pantry" },

  // R003 Grilled Chicken Salad
  { recipe_id: "R003", ingredient_name: "Chicken breast", quantity_per_serving: 5, unit: "oz", shopping_category: "Meat" },
  { recipe_id: "R003", ingredient_name: "Romaine lettuce", quantity_per_serving: 2, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R003", ingredient_name: "Cherry tomatoes", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R003", ingredient_name: "Cucumber", quantity_per_serving: 0.25, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R003", ingredient_name: "Feta cheese", quantity_per_serving: 2, unit: "tbsp", shopping_category: "Dairy" },
  { recipe_id: "R003", ingredient_name: "Olive oil", quantity_per_serving: 1, unit: "tbsp", shopping_category: "Pantry" },

  // R004 Turkey Chili
  { recipe_id: "R004", ingredient_name: "Ground turkey", quantity_per_serving: 4, unit: "oz", shopping_category: "Meat" },
  { recipe_id: "R004", ingredient_name: "Kidney beans", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R004", ingredient_name: "Diced tomatoes", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R004", ingredient_name: "Onion", quantity_per_serving: 0.166, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R004", ingredient_name: "Chili powder", quantity_per_serving: 0.5, unit: "tsp", shopping_category: "Pantry" },

  // R005 Baked Salmon & Asparagus
  { recipe_id: "R005", ingredient_name: "Salmon fillet", quantity_per_serving: 5, unit: "oz", shopping_category: "Meat" },
  { recipe_id: "R005", ingredient_name: "Asparagus", quantity_per_serving: 4, unit: "oz", shopping_category: "Produce" },
  { recipe_id: "R005", ingredient_name: "Lemon", quantity_per_serving: 0.25, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R005", ingredient_name: "Olive oil", quantity_per_serving: 1, unit: "tbsp", shopping_category: "Pantry" },

  // R006 Veggie Stir Fry
  { recipe_id: "R006", ingredient_name: "Broccoli", quantity_per_serving: 1, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R006", ingredient_name: "Carrot", quantity_per_serving: 0.5, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R006", ingredient_name: "Bell pepper", quantity_per_serving: 0.5, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R006", ingredient_name: "Soy sauce", quantity_per_serving: 1, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R006", ingredient_name: "Rice", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Pantry" },

  // R007 Greek Yogurt & Berries
  { recipe_id: "R007", ingredient_name: "Greek yogurt", quantity_per_serving: 1, unit: "cup", shopping_category: "Dairy" },
  { recipe_id: "R007", ingredient_name: "Mixed berries", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R007", ingredient_name: "Honey", quantity_per_serving: 1, unit: "tsp", shopping_category: "Pantry" },

  // R008 Hummus & Veggies
  { recipe_id: "R008", ingredient_name: "Hummus", quantity_per_serving: 0.25, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R008", ingredient_name: "Carrot", quantity_per_serving: 1, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R008", ingredient_name: "Celery", quantity_per_serving: 1, unit: "each", shopping_category: "Produce" },

  // R009 Beef & Broccoli
  { recipe_id: "R009", ingredient_name: "Beef sirloin", quantity_per_serving: 4, unit: "oz", shopping_category: "Meat" },
  { recipe_id: "R009", ingredient_name: "Broccoli", quantity_per_serving: 1, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R009", ingredient_name: "Soy sauce", quantity_per_serving: 1, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R009", ingredient_name: "Garlic", quantity_per_serving: 1, unit: "clove", shopping_category: "Produce" },
  { recipe_id: "R009", ingredient_name: "Rice", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Pantry" },

  // R010 Quinoa Buddha Bowl
  { recipe_id: "R010", ingredient_name: "Quinoa", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R010", ingredient_name: "Chickpeas", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R010", ingredient_name: "Sweet potato", quantity_per_serving: 0.5, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R010", ingredient_name: "Kale", quantity_per_serving: 1, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R010", ingredient_name: "Tahini", quantity_per_serving: 1, unit: "tbsp", shopping_category: "Pantry" },

  // ---- Real recipes: quantities weren't given in the source, so quantity_per_serving/unit are
  // left blank on purpose (see sheets/meal_planner_master.xlsx) — the app shows "add quantity" for these. ----
  { recipe_id: "R101", ingredient_name: "Quinoa", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R101", ingredient_name: "Chicken breast", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R101", ingredient_name: "Broccoli", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R101", ingredient_name: "Carrots", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R101", ingredient_name: "Kale", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R101", ingredient_name: "Chickpeas", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R101", ingredient_name: "Greek yogurt", quantity_per_serving: "", unit: "", shopping_category: "Dairy" },
  { recipe_id: "R101", ingredient_name: "Tahini", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R101", ingredient_name: "Lemon", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R101", ingredient_name: "Feta", quantity_per_serving: "", unit: "", shopping_category: "Dairy" },
  { recipe_id: "R101", ingredient_name: "Pumpkin seeds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "R102", ingredient_name: "Brown rice", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R102", ingredient_name: "Salmon", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R102", ingredient_name: "Cabbage", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R102", ingredient_name: "Cucumber", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R102", ingredient_name: "Edamame", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R102", ingredient_name: "Sweet potato", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R102", ingredient_name: "Yogurt sauce", quantity_per_serving: "", unit: "", shopping_category: "Dairy" },
  { recipe_id: "R102", ingredient_name: "Sesame seeds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "R103", ingredient_name: "Chicken breast", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R103", ingredient_name: "Salsa verde", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R103", ingredient_name: "Onions", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R103", ingredient_name: "Peppers", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R103", ingredient_name: "Cumin", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R103", ingredient_name: "Garlic", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R103", ingredient_name: "Black beans", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R103", ingredient_name: "Rice", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "R104", ingredient_name: "Chicken breast", quantity_per_serving: 4, unit: "oz", shopping_category: "Meat" },
  { recipe_id: "R104", ingredient_name: "Frozen riced cauliflower", quantity_per_serving: 3, unit: "oz", shopping_category: "Produce" },
  { recipe_id: "R104", ingredient_name: "Frozen peas and carrots", quantity_per_serving: 3, unit: "oz", shopping_category: "Produce" },
  { recipe_id: "R104", ingredient_name: "Eggs", quantity_per_serving: 0.5, unit: "each", shopping_category: "Dairy" },
  { recipe_id: "R104", ingredient_name: "Soy sauce (low sodium)", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R104", ingredient_name: "Scallions", quantity_per_serving: 0.125, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R104", ingredient_name: "Onion", quantity_per_serving: 0.25, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R104", ingredient_name: "Garlic", quantity_per_serving: 0.25, unit: "clove", shopping_category: "Produce" },
  { recipe_id: "R104", ingredient_name: "Fresh ginger", quantity_per_serving: 0.06, unit: "tsp", shopping_category: "Produce" },
  { recipe_id: "R104", ingredient_name: "Olive oil", quantity_per_serving: 0.75, unit: "tbsp", shopping_category: "Pantry" },

  { recipe_id: "R105", ingredient_name: "Bone-in pork chops (3/4-inch, 4-5oz each)", quantity_per_serving: 1, unit: "each", shopping_category: "Meat" },
  { recipe_id: "R105", ingredient_name: "Butternut squash (or carrots or turnips)", quantity_per_serving: 0.25, unit: "lb", shopping_category: "Produce" },
  { recipe_id: "R105", ingredient_name: "Olive or avocado oil", quantity_per_serving: 0.08, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R105", ingredient_name: "Dijon mustard", quantity_per_serving: 0.25, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R105", ingredient_name: "Maple syrup", quantity_per_serving: 0.25, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R105", ingredient_name: "Garlic", quantity_per_serving: 0.75, unit: "clove", shopping_category: "Produce" },
  { recipe_id: "R105", ingredient_name: "Fresh ginger", quantity_per_serving: 0.125, unit: "tsp", shopping_category: "Produce" },
  { recipe_id: "R105", ingredient_name: "Shallots", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Produce" },
  { recipe_id: "R105", ingredient_name: "Kosher salt", quantity_per_serving: 0.125, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R105", ingredient_name: "Black pepper", quantity_per_serving: 0.125, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R105", ingredient_name: "Fresh parsley", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Produce" },

  { recipe_id: "R106", ingredient_name: "Lean ground turkey", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R106", ingredient_name: "Beans", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R106", ingredient_name: "Tomatoes", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R106", ingredient_name: "Peppers", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R106", ingredient_name: "Onions", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R106", ingredient_name: "Garlic", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R106", ingredient_name: "Chili powder", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R106", ingredient_name: "Broth", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "R107", ingredient_name: "Fresh spinach", quantity_per_serving: 2.67, unit: "oz", shopping_category: "Produce" },
  { recipe_id: "R107", ingredient_name: "Ground chicken", quantity_per_serving: 2.67, unit: "oz", shopping_category: "Meat" },
  { recipe_id: "R107", ingredient_name: "Feta cheese, crumbled", quantity_per_serving: 0.67, unit: "oz", shopping_category: "Dairy" },
  { recipe_id: "R107", ingredient_name: "Breadcrumbs", quantity_per_serving: 0.083, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R107", ingredient_name: "Onion", quantity_per_serving: 0.167, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R107", ingredient_name: "Garlic", quantity_per_serving: 0.67, unit: "clove", shopping_category: "Produce" },
  { recipe_id: "R107", ingredient_name: "Oregano", quantity_per_serving: 0.167, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R107", ingredient_name: "Olive oil", quantity_per_serving: 0.167, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R107", ingredient_name: "Whole-grain buns (optional)", quantity_per_serving: 0.67, unit: "each", shopping_category: "Pantry" },

  { recipe_id: "R108", ingredient_name: "Whole wheat pasta", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R108", ingredient_name: "Shrimp", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R108", ingredient_name: "Spinach", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R108", ingredient_name: "Tomatoes", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R108", ingredient_name: "Garlic", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R108", ingredient_name: "Olive oil", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R108", ingredient_name: "Lemon", quantity_per_serving: "", unit: "", shopping_category: "Produce" },

  { recipe_id: "R109", ingredient_name: "Baby portobella mushrooms", quantity_per_serving: 2, unit: "oz", shopping_category: "Produce" },
  { recipe_id: "R109", ingredient_name: "Lentils", quantity_per_serving: 4, unit: "oz", shopping_category: "Pantry" },
  { recipe_id: "R109", ingredient_name: "Onion", quantity_per_serving: 0.125, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R109", ingredient_name: "Carrot", quantity_per_serving: 0.125, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R109", ingredient_name: "Celery", quantity_per_serving: 0.083, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R109", ingredient_name: "Garlic", quantity_per_serving: 0.5, unit: "clove", shopping_category: "Produce" },
  { recipe_id: "R109", ingredient_name: "Olive oil", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R109", ingredient_name: "Red wine (optional)", quantity_per_serving: 0.125, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R109", ingredient_name: "Crushed tomatoes", quantity_per_serving: 1, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R109", ingredient_name: "Fresh basil", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Produce" },
  { recipe_id: "R109", ingredient_name: "Fresh parsley", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Produce" },

  { recipe_id: "R110", ingredient_name: "Lean ground turkey", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R110", ingredient_name: "Rice", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R110", ingredient_name: "Black beans", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R110", ingredient_name: "Peppers", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R110", ingredient_name: "Corn", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R110", ingredient_name: "Salsa", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R110", ingredient_name: "Avocado", quantity_per_serving: "", unit: "", shopping_category: "Produce" },

  { recipe_id: "R111", ingredient_name: "Quinoa", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R111", ingredient_name: "Cucumbers", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R111", ingredient_name: "Tomatoes", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R111", ingredient_name: "Chickpeas", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R111", ingredient_name: "Olives", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R111", ingredient_name: "Feta", quantity_per_serving: "", unit: "", shopping_category: "Dairy" },
  { recipe_id: "R111", ingredient_name: "Chicken", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R111", ingredient_name: "Hummus", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "R112", ingredient_name: "Tofu", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R112", ingredient_name: "Broccoli", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R112", ingredient_name: "Carrots", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R112", ingredient_name: "Snap peas", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R112", ingredient_name: "Garlic", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R112", ingredient_name: "Ginger", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R112", ingredient_name: "Soy sauce", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R112", ingredient_name: "Rice", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "R113", ingredient_name: "Chicken breast", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R113", ingredient_name: "Broth", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R113", ingredient_name: "Tomatoes", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R113", ingredient_name: "Beans", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R113", ingredient_name: "Onions", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R113", ingredient_name: "Peppers", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R113", ingredient_name: "Tortillas", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R113", ingredient_name: "Spices", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "R114", ingredient_name: "Lentils", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R114", ingredient_name: "Carrots", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R114", ingredient_name: "Celery", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R114", ingredient_name: "Onion", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R114", ingredient_name: "Broth", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R114", ingredient_name: "Chicken sausage", quantity_per_serving: "", unit: "", shopping_category: "Meat" },
  { recipe_id: "R114", ingredient_name: "Herbs", quantity_per_serving: "", unit: "", shopping_category: "Produce" },

  // ---- Full recipe cards from the dietician's nutrition-consult docx files ----
  { recipe_id: "R115", ingredient_name: "Red bell peppers", quantity_per_serving: 0.5, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R115", ingredient_name: "Olive oil", quantity_per_serving: 0.33, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R115", ingredient_name: "Onion", quantity_per_serving: 0.083, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R115", ingredient_name: "Black beans (canned)", quantity_per_serving: 2.5, unit: "oz", shopping_category: "Pantry" },
  { recipe_id: "R115", ingredient_name: "Quinoa", quantity_per_serving: 0.167, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R115", ingredient_name: "Scallions", quantity_per_serving: 0.083, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R115", ingredient_name: "Garlic", quantity_per_serving: 0.33, unit: "clove", shopping_category: "Produce" },
  { recipe_id: "R115", ingredient_name: "Canned green chiles", quantity_per_serving: 0.33, unit: "oz", shopping_category: "Pantry" },
  { recipe_id: "R115", ingredient_name: "Cumin", quantity_per_serving: 0.167, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R115", ingredient_name: "Shredded cheese", quantity_per_serving: 0.083, unit: "cup", shopping_category: "Dairy" },

  { recipe_id: "R116", ingredient_name: "Shallots", quantity_per_serving: 0.25, unit: "tbsp", shopping_category: "Produce" },
  { recipe_id: "R116", ingredient_name: "Olive oil", quantity_per_serving: 0.125, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R116", ingredient_name: "Lemon", quantity_per_serving: 0.125, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R116", ingredient_name: "Dijon mustard", quantity_per_serving: 0.5, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R116", ingredient_name: "Garlic", quantity_per_serving: 0.25, unit: "clove", shopping_category: "Produce" },
  { recipe_id: "R116", ingredient_name: "Brussels sprouts", quantity_per_serving: 2, unit: "oz", shopping_category: "Produce" },
  { recipe_id: "R116", ingredient_name: "Kale", quantity_per_serving: 0.75, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R116", ingredient_name: "Mandarin orange", quantity_per_serving: 0.25, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R116", ingredient_name: "Slivered almonds", quantity_per_serving: 0.125, unit: "cup", shopping_category: "Pantry" },

  // R117 Lentil Salad -- no serving count given in source, so per-serving quantities are blank
  { recipe_id: "R117", ingredient_name: "Green or brown lentils (1 lb total)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R117", ingredient_name: "Garlic (1 clove total)", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R117", ingredient_name: "Bay leaf (1 total)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R117", ingredient_name: "Crushed red pepper (1/2 tsp total)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R117", ingredient_name: "Carrots (1 cup total)", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R117", ingredient_name: "Bell peppers (1/2 cup total)", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R117", ingredient_name: "Red onion (1/2 cup total)", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R117", ingredient_name: "Lemon juice (1/2 cup total)", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R117", ingredient_name: "Olive oil (1/2 cup total)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R117", ingredient_name: "Fresh parsley (1 tbsp total)", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R117", ingredient_name: "Oregano (1/2 tsp total)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R117", ingredient_name: "Garlic powder (1/2 tsp total)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "R118", ingredient_name: "Zucchini", quantity_per_serving: 0.5, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R118", ingredient_name: "Red onion", quantity_per_serving: 0.125, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R118", ingredient_name: "Artichokes", quantity_per_serving: 0.25, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R118", ingredient_name: "Grape tomatoes", quantity_per_serving: 0.167, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R118", ingredient_name: "Chickpeas", quantity_per_serving: 0.167, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R118", ingredient_name: "Kalamata olives", quantity_per_serving: 0.0625, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R118", ingredient_name: "Feta", quantity_per_serving: 0.083, unit: "cup", shopping_category: "Dairy" },
  { recipe_id: "R118", ingredient_name: "Olive oil", quantity_per_serving: 0.125, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R118", ingredient_name: "Red wine vinegar", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R118", ingredient_name: "Lemon juice", quantity_per_serving: 0.25, unit: "tbsp", shopping_category: "Produce" },
  { recipe_id: "R118", ingredient_name: "Oregano", quantity_per_serving: 0.25, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R118", ingredient_name: "Dijon mustard", quantity_per_serving: 0.25, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R118", ingredient_name: "Garlic", quantity_per_serving: 0.25, unit: "clove", shopping_category: "Produce" },
  { recipe_id: "R118", ingredient_name: "Shallots", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Produce" },
  { recipe_id: "R118", ingredient_name: "Fresh parsley", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Produce" },

  // R119 Whipped Feta Dip -- no serving count given in source, so per-serving quantities are blank
  { recipe_id: "R119", ingredient_name: "Extra virgin olive oil (3 tbsp total)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R119", ingredient_name: "Scallions (3 total)", quantity_per_serving: "", unit: "", shopping_category: "Produce" },
  { recipe_id: "R119", ingredient_name: "Chili flakes (1 tsp total)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R119", ingredient_name: "Honey (1-2 tbsp total)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "R119", ingredient_name: "Feta cheese (7 oz total)", quantity_per_serving: "", unit: "", shopping_category: "Dairy" },
  { recipe_id: "R119", ingredient_name: "Ricotta (5 oz total)", quantity_per_serving: "", unit: "", shopping_category: "Dairy" },
  { recipe_id: "R119", ingredient_name: "Plain Greek yogurt (4 oz total)", quantity_per_serving: "", unit: "", shopping_category: "Dairy" },

  { recipe_id: "R120", ingredient_name: "Quinoa", quantity_per_serving: 0.25, unit: "cup", shopping_category: "Pantry" },
  { recipe_id: "R120", ingredient_name: "Olive oil", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R120", ingredient_name: "Spinach", quantity_per_serving: 0.5, unit: "lb", shopping_category: "Produce" },
  { recipe_id: "R120", ingredient_name: "Garlic", quantity_per_serving: 0.25, unit: "clove", shopping_category: "Produce" },
  { recipe_id: "R120", ingredient_name: "Exotic mushroom blend", quantity_per_serving: 2, unit: "oz", shopping_category: "Produce" },
  { recipe_id: "R120", ingredient_name: "Thyme", quantity_per_serving: 0.5, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R120", ingredient_name: "Parmesan", quantity_per_serving: 0.083, unit: "cup", shopping_category: "Dairy" },

  { recipe_id: "R121", ingredient_name: "Plain low-fat yogurt", quantity_per_serving: 0.125, unit: "cup", shopping_category: "Dairy" },
  { recipe_id: "R121", ingredient_name: "Dijon mustard", quantity_per_serving: 0.25, unit: "tbsp", shopping_category: "Pantry" },
  { recipe_id: "R121", ingredient_name: "Fresh parsley", quantity_per_serving: 0.5, unit: "tbsp", shopping_category: "Produce" },
  { recipe_id: "R121", ingredient_name: "Honey", quantity_per_serving: 0.25, unit: "tsp", shopping_category: "Pantry" },
  { recipe_id: "R121", ingredient_name: "Lemon zest", quantity_per_serving: 0.125, unit: "tsp", shopping_category: "Produce" },
  { recipe_id: "R121", ingredient_name: "Fresh lemon juice", quantity_per_serving: 0.25, unit: "tsp", shopping_category: "Produce" },
  { recipe_id: "R121", ingredient_name: "Chicken breast, cooked and shredded", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Meat" },
  { recipe_id: "R121", ingredient_name: "Toasted almonds", quantity_per_serving: 0.125, unit: "cup", shopping_category: "Pantry" },

  { recipe_id: "R122", ingredient_name: "Carb-balanced tortilla", quantity_per_serving: 1, unit: "each", shopping_category: "Pantry" },
  { recipe_id: "R122", ingredient_name: "Egg whites", quantity_per_serving: 4, unit: "oz", shopping_category: "Dairy" },
  { recipe_id: "R122", ingredient_name: "Sauteed mushrooms", quantity_per_serving: 0.33, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R122", ingredient_name: "Sauteed onions", quantity_per_serving: 0.33, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R122", ingredient_name: "Feta, crumbled", quantity_per_serving: 2, unit: "tbsp", shopping_category: "Dairy" },
  { recipe_id: "R122", ingredient_name: "Grape tomatoes", quantity_per_serving: 5, unit: "each", shopping_category: "Produce" },
  { recipe_id: "R122", ingredient_name: "Olive oil", quantity_per_serving: 1, unit: "tbsp", shopping_category: "Pantry" },

  { recipe_id: "R123", ingredient_name: "Green leaf lettuce, shredded", quantity_per_serving: 3, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R123", ingredient_name: "Onion (large slice, 1/4-inch thick)", quantity_per_serving: 1, unit: "slice", shopping_category: "Produce" },
  { recipe_id: "R123", ingredient_name: "Red tomatoes, chopped", quantity_per_serving: 0.25, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R123", ingredient_name: "Cucumber, peeled and chopped", quantity_per_serving: 0.5, unit: "cup", shopping_category: "Produce" },
  { recipe_id: "R123", ingredient_name: "Green bell pepper, sliced", quantity_per_serving: 0.25, unit: "cup", shopping_category: "Produce" },

  // ---- Granola: source gave total-batch quantities, not per-serving (see quantity_per_batch note in the workbook) ----
  { recipe_id: "G201", ingredient_name: "Rolled oats", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Walnuts", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Almonds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Pumpkin seeds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Chia seeds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Flax meal", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Cinnamon", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Salt", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Maple syrup", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Olive oil", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Vanilla", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Coconut flakes (optional)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G201", ingredient_name: "Whey isolate", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "G202", ingredient_name: "Rolled oats", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G202", ingredient_name: "Natural peanut butter", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G202", ingredient_name: "Maple syrup", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G202", ingredient_name: "Honey", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G202", ingredient_name: "Chopped peanuts", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G202", ingredient_name: "Hemp seeds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G202", ingredient_name: "Cinnamon", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G202", ingredient_name: "Salt", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G202", ingredient_name: "Dark chocolate (optional)", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "G203", ingredient_name: "Rolled oats", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G203", ingredient_name: "Almonds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G203", ingredient_name: "Sunflower seeds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G203", ingredient_name: "Flax meal", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G203", ingredient_name: "Egg white", quantity_per_serving: "", unit: "", shopping_category: "Dairy" },
  { recipe_id: "G203", ingredient_name: "Applesauce", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G203", ingredient_name: "Maple syrup", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G203", ingredient_name: "Cinnamon", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G203", ingredient_name: "Vanilla", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G203", ingredient_name: "Salt", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },

  { recipe_id: "G204", ingredient_name: "Oats", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G204", ingredient_name: "Pumpkin seeds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G204", ingredient_name: "Sesame seeds", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G204", ingredient_name: "Olive oil", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G204", ingredient_name: "Smoked paprika", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G204", ingredient_name: "Garlic powder", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G204", ingredient_name: "Black pepper", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
  { recipe_id: "G204", ingredient_name: "Nutritional yeast", quantity_per_serving: "", unit: "", shopping_category: "Pantry" },
];

const MOCK_INSTRUCTIONS = [
  { recipe_id: "R001", step_number: 1, instruction_text: "Combine oats, milk, and chia seeds in a jar." },
  { recipe_id: "R001", step_number: 2, instruction_text: "Stir in honey, cover, and refrigerate overnight." },
  { recipe_id: "R001", step_number: 3, instruction_text: "Top with blueberries before serving." },

  { recipe_id: "R002", step_number: 1, instruction_text: "Dice bell pepper and onion; heat olive oil in a pan over medium heat." },
  { recipe_id: "R002", step_number: 2, instruction_text: "Sauté vegetables for 3-4 minutes until softened." },
  { recipe_id: "R002", step_number: 3, instruction_text: "Add spinach and cook until wilted, about 1 minute." },
  { recipe_id: "R002", step_number: 4, instruction_text: "Whisk eggs, pour into pan, and scramble until fully cooked." },

  { recipe_id: "R003", step_number: 1, instruction_text: "Season chicken breast and grill 6-7 minutes per side until cooked through." },
  { recipe_id: "R003", step_number: 2, instruction_text: "Let chicken rest 5 minutes, then slice." },
  { recipe_id: "R003", step_number: 3, instruction_text: "Toss lettuce, tomatoes, cucumber, and feta with olive oil." },
  { recipe_id: "R003", step_number: 4, instruction_text: "Top salad with sliced chicken and serve." },

  { recipe_id: "R004", step_number: 1, instruction_text: "Brown ground turkey with diced onion in a large pot." },
  { recipe_id: "R004", step_number: 2, instruction_text: "Stir in beans, diced tomatoes, and chili powder." },
  { recipe_id: "R004", step_number: 3, instruction_text: "Simmer uncovered for 30 minutes, stirring occasionally." },

  { recipe_id: "R005", step_number: 1, instruction_text: "Preheat oven to 400°F (200°C)." },
  { recipe_id: "R005", step_number: 2, instruction_text: "Place salmon and asparagus on a sheet pan; drizzle with olive oil and lemon." },
  { recipe_id: "R005", step_number: 3, instruction_text: "Bake for 15-18 minutes until salmon flakes easily." },

  { recipe_id: "R006", step_number: 1, instruction_text: "Cook rice according to package instructions." },
  { recipe_id: "R006", step_number: 2, instruction_text: "Heat a wok or large pan over high heat; add chopped vegetables." },
  { recipe_id: "R006", step_number: 3, instruction_text: "Stir fry 5-6 minutes, add soy sauce, and toss to combine." },
  { recipe_id: "R006", step_number: 4, instruction_text: "Serve over rice." },

  { recipe_id: "R007", step_number: 1, instruction_text: "Spoon yogurt into a bowl." },
  { recipe_id: "R007", step_number: 2, instruction_text: "Top with berries and a drizzle of honey." },

  { recipe_id: "R008", step_number: 1, instruction_text: "Slice carrot and celery into sticks." },
  { recipe_id: "R008", step_number: 2, instruction_text: "Serve alongside hummus for dipping." },

  { recipe_id: "R009", step_number: 1, instruction_text: "Slice beef thinly against the grain." },
  { recipe_id: "R009", step_number: 2, instruction_text: "Cook rice according to package instructions." },
  { recipe_id: "R009", step_number: 3, instruction_text: "Sear beef in a hot pan for 2 minutes, then set aside." },
  { recipe_id: "R009", step_number: 4, instruction_text: "Stir fry broccoli and garlic, return beef to pan, add soy sauce, and combine." },
  { recipe_id: "R009", step_number: 5, instruction_text: "Serve over rice." },

  { recipe_id: "R010", step_number: 1, instruction_text: "Cook quinoa according to package instructions." },
  { recipe_id: "R010", step_number: 2, instruction_text: "Roast diced sweet potato at 400°F (200°C) for 20 minutes." },
  { recipe_id: "R010", step_number: 3, instruction_text: "Massage kale with a little olive oil to soften." },
  { recipe_id: "R010", step_number: 4, instruction_text: "Assemble bowls with quinoa, sweet potato, kale, and chickpeas; drizzle with tahini." },

  { recipe_id: "R101", step_number: 1, instruction_text: "Cook quinoa according to package instructions." },
  { recipe_id: "R101", step_number: 2, instruction_text: "Roast broccoli and carrots at 425°F until browned." },
  { recipe_id: "R101", step_number: 3, instruction_text: "Season and roast or grill chicken breast." },
  { recipe_id: "R101", step_number: 4, instruction_text: "Massage kale lightly with lemon juice." },
  { recipe_id: "R101", step_number: 5, instruction_text: "Mix greek yogurt, tahini, lemon, garlic, salt, and pepper for sauce." },
  { recipe_id: "R101", step_number: 6, instruction_text: "Assemble bowls and top with feta and pumpkin seeds." },

  { recipe_id: "R102", step_number: 1, instruction_text: "Cook brown rice." },
  { recipe_id: "R102", step_number: 2, instruction_text: "Roast sweet potatoes." },
  { recipe_id: "R102", step_number: 3, instruction_text: "Bake salmon at 400°F until flaky." },
  { recipe_id: "R102", step_number: 4, instruction_text: "Assemble bowls with vegetables and rice." },
  { recipe_id: "R102", step_number: 5, instruction_text: "Top with yogurt sauce and sesame seeds." },

  { recipe_id: "R103", step_number: 1, instruction_text: "Add chicken, salsa verde, onions, peppers, garlic, and cumin to slow cooker." },
  { recipe_id: "R103", step_number: 2, instruction_text: "Cook 6-8 hours on low." },
  { recipe_id: "R103", step_number: 3, instruction_text: "Shred chicken and stir." },
  { recipe_id: "R103", step_number: 4, instruction_text: "Serve over rice with black beans and cabbage slaw." },

  { recipe_id: "R104", step_number: 1, instruction_text: "Heat a large skillet over medium heat, add 1.5 tbsp olive oil, add chicken, and stir continuously while cooking until cooked through (no longer pink). Remove from heat." },
  { recipe_id: "R104", step_number: 2, instruction_text: "Add the remaining oil and sauté onion until soft but not browned." },
  { recipe_id: "R104", step_number: 3, instruction_text: "Add riced cauliflower and peas and carrots. Cover and cook until vegetables are heated through." },
  { recipe_id: "R104", step_number: 4, instruction_text: "Push vegetables to the edges of the skillet to make a well in the middle. Add eggs and cook while stirring frequently; once they begin to cook, incorporate them throughout the mixture." },
  { recipe_id: "R104", step_number: 5, instruction_text: "Add the chicken back to the mixture, stir in soy sauce, and cook 5 more minutes." },
  { recipe_id: "R104", step_number: 6, instruction_text: "Arrange on a serving plate and sprinkle with chopped scallions." },

  { recipe_id: "R105", step_number: 1, instruction_text: "Preheat the oven to 450°F." },
  { recipe_id: "R105", step_number: 2, instruction_text: "Whisk together 2 tbsp oil, maple syrup, salt, and pepper in a small bowl." },
  { recipe_id: "R105", step_number: 3, instruction_text: "Dip pork chops in the bowl, then place on one side of a large baking sheet." },
  { recipe_id: "R105", step_number: 4, instruction_text: "Toss the butternut squash with 1 tbsp olive oil in a medium bowl, then place on the other side of the sheet pan." },
  { recipe_id: "R105", step_number: 5, instruction_text: "Sprinkle the minced garlic, ginger, and remaining salt and pepper over everything." },
  { recipe_id: "R105", step_number: 6, instruction_text: "Roast 10 minutes, then broil until the pork chops are lightly browned." },

  { recipe_id: "R106", step_number: 1, instruction_text: "Brown turkey." },
  { recipe_id: "R106", step_number: 2, instruction_text: "Add all ingredients to slow cooker." },
  { recipe_id: "R106", step_number: 3, instruction_text: "Cook 6-8 hours." },
  { recipe_id: "R106", step_number: 4, instruction_text: "Serve with rice, avocado, and greek yogurt." },

  { recipe_id: "R107", step_number: 1, instruction_text: "Chop washed spinach and sauté in 1 tsp olive oil until wilted; allow to cool." },
  { recipe_id: "R107", step_number: 2, instruction_text: "Preheat grill to medium-high." },
  { recipe_id: "R107", step_number: 3, instruction_text: "Place ground chicken in a large bowl. Gently crumble the feta and add along with breadcrumbs, chopped onion, spinach, minced garlic, salt, pepper, and oregano." },
  { recipe_id: "R107", step_number: 4, instruction_text: "Divide into 6 equal portions and form into patties." },
  { recipe_id: "R107", step_number: 5, instruction_text: "Grill 4-5 minutes per side, or until internal temperature reaches 160°F." },

  { recipe_id: "R108", step_number: 1, instruction_text: "Cook pasta." },
  { recipe_id: "R108", step_number: 2, instruction_text: "Sauté garlic and shrimp." },
  { recipe_id: "R108", step_number: 3, instruction_text: "Add tomatoes and spinach." },
  { recipe_id: "R108", step_number: 4, instruction_text: "Toss with pasta and lemon juice." },

  { recipe_id: "R109", step_number: 1, instruction_text: "In a large stockpot, bring 6-8 cups of water to a boil." },
  { recipe_id: "R109", step_number: 2, instruction_text: "Add lentils and cook for 18 minutes, drain, toss with a small amount of olive oil, and set aside." },
  { recipe_id: "R109", step_number: 3, instruction_text: "In a large sauté pan, add 2 tbsp olive oil and swirl to coat." },
  { recipe_id: "R109", step_number: 4, instruction_text: "Add onions, celery, and carrots and sauté until soft; add mushrooms and red wine, and cook 3 more minutes." },
  { recipe_id: "R109", step_number: 5, instruction_text: "Add the cooked lentils, basil, and parsley; stir together." },
  { recipe_id: "R109", step_number: 6, instruction_text: "Add the crushed tomatoes and simmer for 30 minutes." },
  { recipe_id: "R109", step_number: 7, instruction_text: "Serve over your favorite pasta." },

  { recipe_id: "R110", step_number: 1, instruction_text: "Brown turkey with taco seasoning." },
  { recipe_id: "R110", step_number: 2, instruction_text: "Cook rice." },
  { recipe_id: "R110", step_number: 3, instruction_text: "Roast peppers and corn." },
  { recipe_id: "R110", step_number: 4, instruction_text: "Assemble bowls with toppings." },

  { recipe_id: "R111", step_number: 1, instruction_text: "Cook quinoa." },
  { recipe_id: "R111", step_number: 2, instruction_text: "Chop vegetables." },
  { recipe_id: "R111", step_number: 3, instruction_text: "Roast or grill chicken." },
  { recipe_id: "R111", step_number: 4, instruction_text: "Assemble bowls with hummus and feta." },

  { recipe_id: "R112", step_number: 1, instruction_text: "Press and cube tofu." },
  { recipe_id: "R112", step_number: 2, instruction_text: "Brown tofu." },
  { recipe_id: "R112", step_number: 3, instruction_text: "Stir fry vegetables." },
  { recipe_id: "R112", step_number: 4, instruction_text: "Add sauce and serve over rice." },

  { recipe_id: "R113", step_number: 1, instruction_text: "Add ingredients to slow cooker." },
  { recipe_id: "R113", step_number: 2, instruction_text: "Cook until chicken is tender." },
  { recipe_id: "R113", step_number: 3, instruction_text: "Shred chicken." },
  { recipe_id: "R113", step_number: 4, instruction_text: "Serve with tortilla strips." },

  { recipe_id: "R114", step_number: 1, instruction_text: "Add ingredients to slow cooker." },
  { recipe_id: "R114", step_number: 2, instruction_text: "Cook until lentils soften." },
  { recipe_id: "R114", step_number: 3, instruction_text: "Slice and add chicken sausage near end." },

  { recipe_id: "R115", step_number: 1, instruction_text: "Preheat oven to 400°F." },
  { recipe_id: "R115", step_number: 2, instruction_text: "Cook 1 cup quinoa in 2 cups water until tender." },
  { recipe_id: "R115", step_number: 3, instruction_text: "Wipe peppers with olive oil, place on a baking sheet, and roast for 10 minutes." },
  { recipe_id: "R115", step_number: 4, instruction_text: "In a large sauté pan, sauté onions and scallions for 3-5 minutes; add garlic and sauté 1 more minute." },
  { recipe_id: "R115", step_number: 5, instruction_text: "In a large bowl, mix the quinoa, black beans, chiles, sautéed vegetables, and cumin." },
  { recipe_id: "R115", step_number: 6, instruction_text: "Add 1 tbsp olive oil to a baking dish and arrange the peppers; divide the quinoa mixture evenly among them." },
  { recipe_id: "R115", step_number: 7, instruction_text: "Top with shredded cheese and bake at 350°F for 25-30 minutes, until heated through and bubbly." },
  { recipe_id: "R115", step_number: 8, instruction_text: "Remove from oven and garnish with the remaining scallions." },

  { recipe_id: "R116", step_number: 1, instruction_text: "Whisk together the olive oil, lemon juice, garlic, and Dijon mustard in a small bowl until well combined; salt and pepper to taste." },
  { recipe_id: "R116", step_number: 2, instruction_text: "Wash and pat dry the Brussels sprouts, then slice thin." },
  { recipe_id: "R116", step_number: 3, instruction_text: "Wash and dry the kale, cut or tear into bite-size pieces, and add to a large bowl with the Brussels sprouts." },
  { recipe_id: "R116", step_number: 4, instruction_text: "Drizzle dressing over the mixture and top with mandarin orange and almonds." },

  { recipe_id: "R117", step_number: 1, instruction_text: "Add lentils to a medium bowl and rinse." },
  { recipe_id: "R117", step_number: 2, instruction_text: "Add to a medium stockpot with the water, bring to a boil, then simmer 20-25 minutes until tender but firm." },
  { recipe_id: "R117", step_number: 3, instruction_text: "Whisk together the olive oil, lemon juice, parsley, garlic powder, and oregano for the dressing." },
  { recipe_id: "R117", step_number: 4, instruction_text: "Drain the lentils well and remove the bay leaf." },
  { recipe_id: "R117", step_number: 5, instruction_text: "In a large bowl, toss the lentils together with the vegetables and dressing." },

  { recipe_id: "R118", step_number: 1, instruction_text: "In a small bowl, whisk together the dressing ingredients." },
  { recipe_id: "R118", step_number: 2, instruction_text: "Spiralize the zucchini and pat dry." },
  { recipe_id: "R118", step_number: 3, instruction_text: "Add the zucchini noodles, onion, artichokes, tomatoes, chickpeas, and olives to a bowl and toss together." },
  { recipe_id: "R118", step_number: 4, instruction_text: "Sprinkle feta on top, then parsley." },
  { recipe_id: "R118", step_number: 5, instruction_text: "Drizzle with dressing." },

  { recipe_id: "R119", step_number: 1, instruction_text: "Add the oil to a medium sauté pan." },
  { recipe_id: "R119", step_number: 2, instruction_text: "Add the scallions and red pepper flakes; sauté until softened, about 4-5 minutes." },
  { recipe_id: "R119", step_number: 3, instruction_text: "Remove from heat and pour into a small bowl; drizzle in the honey and stir again, then set aside." },
  { recipe_id: "R119", step_number: 4, instruction_text: "Using a food processor, combine the feta, ricotta, and Greek yogurt. Pulse until smooth and creamy, about 2 minutes; season with a small amount of salt." },
  { recipe_id: "R119", step_number: 5, instruction_text: "Spoon the feta dip into a serving bowl and drizzle the scallion oil over top just before serving." },
  { recipe_id: "R119", step_number: 6, instruction_text: "Serve with pita chips, toasted baguette, or roasted/raw vegetables." },

  { recipe_id: "R120", step_number: 1, instruction_text: "Bring water to a boil, add quinoa, cover, and reduce to a simmer. Cook until tender and the water is absorbed; remove from heat." },
  { recipe_id: "R120", step_number: 2, instruction_text: "Heat olive oil in a skillet; sauté spinach until wilted." },
  { recipe_id: "R120", step_number: 3, instruction_text: "Add garlic and cook 1 more minute; add mushrooms and cook until lightly browned." },
  { recipe_id: "R120", step_number: 4, instruction_text: "Add the spinach back to the pan and mix with the quinoa." },
  { recipe_id: "R120", step_number: 5, instruction_text: "Eat alone as a side dish or add a protein for a complete meal." },

  { recipe_id: "R121", step_number: 1, instruction_text: "Cook chicken, seasoned with salt and pepper, to an internal temperature of 160°F." },
  { recipe_id: "R121", step_number: 2, instruction_text: "Whisk together the yogurt, mustard, honey, chopped parsley, lemon zest, and lemon juice." },
  { recipe_id: "R121", step_number: 3, instruction_text: "Add the chicken and toss together." },

  { recipe_id: "R122", step_number: 1, instruction_text: "Add 1 tbsp olive oil to a small pie pan." },
  { recipe_id: "R122", step_number: 2, instruction_text: "Place the tortilla shell in the bottom of the pan, allowing it to go up the sides." },
  { recipe_id: "R122", step_number: 3, instruction_text: "Pour the egg whites onto the shell, add the sautéed vegetables and feta, and bake for 20 minutes or until set." },
  { recipe_id: "R122", step_number: 4, instruction_text: "Remove from the oven and sprinkle with grape tomatoes." },

  { recipe_id: "R123", step_number: 1, instruction_text: "Toss all ingredients together." },

  { recipe_id: "G201", step_number: 1, instruction_text: "Bake at 325°F for approximately 28 minutes, stirring halfway." },
  { recipe_id: "G201", step_number: 2, instruction_text: "Cool completely." },
  { recipe_id: "G201", step_number: 3, instruction_text: "Mix in whey protein." },

  { recipe_id: "G202", step_number: 1, instruction_text: "Mix all ingredients." },
  { recipe_id: "G202", step_number: 2, instruction_text: "Bake at 325°F until golden and crunchy." },

  { recipe_id: "G203", step_number: 1, instruction_text: "Whisk wet ingredients separately." },
  { recipe_id: "G203", step_number: 2, instruction_text: "Combine wet and dry ingredients." },
  { recipe_id: "G203", step_number: 3, instruction_text: "Bake until crisp." },

  { recipe_id: "G204", step_number: 1, instruction_text: "Bake until toasted and crispy, stirring occasionally." },
];

// WasteReduction: organized from the dietician's "Broth Workflow" and "Waste Reduction
// Strategy" tabs, plus per-recipe tips from the Detailed Recipes tab. match_keywords is a
// comma-separated list the app checks (case-insensitive, substring match) against ingredient
// names in the current week's plan to auto-surface relevant scrap ideas; leave it blank for a
// general tip that isn't tied to one ingredient.
const MOCK_WASTE_REDUCTION = [
  { scrap_id: "W01", scrap_source: "Chicken bones", match_keywords: "chicken", reuse_type: "Broth/Stock", reuse_description: "Simmer with water, onion, celery, and carrot scraps to make chicken stock.", store_method: "Freeze in a gallon bag until you have enough", notes: "Roast bones first for deeper flavor." },
  { scrap_id: "W02", scrap_source: "Shrimp shells", match_keywords: "shrimp", reuse_type: "Broth/Stock", reuse_description: "Simmer shells to make a seafood stock for rice or soup bases.", store_method: "Freeze separately from other scraps", notes: "Excellent for rice or soup bases." },
  { scrap_id: "W03", scrap_source: "Onion skins/ends", match_keywords: "onion", reuse_type: "Broth/Stock", reuse_description: "Add to a vegetable stock bag for broth.", store_method: "Freeze in a scrap bag", notes: "Adds color and sweetness." },
  { scrap_id: "W04", scrap_source: "Celery tops/leaves", match_keywords: "celery", reuse_type: "Broth/Stock", reuse_description: "Add to a vegetable stock bag for broth.", store_method: "Freeze", notes: "Adds aromatic flavor." },
  { scrap_id: "W05", scrap_source: "Carrot peels", match_keywords: "carrot", reuse_type: "Broth/Stock", reuse_description: "Add to a vegetable stock bag for broth.", store_method: "Freeze", notes: "Adds sweetness." },
  { scrap_id: "W06", scrap_source: "Herb stems (parsley/cilantro)", match_keywords: "herbs,parsley,cilantro", reuse_type: "Broth/Stock", reuse_description: "Add to stocks and soups for extra flavor.", store_method: "Freeze", notes: "Parsley/cilantro stems work especially well." },
  { scrap_id: "W07", scrap_source: "Parmesan rinds", match_keywords: "parmesan", reuse_type: "Broth/Stock", reuse_description: "Simmer in lentil or vegetable soups for extra umami, then discard.", store_method: "Freeze", notes: "Excellent in lentil soups." },
  { scrap_id: "W08", scrap_source: "Broccoli stems / kale stems", match_keywords: "broccoli,kale", reuse_type: "Broth/Stock", reuse_description: "Chop and add to a vegetable stock bag, or dice finely into stir-fries.", store_method: "Freeze or use within a few days", notes: "Called out specifically in the Chicken Quinoa Power Bowl tips." },
  { scrap_id: "W09", scrap_source: "Salmon skin/bones", match_keywords: "salmon", reuse_type: "Broth/Stock", reuse_description: "Freeze and simmer for a light fish stock, if desired.", store_method: "Freeze", notes: "Optional — only if you want to make fish stock." },
  { scrap_id: "W10", scrap_source: "Scallion ends", match_keywords: "scallion", reuse_type: "Repurposed Meal", reuse_description: "Add to a vegetable stock bag, or place cut ends in a glass of water on a sunny windowsill to regrow a second harvest.", store_method: "Freeze, or regrow in water", notes: "Called out in the Chicken Fried Cauliflower Rice tips." },
  { scrap_id: "W11", scrap_source: "Pork bones", match_keywords: "pork", reuse_type: "Broth/Stock", reuse_description: "Simmer with vegetable scraps for a rich pork stock.", store_method: "Freeze", notes: "Called out in the Sheet Pan Pork Chops tips." },
  { scrap_id: "W12", scrap_source: "Leftover rice or quinoa", match_keywords: "rice,quinoa", reuse_type: "Repurposed Meal", reuse_description: "Reuse in fried rice, soup, or the next grain bowl instead of cooking a fresh batch.", store_method: "Refrigerate up to 4 days", notes: "“Prep once, use twice.”" },
  { scrap_id: "W13", scrap_source: "Roasted vegetables (leftover)", match_keywords: "", reuse_type: "Repurposed Meal", reuse_description: "Blend with broth into a quick pureed soup.", store_method: "Refrigerate", notes: "" },
  { scrap_id: "W14", scrap_source: "Leftover shredded/cooked chicken", match_keywords: "", reuse_type: "Repurposed Meal", reuse_description: "Reuse in wraps or salads for a fast lunch protein.", store_method: "Refrigerate up to 3-4 days", notes: "" },
  { scrap_id: "W15", scrap_source: "Extra sauce/chili/bolognese portions", match_keywords: "", reuse_type: "Repurposed Meal", reuse_description: "Portion and freeze rather than letting extras go to waste.", store_method: "Freeze in single-meal portions", notes: "Called out for the Turkey Chili and Mushroom Lentil Bolognese." },
  { scrap_id: "W16", scrap_source: "Eggshells", match_keywords: "egg", reuse_type: "Compost/Fertilizer", reuse_description: "Rinse, air-dry, and crush for a calcium-rich garden fertilizer, or use a larger piece as a natural abrasive for scrubbing pans.", store_method: "Rinse and air-dry before crushing or storing", notes: "Not from your source sheets — added because you asked for an example like this." },
];

// Daily nutrition targets from Jake's 2/14/2025 consult with Laura Zervos, MBA, RDN, LDN.
// target_amount is text since a couple of rows are ranges ("35-40"), not single numbers —
// the app only does numeric math on calories/protein/carbohydrates/fat.
const MOCK_NUTRITION_TARGETS = [
  { metric: "calories", target_amount: "2771", unit: "kcal", notes: "Recommended Nutritional Breakdown handout, 2/14/2025. The consult letter rounds this to ~2775, and suggests raising it to 2900-3000 on days with more biking/Ultimate Frisbee activity." },
  { metric: "protein", target_amount: "152", unit: "g", notes: "22% of calories." },
  { metric: "carbohydrates", target_amount: "346", unit: "g", notes: "50% of calories." },
  { metric: "fat", target_amount: "86", unit: "g", notes: "28% of calories. Keep total fat to <=30% of calories; favor sources like avocado, nuts, and salmon." },
  { metric: "saturated_fat", target_amount: "30", unit: "g", notes: "Keep saturated fat under 10% of total calories." },
  { metric: "fiber", target_amount: "35-40", unit: "g", notes: "Consult letter recommendation." },
  { metric: "sugar", target_amount: "40", unit: "g", notes: "Less than 40g/day, consult letter recommendation." },
  { metric: "sodium", target_amount: "2300", unit: "mg", notes: "Consult letter: \"it may be closer to 2800\" at this calorie level." },
  { metric: "fruit_veg_servings", target_amount: "5-7", unit: "servings/day", notes: "Combined fruit and vegetable servings per day, with emphasis on vegetables." },
];
