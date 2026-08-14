# Meal Planner

A static (GitHub Pages-ready) shopping/recipe app: browse a recipe library, assign recipes to days of the week, adjust servings, see estimated daily macros against your personal targets, get an auto-generated shopping list, and get waste-reduction ideas for the week.

No build step — plain HTML/CSS/JS. **Now reading live data from your published Google Sheet** (see [js/data-adapter.js](js/data-adapter.js)) rather than the local placeholder file — edit a cell in Sheets and reload the app to see it. [js/mock-data.js](js/mock-data.js) is kept as an offline fallback/demo dataset; flip `CONFIG.source` back to `"mock"` any time you want to work offline or test without touching the real sheet.

## Running it locally

Any static file server works. If you have Node or Python, use those. On this machine neither was installed, so a zero-dependency PowerShell server is included:

```powershell
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open http://localhost:8791/. (This script is a local convenience only — delete it any time; it has no effect on GitHub Pages.)

## How the data flows

```
js/mock-data.js    → offline fallback/demo data (same shape as the sheet)
js/data-adapter.js → CONFIG.source = "mock" | "sheet"; both resolve to
                      { recipes, ingredients, instructions, wasteReduction, nutritionTargets }
js/app.js          → all UI logic, reads only from that resolved shape
```

The app is currently pointed at the workbook published at:
https://docs.google.com/spreadsheets/d/e/2PACX-1vRbXsz0b4TgegSBNAKcrRyD8ae-narOnshrI-jCFaqrINrG59NBh9xuMhmscY5jWg/pubhtml

That's a **"Publish to web"** link (File → Share → Publish to web), not a regular share link — it issues its own `2PACX-...` id and works without anyone needing to be signed in. [js/data-adapter.js](js/data-adapter.js) fetches each tab as CSV via:
```
https://docs.google.com/spreadsheets/d/e/<PUBLISHED_ID>/pub?gid=<TAB_GID>&single=true&output=csv
```

**Editing data:** just edit the sheet directly — no republish needed, Google serves the published CSV live off the current cell values. The app re-fetches on every page load (no caching), so a browser refresh is all it takes to see a change.

**If you ever republish under a new link** (e.g. a fresh copy of the workbook), or add a brand-new tab: open the new pubhtml link, and either watch the Network tab for the CSV request `.../pub?gid=...` from the sheet's own tab switcher, or click through each tab and read the `gid` off the iframe it loads — then update `CONFIG.publishedId` and `CONFIG.gids` in [js/data-adapter.js](js/data-adapter.js) to match. Existing gids stay stable as long as you don't delete and recreate a tab.

## Where the data came from

- `sheets/detailed_recipe_collection_jake_murray.xlsx`, `sheets/healthy_granola_recipes.xlsx`, `sheets/monthly_meal_plan_jake_murray.xlsx` — your original three uploads.
- `nutrition-consult/` — recipe cards (.docx), a calorie/macro recommendation PDF, and a sample meal plan PDF from your 2/14/2025 dietician consult with Laura Zervos, MBA, RDN, LDN.

All of it is organized into **`sheets/meal_planner_master.xlsx`** — the file uploaded to Google Sheets and now published live (see "How the data flows" above). It has:

- **App-facing tabs** (read by the app): `Recipes`, `Ingredients`, `Instructions`, `WasteReduction`, `NutritionTargets`.
- **`Ref - ...` tabs**: your original monthly plan, shopping list, recipe rotation, granola overlap, and broth workflow tables, plus the consult letter — copied over verbatim for your own reference. The app doesn't read these.
- **`ReadMe` tab**: a short in-sheet legend covering the same ground as this section.

## Google Sheet structure

Normalized like a mini relational database so adding a new recipe never means restructuring anything — just append rows.

### Tab 1: `Recipes` (one row per recipe)

| Column | Type | Notes |
|---|---|---|
| `recipe_id` | text | Unique key, e.g. `R011`. Everything else references this. |
| `name` | text | |
| `category` | text | Breakfast / Lunch / Dinner / Side / Snack |
| `tags` | text | Comma-separated, e.g. `vegetarian,quick` — used for search/filter |
| `is_vegetarian` | boolean | `TRUE`/`FALSE`, blank if not yet determined (usually because the ingredient list is incomplete) |
| `is_vegan` | boolean | Same rules as above |
| `default_servings` | number | Servings the macro/ingredient numbers below are based on. Blank is fine — the app falls back to 1. |
| `prep_time_min` / `cook_time_min` | number | |
| `calories_per_serving` / `protein_g_per_serving` / `carbs_g_per_serving` / `fat_g_per_serving` | number | Blank is fine — the app shows "Macros not yet added" instead of a false zero. |
| `notes` | text | Freeform — often carries extra macro detail (fiber, sodium, etc.) that doesn't have its own column |
| `waste_tips` | text | Recipe-specific scrap-reduction tip, shown on the recipe detail page and in the Waste Tips tab |
| `source` | text | Where the recipe came from — informational only |

### Tab 2: `Ingredients` (many rows per recipe — one per ingredient)

| Column | Type | Notes |
|---|---|---|
| `recipe_id` | text | Foreign key into `Recipes` |
| `ingredient_name` | text | |
| `quantity_per_serving` | number | Amount for **one** serving; the app multiplies by chosen servings. Blank shows as "add quantity" instead of a false zero. |
| `unit` | text | `cup`, `tbsp`, `oz`, `each`, `clove`, etc. |
| `quantity_per_batch` / `unit_per_batch` | number / text | Informational only, not read by the app. A few recipes (the granolas) gave a total-batch quantity rather than a per-serving amount in the source material — these preserve that real number until you work out your own per-serving amount. |
| `shopping_category` | text | Produce / Meat / Dairy / Pantry / Frozen / Bakery / Other — used to group the shopping list. "Meat" is used as a general protein bucket (includes tofu). |

### Tab 3: `Instructions` (many rows per recipe — one per step)

| Column | Type | Notes |
|---|---|---|
| `recipe_id` | text | Foreign key into `Recipes` |
| `step_number` | number | Sort order |
| `instruction_text` | text | |

### Tab 4: `WasteReduction` (one row per scrap/reuse idea)

| Column | Type | Notes |
|---|---|---|
| `scrap_id` | text | Unique key |
| `scrap_source` | text | e.g. "Chicken bones", "Eggshells" |
| `match_keywords` | text | Comma-separated, case-insensitive. The app matches these as substrings against ingredient names in your current weekly plan to auto-surface relevant tips. Leave blank for a general tip that should always show rather than being ingredient-triggered. |
| `reuse_type` | text | `Broth/Stock`, `Repurposed Meal`, `Compost/Fertilizer`, or `Cleaning/Abrasive`. The app groups the first two under "prep another meal" and the rest under "other uses." |
| `reuse_description` | text | |
| `store_method` | text | e.g. "Freeze in a gallon bag" |
| `notes` / `source` | text | |

### Tab 5: `NutritionTargets` (one row per daily target metric)

| Column | Type | Notes |
|---|---|---|
| `metric` | text | `calories`, `protein`, `carbohydrates`, `fat`, `saturated_fat`, `fiber`, `sugar`, `sodium`, `fruit_veg_servings` |
| `target_amount` | text | The app does numeric % comparisons for calories/protein/carbohydrates/fat only; the rest (some are ranges like "35-40") are shown for reference. |
| `unit` | text | |
| `notes` | text | |

Populated from your 2/14/2025 consult: **2771 kcal, 152g protein, 346g carbs, 86g fat** per day, plus fiber (35–40g), sugar (<40g), sodium (~2300–2800mg), and 5–7 combined fruit/veg servings. The Weekly Planner tab shows these targets and each day's percent-of-goal.

### Adding a new recipe later

1. Add one row to `Recipes` with a new `recipe_id`.
2. Add one row per ingredient to `Ingredients` with that same `recipe_id`.
3. Add one row per step to `Instructions` with that same `recipe_id`.

No formulas, no schema changes, no touching the other tabs — the app picks it up automatically on next load.

### Still needs full detail

A few recipes named in your Recipe Rotation tab (and mentioned in the monthly plan) never had a full ingredient list or instructions in any source file, so they don't appear in `Recipes` yet: *Turkey meatballs + zucchini noodles*, *Slow cooker beef & vegetable stew*, *Teriyaki tofu rice bowl*, *Shrimp tacos + slaw*, *Tofu curry + rice*, *Whole wheat pasta with turkey bolognese*. The full text of your original monthly plan (which mentions these) is preserved in the `Ref - Week 1..4` tabs so nothing is lost — add them to `Recipes`/`Ingredients`/`Instructions` whenever you have the full recipe.

### Optional future additions (not needed to start)

- A `Units` tab for unit conversions if you want the shopping list to combine e.g. `tbsp` and `cup` of the same ingredient.
- An `image_url` column on `Recipes` if you want photos in the library.
- A pre-built weekly/monthly "menu" tab if you'd rather import a ready-made week than always build one by hand in the Planner tab.

## Deploying to GitHub Pages

Not done yet — this folder isn't a git repository. When you're ready: create a GitHub repo, push this folder, then enable Pages (Settings → Pages → deploy from the `main` branch root). Happy to walk through that whenever you want.
