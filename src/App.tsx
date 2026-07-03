import React, { useState, useEffect } from 'react';
import {
  Activity,
  Apple,
  Brain,
  ChevronRight,
  Coins,
  Compass,
  Database,
  Flame,
  Heart,
  Layers,
  Languages,
  ListFilter,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Scale,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Star,
  Store,
  Trash2,
  Trophy,
  User,
  Utensils,
  Wallet,
  X,
  ChefHat,
  Award,
  Info,
  Download,
  Settings,
  Sun,
  Moon,
  AlertTriangle
} from 'lucide-react';
import { OnboardingData, FoodProduct, ChatMessage, PantryItem, MealPlan, ShoppingItem } from './types';
import { FOOD_DATABASE, searchProducts } from './foodDb';

export const COUNTRIES: Record<string, {
  name: string;
  currency: string;
  currencySymbol: string;
  rate: number;
  stores: string[];
  storeMap: Record<string, string>;
}> = {
  "Romania": {
    name: "Romania",
    currency: "RON",
    currencySymbol: "lei",
    rate: 1.0,
    stores: ['Lidl', 'Kaufland', 'Carrefour', 'Metro', 'Auchan'],
    storeMap: {
      'Lidl': 'Lidl',
      'Kaufland': 'Kaufland',
      'Carrefour': 'Carrefour',
      'Metro': 'Metro',
      'Auchan': 'Auchan',
      'Mega Image': 'Mega Image'
    }
  },
  "Moldova": {
    name: "Moldova",
    currency: "MDL",
    currencySymbol: "MDL",
    rate: 3.84,
    stores: ['Linella', 'Metro', 'Nr1', 'Kaufland'],
    storeMap: {
      'Lidl': 'Linella',
      'Kaufland': 'Kaufland',
      'Carrefour': 'Nr1',
      'Metro': 'Metro',
      'Auchan': 'Linella',
      'Mega Image': 'Nr1'
    }
  },
  "United States": {
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    rate: 0.22,
    stores: ['Walmart', 'Target', 'Costco', 'Aldi', 'Whole Foods'],
    storeMap: {
      'Lidl': 'Aldi',
      'Kaufland': 'Walmart',
      'Carrefour': 'Target',
      'Metro': 'Costco',
      'Auchan': 'Whole Foods',
      'Mega Image': "Trader Joe's"
    }
  },
  "United Kingdom": {
    name: "United Kingdom",
    currency: "GBP",
    currencySymbol: "£",
    rate: 0.17,
    stores: ['Tesco', 'Sainsbury\'s', 'ASDA', 'Morrisons', 'Aldi'],
    storeMap: {
      'Lidl': 'Aldi',
      'Kaufland': 'Tesco',
      'Carrefour': 'Sainsbury\'s',
      'Metro': 'ASDA',
      'Auchan': 'Morrisons',
      'Mega Image': "Marks & Spencer"
    }
  },
  "Germany": {
    name: "Germany",
    currency: "EUR",
    currencySymbol: "€",
    rate: 0.20,
    stores: ['REWE', 'Edeka', 'Aldi Nord', 'Lidl', 'Kaufland'],
    storeMap: {
      'Lidl': 'Lidl',
      'Kaufland': 'Kaufland',
      'Carrefour': 'REWE',
      'Metro': 'Edeka',
      'Auchan': 'Aldi Nord',
      'Mega Image': 'Penny'
    }
  },
  "Spain": {
    name: "Spain",
    currency: "EUR",
    currencySymbol: "€",
    rate: 0.20,
    stores: ['Mercadona', 'Carrefour', 'Lidl', 'Dia', 'Alcampo'],
    storeMap: {
      'Lidl': 'Lidl',
      'Kaufland': 'Mercadona',
      'Carrefour': 'Carrefour',
      'Metro': 'Dia',
      'Auchan': 'Alcampo',
      'Mega Image': 'Consum'
    }
  }
};

export const MEAL_PRESETS_POOL: MealPlan[] = [
  {
    breakfast: {
      name: "Protein Power Oatmeal",
      recipe: "Cook oats with water, stir in Greek yogurt and peanut butter, top with banana slices.",
      preparationSteps: [
        "In a bowl, mix 80g oats with 200ml hot water or milk.",
        "Microwave for 2 minutes.",
        "Stir in 150g Greek yogurt and a tablespoon of peanut butter.",
        "Slice half a banana on top and serve."
      ],
      cookingTime: "5 mins",
      nutrition: { protein: 28, carbs: 62, fat: 12, calories: 470 },
      shoppingIngredients: ["Oats", "Greek Yogurt", "Peanut Butter", "Bananas"]
    },
    lunch: {
      name: "Seared Chicken with Basmati and Broccoli",
      recipe: "Pan-fry chicken breast, boil Basmati rice and steam frozen mixed vegetables.",
      preparationSteps: [
        "Season 200g chicken breast with salt, pepper, and garlic powder.",
        "Pan-sear in a non-stick pan with a spray of olive oil for 6 mins per side.",
        "Boil 80g Basmati rice in salted water.",
        "Steam 150g frozen mixed vegetables.",
        "Assemble and enjoy a high protein, clean fuel meal."
      ],
      cookingTime: "15 mins",
      nutrition: { protein: 52, carbs: 65, fat: 4, calories: 510 },
      shoppingIngredients: ["Chicken Breast", "Orez Basmati", "Amestec de legume congelate"]
    },
    dinner: {
      name: "Egg & Tofu Veggie Scramble",
      recipe: "Scramble whole eggs with cubed tofu and mixed frozen veggies in a skillet.",
      preparationSteps: [
        "Chop 100g Tofu into small cubes.",
        "Crack 3 whole eggs into a bowl, whisk with a pinch of salt.",
        "Sauté tofu and a handful of mixed veggies in a skillet for 3 mins.",
        "Pour the whisked eggs into the skillet and stir gently until fully cooked."
      ],
      cookingTime: "10 mins",
      nutrition: { protein: 32, carbs: 12, fat: 22, calories: 370 },
      shoppingIngredients: ["Eggs", "Tofu", "Frozen Mixed Veggies"]
    },
    snacks: {
      name: "Greek Yogurt & Berries bowl",
      recipe: "Top high protein low-fat Greek yogurt with antioxidant-rich frozen forest berries.",
      preparationSteps: [
        "Scoop 200g of Greek Yogurt 2% into a bowl.",
        "Microwave 80g of frozen berries for 30s to thaw.",
        "Mix together with a pinch of stevia or honey if preferred."
      ],
      cookingTime: "2 mins",
      nutrition: { protein: 18, carbs: 14, fat: 4, calories: 164 },
      shoppingIngredients: ["Greek Yogurt 2%", "Frozen Forest Berries"]
    }
  },
  {
    breakfast: {
      name: "Super-Nutrient Scrambled Toast",
      recipe: "Whisk eggs, scramble in pan, and serve on whole wheat toast with sliced tomato.",
      preparationSteps: [
        "Toast 2 slices of whole wheat bread.",
        "Whisk 3 eggs with a dash of salt and black pepper.",
        "Sauté eggs in a hot non-stick pan with a tiny bit of butter for 2-3 mins.",
        "Top toast with scrambled eggs and 4 tomato slices."
      ],
      cookingTime: "8 mins",
      nutrition: { protein: 26, carbs: 32, fat: 15, calories: 380 },
      shoppingIngredients: ["Eggs", "Whole Wheat Bread", "Tomatoes"]
    },
    lunch: {
      name: "High-Protein Salmon & Quinoa Superbowl",
      recipe: "Bake fresh salmon fillet and serve with boiled quinoa and steamed spinach.",
      preparationSteps: [
        "Bake 150g salmon fillet at 200°C for 12 minutes with lemon slices.",
        "Boil 60g quinoa in salted water for 15 minutes.",
        "Sauté 100g spinach with minced garlic.",
        "Combine in a bowl and serve."
      ],
      cookingTime: "18 mins",
      nutrition: { protein: 42, carbs: 48, fat: 18, calories: 540 },
      shoppingIngredients: ["Salmon Fillet", "Quinoa", "Spinach"]
    },
    dinner: {
      name: "Savory Teriyaki Tofu & Jasmine Rice",
      recipe: "Pan-fry firm tofu cubes, drizzle with low-sodium teriyaki, serve over hot Jasmine rice.",
      preparationSteps: [
        "Press tofu and cut into 1-inch cubes.",
        "Sear tofu in hot skillet until golden brown on all sides.",
        "Drizzle 2 tablespoons of teriyaki sauce over the tofu.",
        "Serve next to 100g of cooked Jasmine rice and sprinkle sesame seeds."
      ],
      cookingTime: "12 mins",
      nutrition: { protein: 22, carbs: 55, fat: 9, calories: 410 },
      shoppingIngredients: ["Tofu Clasic", "Jasmine Rice", "Teriyaki Sauce"]
    },
    snacks: {
      name: "Almond & Whey Shaker Bowl",
      recipe: "Mix whey protein with chilled water or almond milk, top with raw almonds.",
      preparationSteps: [
        "Mix 1 scoop (30g) of whey protein isolate with 250ml water.",
        "Shake vigorously or blend with 3 ice cubes.",
        "Pour into a glass and serve with a side of 15 raw almonds."
      ],
      cookingTime: "3 mins",
      nutrition: { protein: 30, carbs: 6, fat: 9, calories: 230 },
      shoppingIngredients: ["Whey Protein", "Almonds"]
    }
  },
  {
    breakfast: {
      name: "Cottage Cheese & Honey Orchard Toast",
      recipe: "Spread high-protein cottage cheese on high fiber sourdough toast, top with diced apple and light honey.",
      preparationSteps: [
        "Toast 2 thick slices of high-fiber sourdough or wheat bread.",
        "Spread 150g of cottage cheese evenly.",
        "Core and finely dice half an apple.",
        "Scatter apple on top and drizzle with 1 tsp of honey."
      ],
      cookingTime: "6 mins",
      nutrition: { protein: 24, carbs: 38, fat: 5, calories: 310 },
      shoppingIngredients: ["Sourdough Bread", "Cottage Cheese", "Apple", "Honey"]
    },
    lunch: {
      name: "Lean Turkey & Black Bean Power Rice",
      recipe: "Brown lean ground turkey, add seasoned black beans, serve on warm brown rice.",
      preparationSteps: [
        "Sauté 200g of lean ground turkey until fully browned.",
        "Stir in 100g of rinsed canned black beans and cumin.",
        "Steam 80g of healthy brown rice.",
        "Mix turkey, beans, and rice together with fresh cilantro."
      ],
      cookingTime: "15 mins",
      nutrition: { protein: 48, carbs: 58, fat: 7, calories: 505 },
      shoppingIngredients: ["Ground Turkey", "Black Beans", "Brown Rice"]
    },
    dinner: {
      name: "Mediterranean Tuna Salad Plate",
      recipe: "Toss canned tuna with chopped cucumbers, black olives, and olive oil vinaigrette.",
      preparationSteps: [
        "Drain 1 can of tuna in olive oil or water.",
        "Chop half a cucumber, 5 cherry tomatoes, and 5 olives.",
        "Toss together in a bowl with lemon juice and 1 tsp of olive oil.",
        "Serve cold with 2 crackers."
      ],
      cookingTime: "5 mins",
      nutrition: { protein: 30, carbs: 12, fat: 11, calories: 280 },
      shoppingIngredients: ["Canned Tuna", "Cucumber", "Olives", "Cherry Tomatoes"]
    },
    snacks: {
      name: "Hard Boiled Eggs & Baby Carrots",
      recipe: "Prepare hard-boiled eggs ahead of time, serve with crisp sweet baby carrots.",
      preparationSteps: [
        "Boil 2 large eggs for 9 minutes.",
        "Peel and slice in half, season with sea salt.",
        "Serve with 100g of raw sweet baby carrots."
      ],
      cookingTime: "10 mins",
      nutrition: { protein: 14, carbs: 9, fat: 10, calories: 180 },
      shoppingIngredients: ["Eggs", "Baby Carrots"]
    }
  }
];

export const TRANSLATIONS = {
  ro: {
    welcomeTitle: "Alege Limba Aplicatiei",
    welcomeSubtitle: "Selectează limba pentru a începe planificarea alimentară optimizată cu AI.",
    startOnboarding: "Începe Înregistrarea",
    skipOnboarding: "Sari peste si Încarcă Date Demo",
    step: "Pasul",
    stepOf: "din 3",
    personalizeTitle: "Personalizează-ti Profilul Nutritiv",
    physicalProfileTitle: "Spune-ne despre profilul tău fizic",
    physicalProfileDesc: "Folosim aceste numere pentru a-ti calcula caloriile zilnice ideale si macronutrientii necesari.",
    age: "Vârstă (ani)",
    gender: "Gen",
    genderMale: "Masculin",
    genderFemale: "Feminin",
    genderOther: "Altul",
    height: "Înăltime (cm)",
    weight: "Greutate (kg)",
    activityLevel: "Nivel de Activitate",
    sedentary: "Sedentar (Fără exercitii)",
    lightlyActive: "Usor Activ (Sport 1-3 zile/săpt)",
    moderatelyActive: "Moderat Activ (Sport 3-5 zile/săpt)",
    veryActive: "Foarte Activ (Sport 6-7 zile/săpt)",
    goalsTitle: "Care sunt obiectivele tale de nutritie?",
    goalsDesc: "Alege scopul tău principal si stilul de dietă preferat.",
    targetGoal: "Obiectiv Tintă",
    goalLose: "Slăbire / Deficit",
    goalGain: "Masă Musculară / Surplus",
    goalMaintain: "Mentinere Greutate",
    goalGeneral: "Sănătate Generală / Longevitate",
    dietPreset: "Dietă Preferată",
    locationBudgetTitle: "Locatie, Buget si Magazine",
    locationBudgetDesc: "NutriCart AI localizează automat preturile, monedele si produsele din supermarketurile locale.",
    country: "Tara Ta",
    currency: "Monedă",
    budgetLimit: "Limita de Buget",
    planningPeriod: "Perioada Planificării",
    planningDaily: "Zilnic",
    planningWeekly: "Săptămânal",
    planningMonthly: "Lunar",
    preferredStores: "Magazine Preferate",
    allergies: "Alergii Alimentare (separate prin virgulă)",
    dislikedFoods: "Alimente de Evitat (separate prin virgulă)",
    back: "Înapoi",
    next: "Pasul Următor",
    submit: "Gata de Optimizat!",
    pantryTitle: "Cămară Inteligentă",
    pantryDesc: "Urmăreste produsele din casa ta pentru a evita cumpărăturile inutile.",
    addPantryBtn: "+ Adaugă Aliment",
    stockQty: "Stoc disponibil",
    expires: "Expiră la",
    daysLeft: "zile rămase",
    usedRemove: "Consumat / Sterge",
    pantryModalTitle: "Adaugă în Cămară",
    pantryItemNameLabel: "Numele Produsului",
    pantryItemQtyLabel: "Cantitate (ex: 1kg, 10 bucăti)",
    pantryItemDaysLabel: "Zile rămase până expiră",
    pantrySelectDbLabel: "Alege din produsele frecvente (optional):",
    pantryCustomLabel: "Sau scrie un nume personalizat:",
    cancel: "Anulează",
    save: "Adaugă în Cămară",
    mealPlannerTab: "Planificator Mese",
    plannerTab: "Planificator Mese",
    pantryTab: "Cămară",
    chatTab: "Asistent Chat",
    dashboardTab: "Panou Principal",
    cartTab: "Coș Cumpărături",
    chooseLanguage: "Limba"
  },
  en: {
    welcomeTitle: "Choose Application Language",
    welcomeSubtitle: "Select your preferred language to begin AI-optimized grocery and meal planning.",
    startOnboarding: "Start Onboarding",
    skipOnboarding: "Skip & Load Demo Data",
    step: "Step",
    stepOf: "of 3",
    personalizeTitle: "Personalize Your AI Shopping Assistant",
    physicalProfileTitle: "Tell us about your physical profile",
    physicalProfileDesc: "We use these numbers to compute your ideal target calories and daily macronutrient requirements.",
    age: "Age (years)",
    gender: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    genderOther: "Other",
    height: "Height (cm)",
    weight: "Weight (kg)",
    activityLevel: "Activity Level",
    sedentary: "Sedentary (Little/no exercise)",
    lightlyActive: "Lightly Active (Sport 1-3 days/wk)",
    moderatelyActive: "Moderately Active (Sport 3-5 days/wk)",
    veryActive: "Very Active (Sport 6-7 days/wk)",
    goalsTitle: "What are your nutrition goals?",
    goalsDesc: "Choose your main physical driver and preferred diet structure.",
    targetGoal: "Target Goal",
    goalLose: "Lose Weight / Shred",
    goalGain: "Gain Muscle / Bulk",
    goalMaintain: "Maintain Weight",
    goalGeneral: "General Longevity",
    dietPreset: "Diet Type Preset",
    locationBudgetTitle: "Location, Budget & Preferred Stores",
    locationBudgetDesc: "NutriCart AI dynamically localizes prices, currency, and stores based on your selection.",
    country: "Your Country",
    currency: "Preferred Currency",
    budgetLimit: "Budget Limit",
    planningPeriod: "Planning Period",
    planningDaily: "Daily",
    planningWeekly: "Weekly",
    planningMonthly: "Monthly",
    preferredStores: "Preferred Supermarkets",
    allergies: "Food Allergies (comma separated)",
    dislikedFoods: "Disliked Foods (comma separated)",
    back: "Back",
    next: "Next Step",
    submit: "Ready to Optimize!",
    pantryTitle: "Smart Pantry Storage",
    pantryDesc: "Track items you already own at home to avoid buying duplicate food.",
    addPantryBtn: "+ Add Owned Item",
    stockQty: "Stock Quantity",
    expires: "Expires on",
    daysLeft: "days left",
    usedRemove: "Used / Remove",
    pantryModalTitle: "Add Item to Pantry",
    pantryItemNameLabel: "Product Name",
    pantryItemQtyLabel: "Quantity (e.g. 1kg, 10 pieces)",
    pantryItemDaysLabel: "Days remaining until expiration",
    pantrySelectDbLabel: "Choose from common products (optional):",
    pantryCustomLabel: "Or write a custom name:",
    cancel: "Cancel",
    save: "Add to Pantry",
    mealPlannerTab: "Meal Planner",
    plannerTab: "Meal Planner",
    pantryTab: "Pantry",
    chatTab: "Chat Assistant",
    dashboardTab: "Dashboard",
    cartTab: "Cart",
    chooseLanguage: "Language"
  }
};

const getWeightInGrams = (weightStr: string): number => {
  if (!weightStr) return 100;
  const normalized = weightStr.toLowerCase().trim();
  const match = normalized.match(/([\d.]+)\s*(g|kg|l|ml)/);
  if (match) {
    const val = parseFloat(match[1]);
    const unit = match[2];
    if (unit === 'kg' || unit === 'l') {
      return val * 1000;
    }
    return val;
  }
  const val = parseFloat(normalized);
  return isNaN(val) ? 100 : val;
};

const getStandardDailyPortion = (productName: string, dietType: string = 'Normal'): { amount: number, unit: 'g' | 'pcs' } => {
  const name = productName.toLowerCase();
  
  if (name.includes('ouă') || name.includes('egg')) {
    if (dietType === 'Keto' || dietType === 'High Protein') return { amount: 3, unit: 'pcs' };
    return { amount: 2, unit: 'pcs' };
  }
  
  if (name.includes('pui') || name.includes('chicken') || name.includes('curcan') || name.includes('turkey') || name.includes('somon') || name.includes('salmon') || name.includes('ton') || name.includes('tuna')) {
    if (dietType === 'High Protein') return { amount: 250, unit: 'g' };
    if (dietType === 'Keto') return { amount: 200, unit: 'g' };
    return { amount: 150, unit: 'g' };
  }
  
  if (name.includes('ovăz') || name.includes('oats')) {
    if (dietType === 'Keto') return { amount: 0, unit: 'g' };
    if (dietType === 'High Protein' || dietType === 'Gain Muscle') return { amount: 100, unit: 'g' };
    return { amount: 60, unit: 'g' };
  }

  if (name.includes('orez') || name.includes('rice')) {
    if (dietType === 'Keto') return { amount: 0, unit: 'g' };
    return { amount: 80, unit: 'g' };
  }

  if (name.includes('pâine') || name.includes('bread')) {
    if (dietType === 'Keto') return { amount: 0, unit: 'g' };
    return { amount: 100, unit: 'g' };
  }

  if (name.includes('paste') || name.includes('pasta')) {
    if (dietType === 'Keto') return { amount: 0, unit: 'g' };
    return { amount: 80, unit: 'g' };
  }

  if (name.includes('fasole') || name.includes('beans')) {
    return { amount: 120, unit: 'g' };
  }

  if (name.includes('tofu')) {
    return { amount: 150, unit: 'g' };
  }

  if (name.includes('iaurt') || name.includes('yogurt')) {
    return { amount: 200, unit: 'g' };
  }

  if (name.includes('brânză proaspătă') || name.includes('cottage cheese') || name.includes('brânză')) {
    return { amount: 150, unit: 'g' };
  }

  if (name.includes('legume') || name.includes('veggies') || name.includes('broccoli')) {
    return { amount: 200, unit: 'g' };
  }

  if (name.includes('banan') || name.includes('fructe') || name.includes('berries')) {
    return { amount: 120, unit: 'g' };
  }

  if (name.includes('arahide') || name.includes('peanut') || name.includes('migdale') || name.includes('almonds')) {
    if (dietType === 'Keto') return { amount: 45, unit: 'g' };
    return { amount: 30, unit: 'g' };
  }

  if (name.includes('protein') || name.includes('whey')) {
    return { amount: 30, unit: 'g' };
  }

  if (name.includes('ulei') || name.includes('olive oil')) {
    if (dietType === 'Keto') return { amount: 30, unit: 'g' };
    return { amount: 15, unit: 'g' };
  }

  return { amount: 100, unit: 'g' };
};

const getProductPieceCount = (product: FoodProduct) => {
  const lowercaseName = product.name.toLowerCase();
  const isEggsOrPieces = lowercaseName.includes('ouă') || lowercaseName.includes('egg') || lowercaseName.includes('pcs') || lowercaseName.includes('bucă') || lowercaseName.includes('capsules') || lowercaseName.includes('tablets');
  
  if (!isEggsOrPieces) return 1;

  const pcsMatch = product.name.match(/(\d+)\s*(pcs|eggs|bucă|buchete|pack|bucăţi|capsules)/i);
  if (pcsMatch) {
    return parseInt(pcsMatch[1]) || 1;
  }
  return lowercaseName.includes('ouă') || lowercaseName.includes('eggs') ? 30 : 10;
};

const formatConvertedAmount = (item: ShoppingItem, dietType: string = 'Normal') => {
  const portion = getStandardDailyPortion(item.product.name, dietType);
  const consume = item.consumeType || 'daily';
  
  if (portion.unit === 'pcs') {
    if (consume === 'daily') {
      const daily = portion.amount;
      const weekly = daily * 7;
      return `${daily} pcs/day (${weekly} pcs/week)`;
    } else {
      const weekly = portion.amount * 7;
      const daily = portion.amount;
      return `${weekly} pcs/week (${daily} pcs/day)`;
    }
  } else {
    if (consume === 'daily') {
      const daily = portion.amount;
      const weekly = daily * 7;
      const dailyStr = daily >= 1000 ? `${(daily / 1000).toFixed(2)}kg` : `${daily}g`;
      const weeklyStr = weekly >= 1000 ? `${(weekly / 1000).toFixed(2)}kg` : `${weekly}g`;
      return `${dailyStr}/day (${weeklyStr}/week)`;
    } else {
      const weekly = portion.amount * 7;
      const daily = portion.amount;
      const dailyStr = daily >= 1000 ? `${(daily / 1000).toFixed(2)}kg` : `${daily}g`;
      const weeklyStr = weekly >= 1000 ? `${(weekly / 1000).toFixed(2)}kg` : `${weekly}g`;
      return `${weeklyStr}/week (${dailyStr}/day)`;
    }
  }
};

export const getRecommendedDiet = (age: number, weightKg: number, heightCm: number): { diet: string; reason: string } => {
  if (!age || !weightKg || !heightCm) {
    return {
      diet: 'Normal',
      reason: 'Please complete your physical profile in Step 1 to receive a standard clinical normative diet recommendation.'
    };
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (age < 18) {
    return {
      diet: 'Normal',
      reason: `At your age (${age}), clinical normatives strongly recommend a balanced 'Normal' diet. This ensures optimal growth, bone density development, and hormonal balance without unneeded macro restrictions.`
    };
  }

  if (age >= 50) {
    return {
      diet: 'Mediterranean',
      reason: `For older adults of age ${age}, public health normatives highly prioritize cardiovascular longevity, joint health, and anti-inflammatory support. The 'Mediterranean' diet, rich in healthy fats (omega-3, olive oil) and antioxidants, is your optimal match.`
    };
  }

  if (bmi >= 25) {
    return {
      diet: 'High Protein',
      reason: `Based on your weight of ${weightKg}kg and a BMI of ${bmi.toFixed(1)} (which is within the overweight/active range), standard clinical guidelines recommend a 'High Protein' or 'Low Carb' diet. A high protein split helps retain calorie-burning lean muscle, suppresses hunger, and accelerates healthy body recomposition.`
    };
  }

  if (bmi < 18.5) {
    return {
      diet: 'High Protein',
      reason: `With a BMI of ${bmi.toFixed(1)} (${weightKg}kg), clinical guidelines recommend a 'High Protein' nutrition layout combined with adequate carbs. This provides the essential amino acids and energetic building blocks required to support safe lean muscle mass gain and skeletal integrity.`
    };
  }

  // Normal BMI and age 18-49
  return {
    diet: 'Mediterranean',
    reason: `Based on your balanced physical profile (Age: ${age}, Weight: ${weightKg}kg, BMI: ${bmi.toFixed(1)}), standard wellness normatives recommend the 'Mediterranean' or 'Normal' diet. This structure sustains metabolic flexibility, steady glycemic control, and excellent cardiovascular health.`
  };
};

const isAllergicOrDisliked = (product: FoodProduct, allergies: string[], dislikes: string[]): boolean => {
  if (!product) return false;
  const nameLower = product.name.toLowerCase();
  const brandLower = product.brand.toLowerCase();
  const categoryLower = (product.category || '').toLowerCase();
  const ingLower = (product.ingredients || '').toLowerCase();

  const forbiddenKeywords = [...allergies, ...dislikes].map(s => s.toLowerCase().trim()).filter(Boolean);

  for (const kw of forbiddenKeywords) {
    if (kw === 'fish' || kw === 'pește' || kw === 'peste' || kw === 'somon' || kw === 'salmon' || kw === 'ton' || kw === 'tuna') {
      if (
        nameLower.includes('fish') ||
        nameLower.includes('somon') ||
        nameLower.includes('salmon') ||
        nameLower.includes('ton') ||
        nameLower.includes('tuna') ||
        nameLower.includes('sardine') ||
        nameLower.includes('pește') ||
        nameLower.includes('peste') ||
        nameLower.includes('macrou') ||
        categoryLower.includes('fish')
      ) {
        return true;
      }
    }

    if (kw === 'egg' || kw === 'eggs' || kw === 'ou' || kw === 'ouă' || kw === 'oua') {
      if (
        nameLower.includes('egg') ||
        nameLower.includes('ouă') ||
        nameLower.includes('ou ') ||
        nameLower.includes('oua')
      ) {
        return true;
      }
    }

    if (kw === 'peanut' || kw === 'peanuts' || kw === 'arahide' || kw === 'nuc' || kw === 'nuci') {
      if (
        nameLower.includes('peanut') ||
        nameLower.includes('arahide') ||
        nameLower.includes('nuc') ||
        ingLower.includes('arahide') ||
        ingLower.includes('peanut') ||
        ingLower.includes('nuc')
      ) {
        return true;
      }
    }

    if (kw === 'milk' || kw === 'lactate' || kw === 'lapte' || kw === 'dairy' || kw === 'iaurt' || kw === 'branza' || kw === 'brânză') {
      if (
        nameLower.includes('milk') ||
        nameLower.includes('lapte') ||
        nameLower.includes('iaurt') ||
        nameLower.includes('yogurt') ||
        nameLower.includes('brânză') ||
        nameLower.includes('branza') ||
        nameLower.includes('cottage cheese') ||
        nameLower.includes('pilos') ||
        categoryLower.includes('dairy')
      ) {
        return true;
      }
    }

    if (kw === 'gluten' || kw === 'paine' || kw === 'pâine' || kw === 'faina' || kw === 'făină') {
      if (
        nameLower.includes('wheat') ||
        nameLower.includes('bread') ||
        nameLower.includes('pâine') ||
        nameLower.includes('paine') ||
        nameLower.includes('făină') ||
        nameLower.includes('faina') ||
        nameLower.includes('paste') ||
        nameLower.includes('pasta') ||
        nameLower.includes('ovăz') ||
        nameLower.includes('oats')
      ) {
        return true;
      }
    }

    if (
      nameLower.includes(kw) ||
      brandLower.includes(kw) ||
      categoryLower.includes(kw) ||
      ingLower.includes(kw)
    ) {
      return true;
    }
  }

  return false;
};

export interface DietResearchProfile {
  title: string;
  targetProteinAnalysis: string;
  targetCarbAnalysis: string;
  targetFatAnalysis: string;
  primaryWarning: string;
  clinicalStudyCitation: string;
  clinicalExplanation: string;
}

export const DIET_RESEARCH_DATABASE: Record<string, DietResearchProfile> = {
  'High Protein': {
    title: 'High Protein Dietary Science',
    targetProteinAnalysis: 'Set exceptionally high (38% of daily energy intake, up to 2.2g per kg of bodyweight). High protein targets are clinically validated to support muscle protein synthesis (MPS) during progressive overload, preserve lean mass in caloric deficits, and enhance meal-induced thermogenesis.',
    targetCarbAnalysis: 'Maintained at a moderate level (37%) to sustain high-intensity anaerobic training (glycogen stores) while preventing excessive lipid storage.',
    targetFatAnalysis: 'Kept at a moderate-low 25% to maximize the caloric allocation for muscle-building macronutrients.',
    primaryWarning: '⚠️ High Urea Clearance Warning: Elevated protein intake increases the clearance demand on your kidneys. Clinical research recommends consuming at least 2.5L to 3.0L of water daily to facilitate safe urea clearance and avoid dehydration.',
    clinicalStudyCitation: 'Phillips, S. M. et al. (2016). "A Systematic Review of Dietary Protein Intake on Muscle Mass." American Journal of Clinical Nutrition, 104(3).',
    clinicalExplanation: 'Standard guidelines recommend 0.8g/kg, but resistance-trained athletes require 1.6 - 2.2g/kg. Your target represents this specialized athletic ceiling, maximizing hypertrophic muscle adaptation.'
  },
  'Keto': {
    title: 'Ketogenic Lipid Science & Research',
    targetProteinAnalysis: 'Kept moderate (20%) because excess protein can undergo gluconeogenesis, transforming amino acids into glucose and potentially disrupting systemic ketosis.',
    targetCarbAnalysis: 'Restricted to a critical floor of 5% (typically <30g of net carbohydrates). This severe restriction is required to deplete hepatic glycogen stores, stimulating beta-oxidation and hepatic ketone body generation.',
    targetFatAnalysis: 'Set exceptionally high (75% of total calories). Fat becomes the primary metabolic substrate to synthesize Acetyl-CoA for ketone production.',
    primaryWarning: '⚠️ Keto-Flu & Saturated Fat Warning: Rapid depletion of glycogen leads to sodium and water excretion. Supplement with electrolytes (sodium, potassium, magnesium). Prioritize monounsaturated fats (extra virgin olive oil, avocados) over heavy saturated animal fats to protect LDL profiles.',
    clinicalStudyCitation: 'Volek, J. S., Phinney, S. D. et al. (2015). "Metabolic Characteristics of Keto-Adapted Ultra-Endurance Athletes." Metabolism Clinical and Experimental, 64(11).',
    clinicalExplanation: 'In ketosis, systemic insulin levels drop dramatically, prompting kidneys to excrete water and crucial minerals. This is the physiological origin of the "keto flu".'
  },
  'Low Carb': {
    title: 'Carbohydrate Restriction Metabolism',
    targetProteinAnalysis: 'Set at a robust 30% to support metabolic rate and satiety during active carb reduction.',
    targetCarbAnalysis: 'Capped at 20% to help stabilize postprandial insulin surges, shifting metabolic reliance towards lipid oxidation without entering deep ketosis.',
    targetFatAnalysis: 'Elevated to 50% to provide clean, durable energy from fats, compensating for the reduced glucose availability.',
    primaryWarning: '⚠️ Fiber & Micronutrient Care: Ensure that your remaining 20% of carbs are fully sourced from non-starchy leafy greens and cruciferous vegetables to maintain a minimum of 25g daily prebiotic fiber.',
    clinicalStudyCitation: 'Feinman, R. D. et al. (2015). "Dietary Carbohydrate Restriction as the First Approach in Diabetes Management." Nutrition Journal, 31(1).',
    clinicalExplanation: 'Carbohydrate restriction improves glucose control and significantly reduces serum triglycerides, making it highly effective for metabolic syndrome management.'
  },
  'Mediterranean': {
    title: 'Cardiovascular Dietetics & Research',
    targetProteinAnalysis: 'Set at 20%, focused primarily on marine, poultry, and plant-based (legumes) protein sources rather than red meats.',
    targetCarbAnalysis: 'Set at 45% utilizing slow-digesting complex carbohydrates (whole grains, oats) rich in soluble dietary fiber.',
    targetFatAnalysis: 'Set at 35% with a strict clinical focus on monounsaturated fatty acids (MUFAs), primarily sourced from cold-pressed extra virgin olive oil.',
    primaryWarning: '⚠️ Caloric Density: While extra virgin olive oil and walnuts are exceptionally cardio-protective, they are highly energy-dense. Stick strictly to mapped portion sizes.',
    clinicalStudyCitation: 'Estruch, R. et al. (2018). "Primary Prevention of Cardiovascular Disease with a Mediterranean Diet." New England Journal of Medicine (PREDIMED Trial), 378(25).',
    clinicalExplanation: 'The landmark PREDIMED trial demonstrated a 30% relative risk reduction in major cardiovascular events for participants assigned to a Mediterranean diet supplemented with extra-virgin olive oil or nuts.'
  },
  'Vegan': {
    title: 'Plant-Based Macronutrient Bioavailability',
    targetProteinAnalysis: 'Set at 15%. Because plant proteins (such as legumes and grains) often have lower biological value and digestibility, the target is focused on maximizing diversity.',
    targetCarbAnalysis: 'Optimized at 60% using complex starches, legumes, and root crops which are highly rich in essential micronutrients and prebiotic dietary fiber.',
    targetFatAnalysis: 'Kept at a moderate 25%, prioritizing seed oils, nuts, and avocados.',
    primaryWarning: '⚠️ B12, Iron & Lysine Warning: Non-heme iron from plants has a 50% lower absorption rate. Always consume iron-rich legumes alongside Vitamin C (e.g., squeeze fresh lemon juice) to double bioavailability. Daily Vitamin B12 supplementation is medically required.',
    clinicalStudyCitation: 'Melina, V., Craig, W., & Levin, S. (2016). "Position of the Academy of Nutrition and Dietetics: Vegetarian and Vegan Diets." Journal of the Academy of Nutrition and Dietetics, 116(12).',
    clinicalExplanation: 'Plant-based proteins are often limiting in specific amino acids (such as lysine in grains, or methionine in legumes). Consuming complementary proteins throughout the day resolves this.'
  },
  'Vegetarian': {
    title: 'Lacto-Ovo Vegetarian Dietetics',
    targetProteinAnalysis: 'Set at 18%, easily met through a combination of high-quality dairy, eggs, and rich plant staples like tofu.',
    targetCarbAnalysis: 'Balanced at 54% using unprocessed whole grains, vegetables, and legumes.',
    targetFatAnalysis: 'Kept at 28% from dairy, eggs, oils, and nuts.',
    primaryWarning: '⚠️ Bioavailability Notes: Lacto-ovo vegetarians should monitor zinc and iron levels, as phytates in whole grains can inhibit absorption.',
    clinicalStudyCitation: 'Marsh, K. A. et al. (2012). "Health Implications of a Vegetarian Diet." American Journal of Lifestyle Medicine, 6(3).',
    clinicalExplanation: 'Vegetarian diets are associated with lower blood pressure, improved lipid profiles, and a significantly reduced risk of type 2 diabetes.'
  },
  'Paleo': {
    title: 'Paleolithic Evolutionary Science',
    targetProteinAnalysis: 'Set at a robust 28% utilizing high-quality lean meats and wild-caught fish.',
    targetCarbAnalysis: 'Set at 30% obtained strictly from non-grain sources: root vegetables, berries, and green vegetables.',
    targetFatAnalysis: 'Set at 42% from healthy seed oils, coconut, nuts, and animal fats.',
    primaryWarning: '⚠️ Calcium Restriction Care: Because all dairy products are excluded, monitor calcium levels. Consume ample bone-in canned sardines, almonds, and leafy greens.',
    clinicalStudyCitation: 'Lindeberg, S. et al. (2007). "A Paleolithic Diet Confers Higher Insulin Sensitivity than a Mediterranean-like Diet." Diabetologia, 50(9).',
    clinicalExplanation: 'The exclusion of processed foods, refined sugars, and grains leads to higher satiety and significant improvements in insulin sensitivity and glucose tolerance.'
  },
  'Gluten Free': {
    title: 'Celiac & Gluten-Sensitivity Guidelines',
    targetProteinAnalysis: 'Set at 20% to support muscular maintenance and metabolic function.',
    targetCarbAnalysis: 'Balanced at 50% using gluten-free whole grains (quinoa, brown rice, buckwheat) and potatoes.',
    targetFatAnalysis: 'Maintained at a healthy 30% level.',
    primaryWarning: '⚠️ Ultra-Processed GF Food Danger: Many commercial gluten-free alternatives replace gluten with simple starches, sugars, and extra fat, making them nutritionally inferior and low in fiber.',
    clinicalStudyCitation: 'Gaesser, G. A., & Angadi, S. S. (2012). "Gluten-Free Diet: Implication for Appetite and Weight Loss." Journal of the Academy of Nutrition and Dietetics, 112(8).',
    clinicalExplanation: 'Gluten-free diets are essential for individuals with celiac disease or non-celiac gluten sensitivity. Focus on naturally gluten-free whole foods rather than packaged GF treats.'
  },
  'Normal': {
    title: 'Standard Balanced Macronutrient Guidelines',
    targetProteinAnalysis: 'Balanced at 20% of total calories, supporting general cellular repair, immune response, and daily maintenance.',
    targetCarbAnalysis: 'Balanced at 50% of total energy, supporting active glucose requirements for brain and muscle metabolism.',
    targetFatAnalysis: 'Maintained at 30% of total calories to facilitate absorption of fat-soluble vitamins (A, D, E, K).',
    primaryWarning: '⚠️ General Balance Care: Focus on limiting added sugars to under 10% of total calories, and consume at least 25g (women) to 38g (men) of total dietary fiber per day.',
    clinicalStudyCitation: 'U.S. Department of Agriculture (USDA). (2020). "Dietary Guidelines for Americans 2020-2025."',
    clinicalExplanation: 'The standard balanced split minimizes nutritional deficiency risk, maximizes food-source flexibility, and is the most sustainable baseline for long-term weight management.'
  }
};

export default function App() {
  // Application language is always English
  const appLanguage = 'en';

  const dict = TRANSLATIONS.en;

  // AI Food Logger States & Handlers
  const [targetDailyCalories, setTargetDailyCalories] = useState<number>(0);
  const [targetDailyProtein, setTargetDailyProtein] = useState<number>(0);
  const [targetDailyCarbs, setTargetDailyCarbs] = useState<number>(0);
  const [targetDailyFat, setTargetDailyFat] = useState<number>(0);

  const [loggedFoods, setLoggedFoods] = useState<Array<{
    id: string;
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    timestamp: string;
  }>>([]);
  const [foodInput, setFoodInput] = useState('');
  const [isLoggingFood, setIsLoggingFood] = useState(false);
  const [logFoodError, setLogFoodError] = useState('');

  const handleRecalculateFromProfile = () => {
    if (!onboarding) return;
    const baseBmr = Math.round(10 * onboarding.weight + 6.25 * onboarding.height - 5 * onboarding.age + (onboarding.gender === 'male' ? 5 : -161));
    const activityMultiplier = onboarding.activityLevel === 'sedentary' ? 1.2 : onboarding.activityLevel === 'lightly_active' ? 1.375 : onboarding.activityLevel === 'moderately_active' ? 1.55 : 1.725;
    const tdee = Math.round(baseBmr * activityMultiplier);
    
    const calculatedDailyCalories = onboarding.goal === 'lose_weight' ? tdee - 500 : onboarding.goal === 'gain_muscle' ? tdee + 300 : tdee;
    
    const diet = onboarding.dietType || 'Normal';
    let calculatedDailyProtein = 0;
    let calculatedDailyFat = 0;
    let calculatedDailyCarbs = 0;

    switch (diet) {
      case 'Keto':
        // Extremely low carb, high fat, moderate protein
        calculatedDailyProtein = Math.round((calculatedDailyCalories * 0.20) / 4);
        calculatedDailyFat = Math.round((calculatedDailyCalories * 0.75) / 9);
        calculatedDailyCarbs = Math.round((calculatedDailyCalories * 0.05) / 4);
        break;
      case 'Low Carb':
        // Low carb, higher protein and fat
        calculatedDailyProtein = Math.round((calculatedDailyCalories * 0.30) / 4);
        calculatedDailyFat = Math.round((calculatedDailyCalories * 0.50) / 9);
        calculatedDailyCarbs = Math.round((calculatedDailyCalories * 0.20) / 4);
        break;
      case 'High Protein':
        // High protein, lower carb, moderate fat
        calculatedDailyProtein = Math.round((calculatedDailyCalories * 0.38) / 4);
        calculatedDailyFat = Math.round((calculatedDailyCalories * 0.25) / 9);
        calculatedDailyCarbs = Math.round((calculatedDailyCalories * 0.37) / 4);
        break;
      case 'Paleo':
        // High protein, healthy fat, low/moderate carb
        calculatedDailyProtein = Math.round((calculatedDailyCalories * 0.28) / 4);
        calculatedDailyFat = Math.round((calculatedDailyCalories * 0.42) / 9);
        calculatedDailyCarbs = Math.round((calculatedDailyCalories * 0.30) / 4);
        break;
      case 'Mediterranean':
        // Balanced carbs and protein, rich in healthy fats (olive oil, nuts)
        calculatedDailyProtein = Math.round((calculatedDailyCalories * 0.20) / 4);
        calculatedDailyFat = Math.round((calculatedDailyCalories * 0.35) / 9);
        calculatedDailyCarbs = Math.round((calculatedDailyCalories * 0.45) / 4);
        break;
      case 'Vegan':
        // High plant-based carbs, moderate protein, moderate fat
        calculatedDailyProtein = Math.round((calculatedDailyCalories * 0.15) / 4);
        calculatedDailyFat = Math.round((calculatedDailyCalories * 0.25) / 9);
        calculatedDailyCarbs = Math.round((calculatedDailyCalories * 0.60) / 4);
        break;
      case 'Vegetarian':
        // Moderate protein, balanced carbs and fat
        calculatedDailyProtein = Math.round((calculatedDailyCalories * 0.18) / 4);
        calculatedDailyFat = Math.round((calculatedDailyCalories * 0.28) / 9);
        calculatedDailyCarbs = Math.round((calculatedDailyCalories * 0.54) / 4);
        break;
      case 'Gluten Free':
        // Standard split but gluten-free choice (similar to Normal)
        calculatedDailyProtein = Math.round((calculatedDailyCalories * 0.20) / 4);
        calculatedDailyFat = Math.round((calculatedDailyCalories * 0.30) / 9);
        calculatedDailyCarbs = Math.round((calculatedDailyCalories * 0.50) / 4);
        break;
      case 'Normal':
      default:
        // Balanced standard diet
        calculatedDailyProtein = Math.round((calculatedDailyCalories * 0.20) / 4);
        calculatedDailyFat = Math.round((calculatedDailyCalories * 0.30) / 9);
        calculatedDailyCarbs = Math.round((calculatedDailyCalories * 0.50) / 4);
        break;
    }
    
    // Cap protein intake at a safe, practical maximum of 180g (as requested by user)
    // Surplus calories are converted to carbohydrates (both are 4 kcal/gram) to preserve the exact calorie target
    if (calculatedDailyProtein > 180) {
      const surplusGrams = calculatedDailyProtein - 180;
      calculatedDailyProtein = 180;
      calculatedDailyCarbs += surplusGrams;
    }
    
    setTargetDailyCalories(calculatedDailyCalories);
    setTargetDailyProtein(calculatedDailyProtein);
    setTargetDailyCarbs(calculatedDailyCarbs);
    setTargetDailyFat(calculatedDailyFat);
  };

  const totalLoggedCalories = loggedFoods.reduce((sum, item) => sum + item.calories, 0);
  const totalLoggedProtein = loggedFoods.reduce((sum, item) => sum + item.protein, 0);
  const totalLoggedCarbs = loggedFoods.reduce((sum, item) => sum + item.carbs, 0);
  const totalLoggedFat = loggedFoods.reduce((sum, item) => sum + item.fat, 0);

  const handleLogFoodIntake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodInput.trim()) return;

    setIsLoggingFood(true);
    setLogFoodError('');

    try {
      const response = await fetch('/api/log-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: foodInput,
          onboarding: onboarding || tempOnboarding
        })
      });

      if (!response.ok) {
        throw new Error('Failed to contact nutrition logging assistant.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setLoggedFoods(prev => [
        {
          id: Math.random().toString(),
          foodName: data.foodName || foodInput,
          calories: Number(data.calories) || 0,
          protein: Number(data.protein) || 0,
          carbs: Number(data.carbs) || 0,
          fat: Number(data.fat) || 0,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
      setFoodInput('');
    } catch (err: any) {
      console.error(err);
      setLogFoodError(err.message || 'Unable to log food. Please check your server or API configuration.');
    } finally {
      setIsLoggingFood(false);
    }
  };

  const handleClearLoggedFood = (id: string) => {
    setLoggedFoods(prev => prev.filter(f => f.id !== id));
  };

  const handleResetLoggedFoods = () => {
    setLoggedFoods([]);
  };

  // Smart Pantry Modal / Adding states
  const [isPantryModalOpen, setIsPantryModalOpen] = useState(false);
  const [pantryItemName, setPantryItemName] = useState('');
  const [pantryItemQty, setPantryItemQty] = useState('');
  const [pantryItemDays, setPantryItemDays] = useState(10);

  const handleAddPantryItem = (name: string, qty: string, days: number) => {
    if (!name.trim()) return;
    const computedDays = Math.max(1, days);
    setPantryItems(prev => [
      ...prev,
      {
        id: Math.random().toString(),
        name: name.trim(),
        quantity: qty.trim() || '1',
        expirationDate: new Date(Date.now() + computedDays*24*60*60*1000).toISOString().split('T')[0],
        daysRemaining: computedDays
      }
    ]);
    setIsPantryModalOpen(false);
    setPantryItemName('');
    setPantryItemQty('');
    setPantryItemDays(10);
  };

  // Onboarding state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const [onboarding, setOnboarding] = useState<OnboardingData | null>(null);
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [tempOnboarding, setTempOnboarding] = useState<OnboardingData>({
    age: 0,
    gender: '',
    height: 0,
    weight: 0,
    goal: '',
    activityLevel: '',
    preferredStores: [],
    country: 'Romania',
    currency: 'lei',
    budget: 0,
    foodAllergies: [],
    foodsDislike: [],
    foodsLove: [],
    dietType: '',
    planningFrequency: ''
  });


  // Automatically calculate default nutrient targets when onboarding is filled or changed
  useEffect(() => {
    if (onboarding) {
      handleRecalculateFromProfile();
    }
  }, [onboarding?.weight, onboarding?.goal, onboarding?.height, onboarding?.age, onboarding?.activityLevel, onboarding?.gender, onboarding?.dietType]);

  // Settings Modal States
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsOnboarding, setSettingsOnboarding] = useState<OnboardingData | null>(null);

  // Sync settingsOnboarding copy when opening the settings modal
  useEffect(() => {
    if (isSettingsModalOpen && onboarding) {
      setSettingsOnboarding({ ...onboarding });
    }
  }, [isSettingsModalOpen, onboarding]);

  const handleSaveSettings = (updated: OnboardingData) => {
    setOnboarding(updated);
    setIsSettingsModalOpen(false);
    // Recalculate metrics for the shopping list with new target values
    setShoppingList(prev => recalculateShoppingListMetrics(prev.items));
  };

  // Daily Meal Plan Refresh / Rotation state
  const [refreshingPlan, setRefreshingPlan] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);

  const handleRefreshMealPlan = async () => {
    setRefreshingPlan(true);
    
    // Attempt dynamic AI optimization
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            id: 'system-refresh',
            sender: 'user',
            text: `Please generate a refreshed, completely new customized daily meal plan optimized for my active budget of ${onboarding?.budget} ${onboarding?.currency} and my target goal: ${onboarding?.goal}. Keep it highly compatible with my dietary preferences.`
          }],
          onboarding: onboarding || tempOnboarding,
          customPrompt: "Generate a refreshed daily meal plan"
        })
      });

      if (!response.ok) throw new Error();
      const result = await response.json();
      if (result.mealPlan) {
        setMealPlan(result.mealPlan);
      }
      if (result.budgetAnalysis && result.budgetAnalysis.suggestions) {
        setBudgetSuggestions(result.budgetAnalysis.suggestions);
      }
    } catch (e) {
      // Offline fallback: Rotate index to the next beautiful preset day
      const nextIndex = (presetIndex + 1) % MEAL_PRESETS_POOL.length;
      setPresetIndex(nextIndex);
      setMealPlan(MEAL_PRESETS_POOL[nextIndex]);
      
      const userCountry = onboarding?.country || 'Romania';
      const countryConfig = COUNTRIES[userCountry] || COUNTRIES['Romania'];
      
      // Update custom budget suggestions based on the newly rotated day
      setBudgetSuggestions([
        `Day ${nextIndex + 1} Daily rotation active! Your local supermarkets in ${userCountry} (${countryConfig.stores.join(', ')}) are fully stocked with these ingredients.`,
        `Swapped your daily meal selections with highly optimized alternatives to reduce waste and stay well within your ${formatPrice(onboarding?.budget || 350)} budget.`,
        `By cooking in bulk for ${MEAL_PRESETS_POOL[nextIndex].lunch.name}, you save additional prep time and minimize energy consumption.`
      ]);
    } finally {
      setTimeout(() => {
        setRefreshingPlan(false);
      }, 600);
    }
  };

  // Main UI Tabs
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'planner' | 'pantry' | 'cart'>('dashboard');

  const [recommendationCardTab, setRecommendationCardTab] = useState<'rec' | 'research'>('rec');
  const [viewDietResearchKey, setViewDietResearchKey] = useState<string>('Normal');
  const [isRefreshingShoppingList, setIsRefreshingShoppingList] = useState(false);

  // Optimization priority
  const [priority, setPriority] = useState<'cheapest' | 'healthiest' | 'highest_protein' | 'fastest_cooking'>('highest_protein');

  // Search in database catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [catalogLimit, setCatalogLimit] = useState(6);
  const [selectedProductDetail, setSelectedProductDetail] = useState<FoodProduct | null>(null);

  // Water Tracker
  const [waterAmount, setWaterAmount] = useState(1250); // ml

  // Budget Adherence & Weekly Planning Streak state
  const [streakDays, setStreakDays] = useState<Record<string, boolean>>({
    'Mon': true,
    'Tue': true,
    'Wed': true,
    'Thu': false,
    'Fri': false,
    'Sat': false,
    'Sun': false
  });

  // Custom chat message
  const [chatInput, setChatInput] = useState('');
  const [apiLoading, setApiLoading] = useState(false);

  // Active list state (populated initially with high-quality generated defaults or synced from AI API)
  const [shoppingList, setShoppingList] = useState<{
    items: ShoppingItem[];
    totalCost: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    totalCalories: number;
    totalFiber: number;
    costPerProteinGram: number;
    costPerCalorie: number;
    avgHealthScore: number;
  }>({
    items: [
      {
        product: FOOD_DATABASE[0], // Chicken Breast
        quantity: 1,
        totalCost: 24.99,
        consumeType: 'daily'
      },
      {
        product: FOOD_DATABASE[5], // Eggs 30pcs
        quantity: 1,
        totalCost: 19.99,
        consumeType: 'daily'
      },
      {
        product: FOOD_DATABASE[10], // Oats
        quantity: 1,
        totalCost: 3.49,
        consumeType: 'daily'
      },
      {
        product: FOOD_DATABASE[7], // Greek Yogurt 2%
        quantity: 1,
        totalCost: 5.49,
        consumeType: 'daily'
      },
      {
        product: FOOD_DATABASE[14], // Frozen Veggies
        quantity: 1,
        totalCost: 7.99,
        consumeType: 'daily'
      },
      {
        product: FOOD_DATABASE[15], // Banane
        quantity: 1,
        totalCost: 6.99,
        consumeType: 'daily'
      },
      {
        product: FOOD_DATABASE[17], // Peanut Butter
        quantity: 1,
        totalCost: 9.99,
        consumeType: 'daily'
      }
    ],
    totalCost: 78.93,
    totalProtein: 3610,
    totalCarbs: 4515,
    totalFat: 2599,
    totalCalories: 55899,
    totalFiber: 350,
    costPerProteinGram: 0.02,
    costPerCalorie: 0.001,
    avgHealthScore: 92
  });

  // Saved / Active Meal Plan
  const [mealPlan, setMealPlan] = useState<MealPlan>({
    breakfast: {
      name: "Protein Power Oatmeal",
      recipe: "Cook oats with water, stir in Greek yogurt and peanut butter, top with banana slices.",
      preparationSteps: [
        "In a bowl, mix 80g oats with 200ml hot water or milk.",
        "Microwave for 2 minutes.",
        "Stir in 150g Greek yogurt 2% and a tablespoon of peanut butter.",
        "Slice half a banana on top and serve."
      ],
      cookingTime: "5 mins",
      difficulty: "Easy",
      nutrition: { protein: 28, carbs: 62, fat: 12, calories: 470 },
      shoppingIngredients: ["Fulgi de ovăz clasici", "Iaurt grecesc 2%", "Unt de arahide cremos", "Banane proaspete"]
    },
    lunch: {
      name: "Seared Chicken with Basmati and Broccoli",
      recipe: "Pan-fry chicken breast, boil Basmati rice and steam frozen mixed vegetables.",
      preparationSteps: [
        "Season 200g chicken breast with salt, pepper, and garlic powder.",
        "Pan-sear in a non-stick pan with a spray of olive oil for 6 mins per side.",
        "Boil 80g Basmati rice in salted water.",
        "Steam 150g frozen mixed vegetables.",
        "Assemble and enjoy a high protein, clean fuel meal."
      ],
      cookingTime: "15 mins",
      difficulty: "Medium",
      nutrition: { protein: 52, carbs: 65, fat: 4, calories: 510 },
      shoppingIngredients: ["Piept de pui dezosat", "Orez Basmati", "Amestec de legume congelate"]
    },
    dinner: {
      name: "Egg & Tofu Veggie Scramble",
      recipe: "Scramble whole eggs with cubed tofu and mixed frozen veggies in a skillet.",
      preparationSteps: [
        "Chop 100g Tofu into small cubes.",
        "Crack 3 whole eggs into a bowl, whisk with a pinch of salt.",
        "Sauté tofu and a handful of mixed veggies in a skillet for 3 mins.",
        "Pour the whisked eggs into the skillet and stir gently until fully cooked."
      ],
      cookingTime: "10 mins",
      difficulty: "Easy",
      nutrition: { protein: 32, carbs: 12, fat: 22, calories: 370 },
      shoppingIngredients: ["Ouă proaspete M", "Tofu Clasic în saramură", "Amestec de legume congelate"]
    },
    snacks: {
      name: "Greek Yogurt & Berries bowl",
      recipe: "Top high protein low-fat Greek yogurt with antioxidant-rich frozen forest berries.",
      preparationSteps: [
        "Scoop 200g of Greek Yogurt 2% into a bowl.",
        "Microwave 80g of frozen berries for 30s to thaw.",
        "Mix together with a pinch of stevia or honey if preferred."
      ],
      cookingTime: "2 mins",
      difficulty: "Easy",
      nutrition: { protein: 18, carbs: 14, fat: 4, calories: 164 },
      shoppingIngredients: ["Iaurt grecesc 2%", "Fructe de pădure congelate"]
    }
  });

  // Budget Suggestions / Smart replacements
  const [budgetSuggestions, setBudgetSuggestions] = useState<string[]>([
    "Save 18 lei by replacing Salmon Fillets with Canned Tuna in your next run.",
    "Lidl is offering a 20% discount on Pilos Greek Yogurt 2% this week.",
    "Buying frozen mixed veggies instead of fresh broccoli saves you 4.5 lei per kg.",
    "Your active grocery list uses 41% of your weekly budget. You have 203.15 lei left!"
  ]);

  // Chat message history
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "Salut! I am your NutriCart AI personal grocery shopping optimizer. Tell me your budget and target nutritional goals, or click 'Generate Optimization Plan' to craft the cheapest and healthiest shopping list automatically!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Pantry inventory
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([
    { id: "1", name: "Oats", quantity: "1.2 kg", expirationDate: "2026-10-15", daysRemaining: 107 },
    { id: "2", name: "Whey Protein", quantity: "450g", expirationDate: "2026-12-01", daysRemaining: 154 },
    { id: "3", name: "Greek Yogurt", quantity: "400g", expirationDate: "2026-07-10", daysRemaining: 10 },
    { id: "4", name: "Eggs", quantity: "12 pcs", expirationDate: "2026-07-22", daysRemaining: 22 }
  ]);

  // Cart Items State
  const [cartItems, setCartItems] = useState<Array<{
    id: string;
    product: FoodProduct;
    quantity: number;
    totalCost: number;
    checked?: boolean;
  }>>([]);

  // Manual spent budget state (starts at 0 as requested)
  const [manualSpentAmount, setManualSpentAmount] = useState<number>(0);

  // Scaled meal plan to target daily kcal amount
  const baseTotalCalories = (mealPlan.breakfast?.nutrition?.calories || 0) +
                            (mealPlan.lunch?.nutrition?.calories || 0) +
                            (mealPlan.dinner?.nutrition?.calories || 0) +
                            (mealPlan.snacks?.nutrition?.calories || 0);

  const mealScaleFactor = baseTotalCalories > 0 && targetDailyCalories > 0 ? (targetDailyCalories / baseTotalCalories) : 1;

  const scaledMealPlan = React.useMemo(() => {
    if (!targetDailyCalories || baseTotalCalories <= 0) return mealPlan;

    // Helper to scale a single meal's macronutrient values
    const scaleMeal = (meal: any) => {
      if (!meal) return meal;
      return {
        ...meal,
        nutrition: {
          calories: Math.round(meal.nutrition.calories * mealScaleFactor),
          protein: Math.round(meal.nutrition.protein * mealScaleFactor),
          carbs: Math.round(meal.nutrition.carbs * mealScaleFactor),
          fat: Math.round(meal.nutrition.fat * mealScaleFactor)
        }
      };
    };

    return {
      breakfast: scaleMeal(mealPlan.breakfast),
      lunch: scaleMeal(mealPlan.lunch),
      dinner: scaleMeal(mealPlan.dinner),
      snacks: scaleMeal(mealPlan.snacks)
    };
  }, [mealPlan, targetDailyCalories, mealScaleFactor, baseTotalCalories]);

  // Cart operations
  const handleAddIndividualToCart = (product: FoodProduct, quantity: number) => {
    setCartItems(prev => {
      let updated = [...prev];
      const existingIdx = updated.findIndex(cartItem => cartItem.product.id === product.id);
      if (existingIdx > -1) {
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalCost: parseFloat((newQty * product.price).toFixed(2))
        };
      } else {
        updated.push({
          id: `cart-${Date.now()}-${product.id}`,
          product: product,
          quantity: quantity,
          totalCost: parseFloat((quantity * product.price).toFixed(2)),
          checked: true // Checked by default when added
        });
      }
      return updated;
    });
  };

  const handleAddToCartAndSync = () => {
    setCartItems(prev => {
      let updated = [...prev];
      shoppingList.items.forEach(shopItem => {
        const existingIdx = updated.findIndex(cartItem => cartItem.product.id === shopItem.product.id);
        if (existingIdx > -1) {
          const newQty = updated[existingIdx].quantity + shopItem.quantity;
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
            totalCost: parseFloat((newQty * shopItem.product.price).toFixed(2))
          };
        } else {
          updated.push({
            id: `cart-${Date.now()}-${shopItem.product.id}`,
            product: shopItem.product,
            quantity: shopItem.quantity,
            totalCost: parseFloat((shopItem.quantity * shopItem.product.price).toFixed(2)),
            checked: true
          });
        }
      });
      return updated;
    });
    alert('Successfully added all items from your shopping list to your active Cart!');
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateCartItemQty = (id: string, qty: number) => {
    if (qty < 1) return;
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          quantity: qty,
          totalCost: parseFloat((qty * item.product.price).toFixed(2))
        };
      }
      return item;
    }));
  };

  const handleToggleCartItemCheck = (id: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          checked: !item.checked
        };
      }
      return item;
    }));
  };

  const handleCheckoutCheckedItems = () => {
    const checkedItems = cartItems.filter(item => item.checked);
    if (checkedItems.length === 0) {
      alert('No checked items in the cart!');
      return;
    }

    const activeOnb = onboarding || tempOnboarding;
    const userCountry = activeOnb.country || 'Romania';
    const countryConfig = COUNTRIES[userCountry] || COUNTRIES['Romania'];
    const rate = countryConfig.rate;

    // Calculate total cost of checked items
    const checkedTotalCost = checkedItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const convertedCost = checkedTotalCost * rate;

    // Add to manualSpentAmount
    setManualSpentAmount(prev => parseFloat((prev + convertedCost).toFixed(2)));

    // Add to pantry
    const newPantryItems: PantryItem[] = checkedItems.map(item => {
      const days = 14; // Default expiration duration
      return {
        id: Math.random().toString(),
        name: localizeProductName(item.product.name),
        quantity: `${item.quantity}x ${item.product.weight}`,
        expirationDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        daysRemaining: days
      };
    });

    setPantryItems(prev => [...prev, ...newPantryItems]);

    // Remove checked items from cart
    setCartItems(prev => prev.filter(item => !item.checked));

    alert(`Successfully purchased checked items! The cost of ${convertedCost.toFixed(2)} ${countryConfig.currency} has been added to your spent log, and the items have been moved to your Smart Pantry.`);
  };

  // Dynamically synchronize smart budget suggestions with the user's active country/currency and shopping total
  useEffect(() => {
    const activeOnb = onboarding || tempOnboarding;
    const userCountry = activeOnb.country || 'Romania';
    const countryConfig = COUNTRIES[userCountry] || COUNTRIES['Romania'];
    const rate = countryConfig.rate;
    const curSym = countryConfig.currencySymbol;
    const activeBudget = activeOnb.budget || 350;

    const saved = activeBudget - (shoppingList.totalCost * rate);

    setBudgetSuggestions([
      `Save ${(18 * rate).toFixed(2)} ${curSym} by replacing Salmon Fillets with Canned Tuna in your next run.`,
      `${countryConfig.storeMap['Lidl'] || 'Lidl'} is offering a 20% discount on Greek Yogurt this week.`,
      `Buying frozen mixed veggies instead of fresh broccoli saves you ${(4.5 * rate).toFixed(2)} ${curSym} per kg.`,
      `Your active grocery list uses ${Math.round(((shoppingList.totalCost * rate) / (activeBudget || 1)) * 100)}% of your weekly budget. You have ${Math.max(0, saved).toFixed(2)} ${curSym} left!`
    ]);
  }, [onboarding?.country, onboarding?.budget, tempOnboarding.country, tempOnboarding.budget, shoppingList.totalCost]);

  // Handle skip/demo onboarding
  const skipOnboarding = () => {
    const validatedOnboarding: OnboardingData = {
      ...tempOnboarding,
      age: tempOnboarding.age || 24,
      height: tempOnboarding.height || 180,
      weight: tempOnboarding.weight || 78,
      budget: tempOnboarding.budget || 350
    };
    setOnboarding(validatedOnboarding);
  };

  const handleOnboardingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validatedOnboarding: OnboardingData = {
      ...tempOnboarding,
      age: tempOnboarding.age || 24,
      height: tempOnboarding.height || 180,
      weight: tempOnboarding.weight || 78,
      budget: tempOnboarding.budget || 350
    };
    setOnboarding(validatedOnboarding);
  };

  // Call API chat model
  const sendChatMessage = async (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setApiLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          onboarding: onboarding || tempOnboarding,
          customPrompt: textToSend
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch optimized plan');
      }

      const result = await response.json();
      
      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        shoppingList: result.shoppingList || undefined,
        mealPlan: result.mealPlan || undefined,
        budgetAnalysis: result.budgetAnalysis || undefined
      };

      setMessages(prev => [...prev, aiMsg]);

      // If the response returned optimized metrics, sync them to our global dashboard
      if (result.shoppingList) {
        setShoppingList(result.shoppingList);
      }
      if (result.mealPlan) {
        setMealPlan(result.mealPlan);
      }
      if (result.budgetAnalysis && result.budgetAnalysis.suggestions) {
        setBudgetSuggestions(result.budgetAnalysis.suggestions);
      }

    } catch (err: any) {
      console.error(err);
      // Simulate premium/offline fallback in case API key is missing or failed
      setTimeout(() => {
        const fallbackMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'ai',
          text: `I simulated the optimization for your query: "${textToSend}". Under your budget, I maximized the protein per Leu ratio. I suggest focusing on Oats, Greek Yogurt 2%, Eggs, and Canned Tuna.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }, 1000);
    } finally {
      setApiLoading(false);
    }
  };

  // Smart Alternative Swap
  const handleSwapItem = (itemId: string, currentProduct: FoodProduct) => {
    const alternativeName = currentProduct.alternatives[0];
    if (!alternativeName) return;

    // Find the replacement product in database
    const replacement = FOOD_DATABASE.find(p => p.name.toLowerCase().includes(alternativeName.toLowerCase()) || p.id === alternativeName);
    if (!replacement) return;

    setShoppingList(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.product.id === currentProduct.id) {
          return {
            ...item,
            product: replacement,
            totalCost: replacement.price * item.quantity
          };
        }
        return item;
      });

      return {
        ...prev,
        ...recalculateShoppingListMetrics(updatedItems)
      };
    });

    setBudgetSuggestions(prev => [
      `Swapped ${currentProduct.name} with healthier/cheaper ${replacement.name}!`,
      ...prev.slice(0, 3)
    ]);
  };

  // Add customized item from search catalog
  const handleAddProductToList = (product: FoodProduct) => {
    setShoppingList(prev => {
      const existing = prev.items.find(item => item.product.id === product.id);
      let updatedItems;
      if (existing) {
        updatedItems = prev.items.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1, totalCost: parseFloat(((item.quantity + 1) * product.price).toFixed(2)) }
            : item
        );
      } else {
        updatedItems = [...prev.items, { product, quantity: 1, totalCost: product.price, consumeType: 'daily' }];
      }

      return {
        ...prev,
        ...recalculateShoppingListMetrics(updatedItems)
      };
    });
  };

  // Remove item
  const handleRemoveItem = (productId: string) => {
    setShoppingList(prev => {
      const updatedItems = prev.items.filter(item => item.product.id !== productId);
      return {
        ...prev,
        ...recalculateShoppingListMetrics(updatedItems)
      };
    });
  };

  // Export List CSV Simulation
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += `Product,Store,Brand,Price (${countryConfig.currency}),Qty,Total Cost (${countryConfig.currency}),Protein,Carbs,Fat,Calories\r\n`;
    shoppingList.items.forEach(item => {
      const localizedName = localizeProductName(item.product.name).replace(/"/g, '""');
      const localizedStoreVal = localizeStore(item.product.store).replace(/"/g, '""');
      const unitPrice = (item.product.price * countryConfig.rate).toFixed(2);
      const totalCost = (item.totalCost * countryConfig.rate).toFixed(2);
      const localizedBrandVal = localizeBrand(item.product.brand).replace(/"/g, '""');
      csvContent += `"${localizedName}","${localizedStoreVal}","${localizedBrandVal}",${unitPrice},${item.quantity},${totalCost},${item.product.protein},${item.product.carbs},${item.product.fat},${item.product.calories}\r\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `NutriCart_AI_ShoppingList.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Regenerate/Refresh shopping list from current meal plan & diet rules
  const handleRefreshShoppingList = async () => {
    setIsRefreshingShoppingList(true);
    const activeOnb = onboarding || tempOnboarding;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            id: 'system-list-refresh',
            sender: 'user',
            text: `Please completely regenerate, recalculate, and optimize my active shopping list items to perfectly align with my current diet type (${activeOnb?.dietType}), food allergies (${activeOnb?.foodAllergies?.join(', ') || 'none'}), dislikes (${activeOnb?.foodsDislike?.join(', ') || 'none'}), and budget constraints (${activeOnb?.budget} ${activeOnb?.currency}). Keep it fully integrated with our active daily meal plan recipes.`
          }],
          onboarding: activeOnb,
          customPrompt: "Regenerate the optimal shopping list"
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.shoppingList) {
          setShoppingList(result.shoppingList);
          if (result.budgetAnalysis && result.budgetAnalysis.suggestions) {
            setBudgetSuggestions(result.budgetAnalysis.suggestions);
          }
          setIsRefreshingShoppingList(false);
          return;
        }
      }
    } catch (e) {
      console.warn("AI Shopping list refresh fetch failed, falling back to client-side high-fidelity logic");
    }

    // Offline High-Fidelity Regeneration Fallback
    setTimeout(() => {
      const dietType = activeOnb?.dietType || 'Normal';
      const allergies = activeOnb?.foodAllergies || [];
      const dislikes = activeOnb?.foodsDislike || [];
      
      // 1. Gather all required ingredients from the active meal plan
      const mealIngredients = [
        ...(mealPlan?.breakfast?.shoppingIngredients || []),
        ...(mealPlan?.lunch?.shoppingIngredients || []),
        ...(mealPlan?.dinner?.shoppingIngredients || []),
        ...(mealPlan?.snacks?.shoppingIngredients || []),
      ];

      // 2. Map ingredient strings to catalog products in FOOD_DATABASE, filtered by allergies/dislikes
      const selectedProducts: FoodProduct[] = [];
      const addedProductIds = new Set<string>();

      // Helper to clean and match ingredients
      const matchProduct = (ingName: string) => {
        const norm = ingName.toLowerCase();
        
        // Find a product that contains this ingredient or vice versa
        return FOOD_DATABASE.find(p => {
          if (isAllergicOrDisliked(p, allergies, dislikes)) return false;
          
          const pNameLower = p.name.toLowerCase();
          const pCategoryLower = p.category.toLowerCase();
          const pIngLower = (p.ingredients || '').toLowerCase();
          
          return pNameLower.includes(norm) || 
                 norm.includes(pNameLower) || 
                 pIngLower.includes(norm) ||
                 (norm.includes('pui') && pNameLower.includes('pui')) ||
                 (norm.includes('ou') && pNameLower.includes('ou')) ||
                 (norm.includes('ovăz') && pNameLower.includes('ovăz')) ||
                 (norm.includes('iaurt') && pNameLower.includes('iaurt')) ||
                 (norm.includes('legume') && pNameLower.includes('legume')) ||
                 (norm.includes('unt de arahide') && pNameLower.includes('arahide')) ||
                 (norm.includes('tofu') && pNameLower.includes('tofu')) ||
                 (norm.includes('fructe') && pNameLower.includes('fructe')) ||
                 (norm.includes('somon') && pNameLower.includes('somon'));
        });
      };

      mealIngredients.forEach(ing => {
        const match = matchProduct(ing);
        if (match && !addedProductIds.has(match.id)) {
          selectedProducts.push(match);
          addedProductIds.add(match.id);
        }
      });

      // 3. If the resulting list is too small, add standard safe staples for the diet type
      if (selectedProducts.length < 4) {
        FOOD_DATABASE.forEach(p => {
          if (selectedProducts.length >= 7) return;
          if (addedProductIds.has(p.id)) return;
          if (isAllergicOrDisliked(p, allergies, dislikes)) return;

          // Check diet compatibility
          if (dietType === 'Keto' && p.carbs > 8) return;
          if (dietType === 'Vegan' && (p.category.includes('Meat') || p.category.includes('Dairy') || p.name.includes('ouă') || p.name.includes('Egg') || p.name.includes('pui') || p.name.includes('somon'))) return;
          if (dietType === 'Vegetarian' && (p.category.includes('Meat') || p.name.includes('pui') || p.name.includes('somon'))) return;
          if (dietType === 'Gluten Free' && (p.name.includes('pâine') || p.name.includes('wheat') || p.name.includes('paste') || p.name.includes('făină'))) return;

          selectedProducts.push(p);
          addedProductIds.add(p.id);
        });
      }

      // 4. Convert into ShoppingItem array
      const freshItems: ShoppingItem[] = selectedProducts.map(product => {
        // Set standard initial quantity
        let initialQty = 1;
        // If it's something consumed in larger quantities, maybe 2
        if (product.name.toLowerCase().includes('iaurt') || product.name.toLowerCase().includes('banane')) {
          initialQty = 2;
        }
        return {
          product,
          quantity: initialQty,
          totalCost: product.price * initialQty,
          consumeType: 'daily'
        };
      });

      // 5. Apply metrics and update state
      setShoppingList(recalculateShoppingListMetrics(freshItems));
      
      // Sync a beautiful success notification/log
      setBudgetSuggestions(prev => [
        `Successfully refreshed and synchronized shopping list items with your active ${dietType} diet!`,
        ...prev.slice(0, 3)
      ]);

      setIsRefreshingShoppingList(false);
    }, 600);
  };

  // Initial prompt setup helper
  const handleQuickOptimize = (goalStr: string) => {
    setActiveTab('chat');
    sendChatMessage(goalStr);
  };

  const isStep1Valid = tempOnboarding.age > 0 &&
                       tempOnboarding.gender !== '' &&
                       tempOnboarding.height > 0 &&
                       tempOnboarding.weight > 0 &&
                       tempOnboarding.activityLevel !== '';

  const isStep2Valid = tempOnboarding.goal !== '' &&
                       tempOnboarding.dietType !== '';

  const isStep3Valid = tempOnboarding.budget > 0 &&
                       tempOnboarding.planningFrequency !== '' &&
                       tempOnboarding.preferredStores.length > 0;

  const isCurrentStepValid = onboardingStep === 1 
    ? isStep1Valid 
    : onboardingStep === 2 
    ? isStep2Valid 
    : isStep3Valid;

  // If onboarding is not completed, show the beautiful step-by-step form
  if (!onboarding) {
    return (
      <div id="onboarding-screen" className="min-h-screen bg-[#F8F9FA] flex flex-col justify-between font-sans text-slate-800">
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#4CAF50] rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#2E7D32]">NutriCart<span className="text-slate-400">AI</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="theme-toggle-onboarding"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 hover:bg-slate-100 rounded-xl text-[#4CAF50] hover:text-[#2E7D32] transition flex items-center justify-center"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-2xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-center">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
              <span className="text-xs font-bold text-[#4CAF50] uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-full self-start">
                {dict.step} {onboardingStep} {dict.stepOf}
              </span>
              <h2 className="text-xs sm:text-sm font-semibold text-slate-400">{dict.personalizeTitle}</h2>
            </div>

            {onboardingStep === 1 && (
              <div className="space-y-4">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{dict.physicalProfileTitle}</h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{dict.physicalProfileDesc}</p>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.age} <span className="text-red-500 font-bold">*</span></label>
                    <input 
                      type="number" 
                      value={tempOnboarding.age === 0 ? '' : tempOnboarding.age}
                      onChange={e => setTempOnboarding({ ...tempOnboarding, age: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.gender} <span className="text-red-500 font-bold">*</span></label>
                    <select 
                      value={tempOnboarding.gender}
                      onChange={e => setTempOnboarding({ ...tempOnboarding, gender: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-medium text-slate-800"
                    >
                      <option value="" disabled hidden>Choose Gender</option>
                      <option value="male">{dict.genderMale}</option>
                      <option value="female">{dict.genderFemale}</option>
                      <option value="other">{dict.genderOther}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.height} <span className="text-red-500 font-bold">*</span></label>
                    <input 
                      type="number" 
                      value={tempOnboarding.height === 0 ? '' : tempOnboarding.height}
                      onChange={e => setTempOnboarding({ ...tempOnboarding, height: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.weight} <span className="text-red-500 font-bold">*</span></label>
                    <input 
                      type="number" 
                      value={tempOnboarding.weight === 0 ? '' : tempOnboarding.weight}
                      onChange={e => setTempOnboarding({ ...tempOnboarding, weight: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none" 
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">{dict.activityLevel} <span className="text-red-500 font-bold">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { key: 'sedentary', label: dict.sedentary, desc: 'Little to no exercise' },
                      { key: 'lightly_active', label: dict.lightlyActive, desc: '1-3 days light exercise' },
                      { key: 'moderately_active', label: dict.moderatelyActive, desc: '3-5 days moderate exercise' },
                      { key: 'very_active', label: dict.veryActive, desc: '6-7 days heavy training' }
                    ].map(act => (
                      <button
                        key={act.key}
                        type="button"
                        onClick={() => setTempOnboarding({ ...tempOnboarding, activityLevel: act.key as any })}
                        className={`text-left p-2.5 sm:p-3 rounded-xl border transition ${tempOnboarding.activityLevel === act.key ? 'border-[#4CAF50] bg-green-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                        <p className="text-xs font-bold text-slate-800">{act.label}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{act.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-4">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{dict.goalsTitle}</h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{dict.goalsDesc}</p>
                
                <div className="space-y-4">
                  {/* AI & Clinical Normative Diet Recommendation Callout */}
                  {(() => {
                    const rec = getRecommendedDiet(tempOnboarding.age, tempOnboarding.weight, tempOnboarding.height);
                    return (
                      <div className="bg-[#4CAF50]/10 border border-[#4CAF50]/20 rounded-2xl p-4 text-left shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-[#2E7D32]" />
                          <h4 className="text-xs font-black text-[#2E7D32] uppercase tracking-wider">Clinical Diet Recommendation (Normative-Based)</h4>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          Based on your age of <span className="font-bold">{tempOnboarding.age}</span> and weight of <span className="font-bold">{tempOnboarding.weight} kg</span>, standard medical and nutrition guidelines recommend a <span className="font-bold text-[#2E7D32]">{rec.diet}</span> diet structure.
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1.5 leading-normal bg-white/60 p-2.5 rounded-xl border border-slate-100 italic">
                          "{rec.reason}"
                        </p>
                        <button
                          type="button"
                          onClick={() => setTempOnboarding({ ...tempOnboarding, dietType: rec.diet as any })}
                          className="mt-3 inline-flex items-center gap-1.5 bg-[#2E7D32] hover:bg-[#1b4e20] text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition active:scale-95 shadow-sm shadow-green-100"
                        >
                          Auto-Apply {rec.diet} Diet
                        </button>
                      </div>
                    );
                  })()}

                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">{dict.targetGoal} <span className="text-red-500 font-bold">*</span></label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { key: 'lose_weight', label: dict.goalLose, desc: 'High calorie deficit' },
                        { key: 'gain_muscle', label: dict.goalGain, desc: 'Caloric surplus with high protein' },
                        { key: 'maintain', label: dict.goalMaintain, desc: 'Clean metabolic balance' },
                        { key: 'general_health', label: dict.goalGeneral, desc: 'Rich micronutrients & high fiber' }
                      ].map(g => (
                        <button
                          key={g.key}
                          type="button"
                          onClick={() => setTempOnboarding({ ...tempOnboarding, goal: g.key as any })}
                          className={`text-left p-2.5 sm:p-3 rounded-xl border transition ${tempOnboarding.goal === g.key ? 'border-[#4CAF50] bg-green-50/50' : 'border-slate-200 hover:border-slate-300'}`}
                        >
                          <p className="text-xs font-bold text-slate-800">{g.label}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{g.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">{dict.dietPreset} <span className="text-red-500 font-bold">*</span></label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Normal', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 'High Protein', 'Low Carb', 'Gluten Free'].map(diet => {
                        const rec = getRecommendedDiet(tempOnboarding.age, tempOnboarding.weight, tempOnboarding.height);
                        const isRecommended = diet === rec.diet;
                        return (
                          <button
                            key={diet}
                            type="button"
                            onClick={() => setTempOnboarding({ ...tempOnboarding, dietType: diet as any })}
                            className={`text-center py-2 px-1 text-xs font-semibold rounded-xl border transition flex flex-col items-center justify-center gap-0.5 ${
                              tempOnboarding.dietType === diet 
                                ? 'border-[#4CAF50] bg-green-50 text-[#2E7D32]' 
                                : isRecommended 
                                ? 'border-dashed border-amber-400 hover:border-amber-500 bg-amber-50/20' 
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span className="font-bold">{diet}</span>
                            {isRecommended && (
                              <span className="text-[8px] font-black text-amber-600 tracking-wider uppercase leading-none">★ RECOMMENDED</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {onboardingStep === 3 && (
              <div className="space-y-4">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{dict.locationBudgetTitle}</h1>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{dict.locationBudgetDesc}</p>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.country}</label>
                      <select
                        value={tempOnboarding.country || 'Romania'}
                        onChange={e => {
                          const val = e.target.value;
                          const countryData = COUNTRIES[val] || COUNTRIES['Romania'];
                          const currentCountryData = COUNTRIES[tempOnboarding.country || 'Romania'] || COUNTRIES['Romania'];
                          
                          // Convert the budget dynamically based on the exchange rate ratio
                          const defaultRate = countryData.rate / (currentCountryData.rate || 1.0);
                          const equivalentBudget = Math.round(tempOnboarding.budget * defaultRate);
 
                          setTempOnboarding({
                            ...tempOnboarding,
                            country: val,
                            currency: countryData.currency,
                            budget: equivalentBudget,
                            preferredStores: [...countryData.stores]
                          });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-medium text-slate-800"
                      >
                        {Object.keys(COUNTRIES).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.currency}</label>
                      <select
                        value={tempOnboarding.currency || 'RON'}
                        onChange={e => setTempOnboarding({ ...tempOnboarding, currency: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-medium text-slate-800"
                      >
                        <option value="RON">Romanian Leu (RON, lei)</option>
                        <option value="MDL">Moldovan Leu (MDL, MDL)</option>
                        <option value="USD">US Dollar (USD, $)</option>
                        <option value="GBP">British Pound (GBP, £)</option>
                        <option value="EUR">Euro (EUR, €)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.budgetLimit} <span className="text-red-500 font-bold">*</span></label>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={tempOnboarding.budget === 0 ? '' : tempOnboarding.budget}
                          onChange={e => setTempOnboarding({ ...tempOnboarding, budget: parseInt(e.target.value) || 0 })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none pr-12 sm:pr-14" 
                        />
                        <span className="absolute right-3 top-2.5 sm:top-3.5 text-[10px] sm:text-xs font-bold text-[#4CAF50]">{tempOnboarding.currency || 'lei'}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.planningPeriod} <span className="text-red-500 font-bold">*</span></label>
                      <select
                        value={tempOnboarding.planningFrequency}
                        onChange={e => setTempOnboarding({ ...tempOnboarding, planningFrequency: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-medium text-slate-800"
                      >
                        <option value="" disabled hidden>Choose Period</option>
                        <option value="daily">{dict.planningDaily}</option>
                        <option value="weekly">{dict.planningWeekly}</option>
                        <option value="monthly">{dict.planningMonthly}</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">{dict.preferredStores} ({tempOnboarding.country || 'Romania'}) <span className="text-red-500 font-bold">*</span></label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {(COUNTRIES[tempOnboarding.country || 'Romania']?.stores || COUNTRIES['Romania'].stores).map(store => {
                        const isSelected = tempOnboarding.preferredStores.includes(store);
                        return (
                          <button
                            key={store}
                            type="button"
                            onClick={() => {
                              const updated = isSelected 
                                ? tempOnboarding.preferredStores.filter(s => s !== store)
                                : [...tempOnboarding.preferredStores, store];
                              setTempOnboarding({ ...tempOnboarding, preferredStores: updated });
                            }}
                            className={`py-2 px-1 text-[10px] sm:text-[11px] font-bold rounded-xl border transition ${isSelected ? 'border-[#4CAF50] bg-green-50 text-[#2E7D32]' : 'border-slate-200 hover:border-slate-300'}`}
                          >
                            {store}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.allergies}</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Peanuts, Gluten" 
                        value={tempOnboarding.foodAllergies.join(', ')}
                        onChange={e => setTempOnboarding({ ...tempOnboarding, foodAllergies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.dislikedFoods}</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Fish, Milk" 
                        value={tempOnboarding.foodsDislike.join(', ')}
                        onChange={e => setTempOnboarding({ ...tempOnboarding, foodsDislike: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isCurrentStepValid && (
              <div className="mt-6 p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-2.5 text-xs text-rose-600 font-medium">
                <span className="inline-flex w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                <span>Please fill in all required fields marked with an asterisk (<span className="font-bold text-rose-700">*</span>) to proceed.</span>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
              {onboardingStep > 1 ? (
                <button 
                  type="button" 
                  onClick={() => setOnboardingStep(onboardingStep - 1)}
                  className="bg-slate-100 text-slate-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm hover:bg-slate-200 transition"
                >
                  {dict.back}
                </button>
              ) : (
                <div />
              )}

              {onboardingStep < 3 ? (
                <button 
                  type="button" 
                  disabled={!isCurrentStepValid}
                  onClick={() => setOnboardingStep(onboardingStep + 1)}
                  className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg ${
                    isCurrentStepValid 
                      ? 'bg-[#4CAF50] text-white shadow-green-100 hover:bg-[#2E7D32] animate-pulse' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                  }`}
                >
                  {dict.next}
                </button>
              ) : (
                <button 
                  type="button" 
                  disabled={!isCurrentStepValid}
                  onClick={handleOnboardingSubmit}
                  className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition shadow-lg ${
                    isCurrentStepValid 
                      ? 'bg-[#2E7D32] text-white shadow-green-200 hover:bg-[#1b4e20]' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none'
                  }`}
                >
                  {dict.submit}
                </button>
              )}
            </div>
          </div>
        </main>

        <footer className="h-12 border-t border-slate-100 flex items-center justify-center text-xs text-slate-400">
          Powered by Gemini 3.5 &amp; Romanian Market Catalog
        </footer>
      </div>
    );
  }

  // Calculate target progress ratios for visual stats (Linked to AI Logged Intake)
  const activeCalories = totalLoggedCalories;
  const activeProtein = totalLoggedProtein;
  const activeCarbs = totalLoggedCarbs;
  const activeFat = totalLoggedFat;

  // Currency and Store Localization helpers based on active onboarding
  const activeCountry = onboarding?.country || tempOnboarding?.country || 'Romania';
  const countryConfig = COUNTRIES[activeCountry] || COUNTRIES['Romania'];

  const formatPriceLocal = (price: number) => {
    if (countryConfig.currencySymbol === '$') {
      return `$${price.toFixed(2)}`;
    } else if (countryConfig.currencySymbol === '£') {
      return `£${price.toFixed(2)}`;
    } else if (countryConfig.currencySymbol === '€') {
      return `€${price.toFixed(2)}`;
    } else {
      return `${price.toFixed(2)} ${countryConfig.currencySymbol}`;
    }
  };

  const formatPrice = (price: number) => {
    const converted = price * countryConfig.rate;
    return formatPriceLocal(converted);
  };

  const localizeStore = (store: string) => {
    return countryConfig.storeMap[store] || store;
  };

  const localizeProductName = (name: string) => {
    const match = name.match(/\(([^)]+)\)/);
    if (match && match[1]) {
      return match[1];
    }
    return name;
  };

  const localizeBrand = (brand: string) => {
    const activeCountry = onboarding?.country || tempOnboarding.country || 'Romania';
    if (activeCountry === 'Romania') return brand;

    const brandMaps: Record<string, Record<string, string>> = {
      "United States": {
        "Cămara Noastră": "Trader Joe's",
        "Sabin": "Kirkland Signature",
        "Ocean Fish": "365 Whole Foods",
        "Nixe": "Bumble Bee",
        "CocoRico": "Tyson Foods",
        "K-Classic": "Great Value",
        "Pilos": "Friendly Farms",
        "Covalact de Țară": "Organic Valley",
        "Inedit": "House Foods",
        "Crownfield": "Quaker Oats",
        "Uncle Ben's": "Ben's Original",
        "Vel Pitar": "Nature's Own",
        "Combino": "Barilla",
        "Freshona": "Green Giant",
        "Hortex": "Birds Eye",
        "Chiquita": "Chiquita",
        "Delhaize": "365 Whole Foods",
        "Green Grocer": "Wyman's",
        "Mcennedy": "Skippy",
        "Bellarom": "Blue Diamond",
        "Myprotein": "Myprotein",
        "Primadonna": "Bertolli"
      },
      "United Kingdom": {
        "Cămara Noastră": "Tesco Finest",
        "Sabin": "British Beef",
        "Ocean Fish": "John West",
        "Nixe": "Princes",
        "CocoRico": "Bernard Matthews",
        "K-Classic": "Asda Smart Price",
        "Pilos": "Cravendale",
        "Covalact de Țară": "Cathedral City",
        "Inedit": "Cauldron",
        "Crownfield": "Quaker Oats",
        "Uncle Ben's": "Ben's Original",
        "Vel Pitar": "Hovis",
        "Combino": "Napolina",
        "Freshona": "Green Giant",
        "Hortex": "Aunt Bessie's",
        "Chiquita": "Chiquita",
        "Delhaize": "M&S Food",
        "Green Grocer": "Copella",
        "Mcennedy": "Sun-Pat",
        "Bellarom": "Whitworths",
        "Myprotein": "Myprotein",
        "Primadonna": "Filippo Berio"
      },
      "Germany": {
        "Cămara Noastră": "Landliebe",
        "Sabin": "Wilhelm Brandenburg",
        "Ocean Fish": "Deutsche See",
        "Nixe": "Appel",
        "CocoRico": "Wiesenhof",
        "K-Classic": "Ja!",
        "Pilos": "Milbona",
        "Covalact de Țară": "Weihenstephan",
        "Inedit": "Taifun Tofu",
        "Crownfield": "Kölln",
        "Uncle Ben's": "Ben's Original",
        "Vel Pitar": "Harry Brot",
        "Combino": "Barilla",
        "Freshona": "Mildessa",
        "Hortex": "Frosta",
        "Chiquita": "Chiquita",
        "Delhaize": "Rewe Beste Wahl",
        "Green Grocer": "Iglo",
        "Mcennedy": "Ültje",
        "Bellarom": "Milbona",
        "Myprotein": "Myprotein",
        "Primadonna": "Mazzetti"
      },
      "Spain": {
        "Cămara Noastră": "Hacendado",
        "Sabin": "Campofrío",
        "Ocean Fish": "Pescanova",
        "Nixe": "Calvo",
        "CocoRico": "Coren",
        "K-Classic": "Carrefour",
        "Pilos": "Hacendado",
        "Covalact de Țară": "Central Lechera Asturiana",
        "Inedit": "Soria Natural",
        "Crownfield": "Kölln",
        "Uncle Ben's": "Ben's Original",
        "Vel Pitar": "Bimbo",
        "Combino": "Gallo",
        "Freshona": "Carretilla",
        "Hortex": "Findus",
        "Chiquita": "Chiquita",
        "Delhaize": "El Corte Inglés",
        "Green Grocer": "La Sirena",
        "Mcennedy": "Capitán Maní",
        "Bellarom": "Borges",
        "Myprotein": "Myprotein",
        "Primadonna": "Carbonell"
      },
      "Moldova": {
        "Cămara Noastră": "Linella Produs",
        "Sabin": "Sabin",
        "Ocean Fish": "Ocean Fish",
        "Nixe": "Nixe",
        "CocoRico": "CocoRico",
        "K-Classic": "K-Classic",
        "Pilos": "Milbona",
        "Covalact de Țară": "Covalact",
        "Inedit": "Inedit",
        "Crownfield": "Crownfield",
        "Uncle Ben's": "Uncle Ben's",
        "Vel Pitar": "Vel Pitar",
        "Combino": "Combino",
        "Freshona": "Freshona",
        "Hortex": "Hortex",
        "Chiquita": "Chiquita",
        "Delhaize": "Delhaize",
        "Green Grocer": "Green Grocer",
        "Mcennedy": "Mcennedy",
        "Bellarom": "Bellarom",
        "Myprotein": "Myprotein",
        "Primadonna": "Primadonna"
      }
    };

    return brandMaps[activeCountry]?.[brand] || brand;
  };

  const recalculateShoppingListMetrics = (items: ShoppingItem[], customOnboarding?: OnboardingData) => {
    const activeOnboarding = customOnboarding || onboarding || tempOnboarding;
    const dietType = activeOnboarding?.dietType || 'Normal';

    const updatedItems = items.map(item => {
      // Use the actual package price as requested (a person buys the product which will last for many days)
      const totalCost = parseFloat((item.product.price * item.quantity).toFixed(2));

      return {
        ...item,
        totalCost
      };
    });

    const totalCost = updatedItems.reduce((acc, item) => acc + item.totalCost, 0);

    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalCalories = 0;
    let totalFiber = 0;

    updatedItems.forEach(item => {
      const portion = getStandardDailyPortion(item.product.name, dietType);
      const consume = item.consumeType || 'daily';
      
      const consumedQty = consume === 'daily' ? portion.amount : portion.amount * 7;

      const weightGrams = getWeightInGrams(item.product.weight);
      const pieceCount = getProductPieceCount(item.product);
      const packSize = portion.unit === 'pcs' ? pieceCount : weightGrams;

      const purchasedQty = packSize * item.quantity;
      const actualConsumedQty = Math.min(consumedQty, purchasedQty);

      if (portion.unit === 'pcs') {
        const estWeightPerPiece = item.product.name.toLowerCase().includes('ouă') || item.product.name.toLowerCase().includes('egg') ? 50 : 15;
        const estWeightGrams = actualConsumedQty * estWeightPerPiece;
        totalProtein += (item.product.protein * estWeightGrams) / 100;
        totalCarbs += (item.product.carbs * estWeightGrams) / 100;
        totalFat += (item.product.fat * estWeightGrams) / 100;
        totalCalories += (item.product.calories * estWeightGrams) / 100;
        totalFiber += ((item.product.fiber || 0) * estWeightGrams) / 100;
      } else {
        totalProtein += (item.product.protein * actualConsumedQty) / 100;
        totalCarbs += (item.product.carbs * actualConsumedQty) / 100;
        totalFat += (item.product.fat * actualConsumedQty) / 100;
        totalCalories += (item.product.calories * actualConsumedQty) / 100;
        totalFiber += ((item.product.fiber || 0) * actualConsumedQty) / 100;
      }
    });

    const costPerProteinGram = totalProtein > 0 ? (totalCost * countryConfig.rate) / totalProtein : 0;
    const costPerCalorie = totalCalories > 0 ? (totalCost * countryConfig.rate) / totalCalories : 0;
    const avgHealthScore = updatedItems.length > 0 ? Math.round(updatedItems.reduce((acc, item) => acc + item.product.healthScore, 0) / updatedItems.length) : 0;

    return {
      items: updatedItems,
      totalCost: parseFloat(totalCost.toFixed(2)),
      totalProtein: Math.round(totalProtein),
      totalCarbs: Math.round(totalCarbs),
      totalFat: Math.round(totalFat),
      totalCalories: Math.round(totalCalories),
      totalFiber: Math.round(totalFiber),
      costPerProteinGram: parseFloat(costPerProteinGram.toFixed(4)),
      costPerCalorie: parseFloat(costPerCalorie.toFixed(4)),
      avgHealthScore
    };
  };

  const handleUpdateItemQuantity = (productId: string, newQty: number) => {
    if (newQty < 1) {
      handleRemoveItem(productId);
      return;
    }
    setShoppingList(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity: newQty
          };
        }
        return item;
      });
      return recalculateShoppingListMetrics(updatedItems);
    });
  };

  const handleToggleConsumeType = (productId: string, type: 'daily' | 'weekly') => {
    setShoppingList(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            consumeType: type
          };
        }
        return item;
      });
      return recalculateShoppingListMetrics(updatedItems);
    });
  };

  // Streak & Adherence Calculations
  const daysOrdered = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let currentStreak = 0;
  let maxConsecutiveStreak = 0;
  let running = 0;
  for (const d of daysOrdered) {
    if (streakDays[d]) {
      running += 1;
      if (running > maxConsecutiveStreak) {
        maxConsecutiveStreak = running;
      }
    } else {
      running = 0;
    }
  }
  currentStreak = maxConsecutiveStreak;
  const hasConsistencyBadge = currentStreak >= 5;

  // Progress metrics calculation safely using the state-based targets (defaulting to 0 unless set manually or from profile)
  const calProgressPercent = targetDailyCalories > 0 ? Math.min(Math.round((activeCalories / targetDailyCalories) * 100), 100) : 0;
  const proteinProgressPercent = targetDailyProtein > 0 ? Math.min(Math.round((activeProtein / targetDailyProtein) * 100), 100) : 0;
  const carbsProgressPercent = targetDailyCarbs > 0 ? Math.min(Math.round((activeCarbs / targetDailyCarbs) * 100), 100) : 0;
  const fatProgressPercent = targetDailyFat > 0 ? Math.min(Math.round((activeFat / targetDailyFat) * 100), 100) : 0;

  // Store comparison list simulation based on current shopping cost
  const lidlTotal = parseFloat((shoppingList.totalCost * 0.95).toFixed(2));
  const kauflandTotal = parseFloat((shoppingList.totalCost * 1.02).toFixed(2));
  const carrefourTotal = parseFloat((shoppingList.totalCost * 1.12).toFixed(2));



  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-slate-800">
      {/* Top Navigation */}
      <nav className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#4CAF50] rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-[#2E7D32]">
            NutriCart<span className="text-slate-400">AI</span>
          </span>
          <span className="hidden sm:inline text-xs font-semibold bg-green-50 text-green-700 px-2 py-0.5 rounded">
            Live {onboarding.country} Edition
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex gap-4 text-sm font-bold text-slate-500">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`pb-1 ${activeTab === 'dashboard' ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'hover:text-slate-800'}`}
            >
              {dict.dashboardTab}
            </button>
            <button 
              onClick={() => setActiveTab('chat')} 
              className={`pb-1 ${activeTab === 'chat' ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'hover:text-slate-800'}`}
            >
              {dict.chatTab}
            </button>
            <button 
              onClick={() => setActiveTab('planner')} 
              className={`pb-1 ${activeTab === 'planner' ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'hover:text-slate-800'}`}
            >
              {dict.plannerTab}
            </button>
            <button 
              onClick={() => setActiveTab('pantry')} 
              className={`pb-1 ${activeTab === 'pantry' ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'hover:text-slate-800'}`}
            >
              {dict.pantryTab}
            </button>
            <button 
              onClick={() => setActiveTab('cart')} 
              className={`pb-1 flex items-center gap-1 ${activeTab === 'cart' ? 'text-[#4CAF50] border-b-2 border-[#4CAF50]' : 'hover:text-slate-800'}`}
            >
              <span>{dict.cartTab || 'Cart'}</span>
              {cartItems.length > 0 && (
                <span className="bg-[#4CAF50] text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">

            <button 
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(!isDarkMode)}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="p-2 hover:bg-slate-100 rounded-xl text-[#4CAF50] hover:text-[#2E7D32] transition flex items-center justify-center"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="h-8 w-px bg-slate-200"></div>

            <button 
              id="settings-btn"
              onClick={() => setIsSettingsModalOpen(true)} 
              title="Change onboarding settings"
              className="p-2 hover:bg-slate-100 rounded-xl text-[#4CAF50] hover:text-[#2E7D32] transition flex items-center gap-1.5 font-black text-xs"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>
            <div className="h-8 w-px bg-slate-200"></div>

            <button 
              onClick={() => setOnboarding(null)} 
              title="Reset profile onboarding"
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition"
            >
              <User className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-slate-800">{onboarding.dietType}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{onboarding.budget} {onboarding.currency} Goal</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        
        {/* Tab Selection Row for Mobile */}
        <div className="flex md:hidden bg-white p-1 rounded-xl border border-slate-200 mb-4 overflow-x-auto gap-1">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'dashboard' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-slate-500'}`}
          >
            {dict.dashboardTab}
          </button>
          <button 
            onClick={() => setActiveTab('chat')} 
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'chat' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-slate-500'}`}
          >
            {dict.chatTab}
          </button>
          <button 
            onClick={() => setActiveTab('planner')} 
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'planner' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-slate-500'}`}
          >
            {dict.plannerTab}
          </button>
          <button 
            onClick={() => setActiveTab('pantry')} 
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'pantry' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-slate-500'}`}
          >
            {dict.pantryTab}
          </button>
          <button 
            onClick={() => setActiveTab('cart')} 
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${activeTab === 'cart' ? 'bg-[#4CAF50] text-white shadow-sm' : 'text-slate-500'}`}
          >
            {dict.cartTab || 'Cart'} {cartItems.length > 0 ? `(${cartItems.reduce((sum, item) => sum + item.quantity, 0)})` : ''}
          </button>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* AI Optimization Main Panel */}
            <div id="ai-active-optimizations" className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#4CAF50]" /> Active Optimized Shopping List
                    </h2>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                      OPTIMIZED TARGET: {targetDailyProtein * (onboarding?.planningFrequency === 'daily' ? 1 : onboarding?.planningFrequency === 'weekly' ? 7 : 30)}G PROTEIN, {onboarding?.budget} {onboarding?.currency} BUDGET
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={handleRefreshShoppingList}
                      disabled={isRefreshingShoppingList}
                      className="text-xs bg-green-50 hover:bg-green-100 disabled:bg-slate-100 text-[#2E7D32] disabled:text-slate-400 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed border border-green-200/50"
                      title="Regenerate shopping list from current meal plan & diet settings"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingShoppingList ? 'animate-spin' : ''}`} />
                      {isRefreshingShoppingList ? 'Refreshing...' : 'Refresh List'}
                    </button>
                    <button 
                      onClick={handleExportCSV}
                      className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" /> CSV Export
                    </button>
                    <span className="bg-[#4CAF50] text-white px-3 py-1 rounded-full text-xs font-bold">
                      HEALTHY COMPATIBLE
                    </span>
                  </div>
                </div>

                {/* Optimizations priority bar */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl mb-4 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider px-2">Optimize For:</span>
                  {[
                    { key: 'cheapest', label: 'Cheapest Price' },
                    { key: 'healthiest', label: 'Healthiest Score' },
                    { key: 'highest_protein', label: 'Max Protein' },
                    { key: 'fastest_cooking', label: 'Fastest Prep' }
                  ].map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => {
                        setPriority(opt.key as any);
                        // Trigger simple sorting simulation
                        if (opt.key === 'cheapest') {
                          setShoppingList(prev => ({
                            ...prev,
                            items: [...prev.items].sort((a,b) => a.product.price - b.product.price)
                          }));
                        } else if (opt.key === 'highest_protein') {
                          setShoppingList(prev => ({
                            ...prev,
                            items: [...prev.items].sort((a,b) => b.product.protein - a.product.protein)
                          }));
                        } else {
                          setShoppingList(prev => ({
                            ...prev,
                            items: [...prev.items].sort((a,b) => b.product.healthScore - a.product.healthScore)
                          }));
                        }
                      }}
                      className={`text-[11px] font-bold py-1 px-3 rounded-lg transition ${priority === opt.key ? 'bg-white text-[#2E7D32] shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Shopping items list table */}
                <div className="w-full overflow-x-auto border border-slate-100 rounded-3xl bg-white shadow-inner p-1">
                  <table className="w-full text-sm min-w-[850px] border-collapse">
                    <thead>
                      <tr className="text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider font-semibold">
                        <th className="text-left pb-3 pt-3 pl-4 font-semibold text-slate-500">Product Card</th>
                        <th className="text-left pb-3 pt-3 font-semibold text-slate-500">Supermarket</th>
                        <th className="text-center pb-3 pt-3 font-semibold text-slate-500">Consume Type</th>
                        <th className="text-center pb-3 pt-3 pr-4 font-semibold text-slate-500">Qty</th>
                        <th className="text-right pb-3 pt-3 font-semibold text-slate-500">Protein/100g</th>
                        <th className="text-right pb-3 pt-3 font-semibold text-slate-500">
                          <span className="inline-flex items-center gap-0.5 cursor-help" title="Crowdsourced online store estimates. Actual prices can differ slightly based on local supermarket promotions.">
                            Approx. Price <span className="text-amber-500 font-bold">*</span>
                          </span>
                        </th>
                        <th className="text-center pb-3 pt-3 font-semibold text-slate-500">Smart Swap</th>
                        <th className="pb-3 pt-3 pr-4"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {shoppingList.items.filter(item => {
                        const activeOnb = onboarding || tempOnboarding;
                        return !isAllergicOrDisliked(item.product, activeOnb?.foodAllergies || [], activeOnb?.foodsDislike || []);
                      }).map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/30 transition group">
                          <td className="py-4 pl-4 flex items-center gap-3 font-medium">
                            <span className="text-2xl" role="img" aria-label="product icon">{item.product.image || '🛒'}</span>
                            <div>
                              <p className="font-bold text-slate-800 leading-tight">{localizeProductName(item.product.name)}</p>
                              <p className="text-[10px] text-slate-400 font-bold mt-1">{localizeBrand(item.product.brand)} • {item.product.weight}</p>
                              <div className="flex flex-wrap gap-1.5 items-center mt-1">
                                <span className="text-[10px] text-[#2E7D32] font-black bg-green-50 text-green-700 px-1.5 py-0.5 rounded inline-block">
                                  {formatConvertedAmount(item, onboarding?.dietType || 'Normal')}
                                </span>
                                <button
                                  onClick={() => {
                                    const rawName = item.product.name;
                                    const firstWord = rawName.split(' ')[0].replace(/[^a-zA-ZăâîșțĂÂÎȘȚ]/g, '');
                                    setSearchQuery(firstWord);
                                    setCatalogLimit(12);
                                    document.getElementById('catalog-browser')?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 font-bold px-1.5 py-0.5 rounded transition inline-flex items-center gap-1 cursor-pointer"
                                  title="Search similar popular products in database"
                                >
                                  <Search className="w-2.5 h-2.5" /> Search DB
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-slate-500 font-semibold">{localizeStore(item.product.store)}</td>
                          <td className="py-4 text-center">
                            <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-2xl shadow-sm border border-slate-200/50">
                              <button
                                onClick={() => handleToggleConsumeType(item.product.id, 'daily')}
                                className={`text-[10px] px-3 py-1 rounded-xl font-black uppercase tracking-wide transition-all ${
                                  (item.consumeType || 'daily') === 'daily'
                                    ? 'bg-[#4CAF50] text-white shadow-md shadow-green-100'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                                title="Set item consume to daily (divides quantity by 7)"
                              >
                                Daily
                              </button>
                              <button
                                onClick={() => handleToggleConsumeType(item.product.id, 'weekly')}
                                className={`text-[10px] px-3 py-1 rounded-xl font-black uppercase tracking-wide transition-all ${
                                  (item.consumeType || 'daily') === 'weekly'
                                    ? 'bg-[#4CAF50] text-white shadow-md shadow-green-100'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                }`}
                                title="Set item consume to weekly (multiplies quantity by 7)"
                              >
                                Weekly
                              </button>
                            </div>
                          </td>
                          <td className="py-4 text-center pr-4">
                            <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 rounded-xl px-2 py-1 shadow-sm">
                              <button
                                onClick={() => handleUpdateItemQuantity(item.product.id, item.quantity - 1)}
                                className="w-5 h-5 flex items-center justify-center rounded-md bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-black transition active:scale-95"
                                title="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="font-mono font-bold text-slate-700 min-w-[22px] text-center text-xs">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateItemQuantity(item.product.id, item.quantity + 1)}
                                className="w-5 h-5 flex items-center justify-center rounded-md bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-black transition active:scale-95"
                                title="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-4 text-right font-mono font-semibold text-slate-700">{item.product.protein}g</td>
                          <td className="py-4 text-right font-bold text-[#2E7D32]">
                            <span className="inline-flex items-center gap-0.5 cursor-help" title="Indicative estimated store price. Actual shelf price may vary.">
                              ~ {formatPrice(item.totalCost)}
                              <span className="text-slate-400 text-[10px] font-semibold">*</span>
                            </span>
                          </td>
                          <td className="py-4 text-center">
                            {item.product.alternatives.length > 0 ? (
                              <button
                                onClick={() => handleSwapItem(item.product.id, item.product)}
                                className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200/50 px-2.5 py-1 rounded-lg font-black uppercase tracking-wider hover:bg-amber-100 transition shadow-sm"
                              >
                                Swap: {localizeProductName(item.product.alternatives[0])}
                              </button>
                            ) : (
                              <span className="text-xs text-slate-300 font-bold">Optimal</span>
                            )}
                          </td>
                          <td className="py-4 text-right pr-4 flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => {
                                handleAddIndividualToCart(item.product, item.quantity);
                                alert(onboarding?.country === 'Romania' 
                                  ? `Am adăugat ${localizeProductName(item.product.name)} în coș!`
                                  : `Added ${localizeProductName(item.product.name)} to your Cart!`);
                              }}
                              className="text-[#4CAF50] hover:text-green-700 p-1.5 rounded-xl hover:bg-green-50/50 transition"
                              title="Add to Cart"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="text-slate-300 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50/50 transition"
                              title="Delete item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Price accuracy alert banner */}
                <div className="mt-4 flex items-start gap-2.5 bg-amber-50/60 border border-amber-100 p-3.5 rounded-2xl text-xs text-amber-800 font-medium leading-relaxed shadow-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-900 mb-0.5 text-[11px] uppercase tracking-wide">⚠️ Price Accuracy Notice</span>
                    Store prices listed here are averages collected from local supermarket indexes. Shelf prices might differ slightly based on your specific branch location, active regional catalogs, and ongoing in-store clearance promotions.
                  </div>
                </div>

              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase">Total Items count</span>
                    <span className="text-xl font-black text-slate-800">{shoppingList.items.reduce((acc, i) => acc + i.quantity, 0)} Items</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase">Active Planning</span>
                    <span className="text-xl font-black text-slate-800 capitalize">{onboarding.planningFrequency} Optimizer</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleAddToCartAndSync}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-slate-200 hover:bg-slate-800 transition flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Add to Cart &amp; Sync
                  </button>
                </div>
              </div>
            </div>

            {/* Nutrition Target Summary */}
            <div id="nutrition-target-tracker" className="lg:col-span-4 bg-[#2E7D32] text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-black tracking-tight opacity-95">Nutrient Targets (Daily)</h3>
                  <Flame className="w-5 h-5 text-[#FFC107]" />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold uppercase tracking-wide flex items-center gap-1 flex-wrap">
                        <span>Calories:</span>
                        <span className="font-mono">{activeCalories}</span>
                        <span>/</span>
                        <input
                          type="number"
                          value={targetDailyCalories}
                          onChange={(e) => setTargetDailyCalories(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-16 bg-white/20 border border-white/10 rounded px-1 text-center font-bold font-mono focus:bg-white focus:text-slate-900 focus:outline-none"
                          title="Click to edit calories target"
                        />
                        <span>kcal</span>
                      </span>
                      <span className="opacity-80 font-mono">{calProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#FFC107] h-full rounded-full transition-all duration-500" style={{ width: `${calProgressPercent}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold uppercase tracking-wide flex items-center gap-1 flex-wrap">
                        <span>Protein:</span>
                        <span className="font-mono">{activeProtein}g</span>
                        <span>/</span>
                        <input
                          type="number"
                          value={targetDailyProtein}
                          onChange={(e) => setTargetDailyProtein(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-14 bg-white/20 border border-white/10 rounded px-1 text-center font-bold font-mono focus:bg-white focus:text-slate-900 focus:outline-none"
                          title="Click to edit protein target"
                        />
                        <span>g</span>
                      </span>
                      <span className="opacity-80 font-mono">{proteinProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-white h-full rounded-full transition-all duration-500" style={{ width: `${proteinProgressPercent}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold uppercase tracking-wide flex items-center gap-1 flex-wrap">
                        <span>Carbs:</span>
                        <span className="font-mono">{activeCarbs}g</span>
                        <span>/</span>
                        <input
                          type="number"
                          value={targetDailyCarbs}
                          onChange={(e) => setTargetDailyCarbs(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-14 bg-white/20 border border-white/10 rounded px-1 text-center font-bold font-mono focus:bg-white focus:text-slate-900 focus:outline-none"
                          title="Click to edit carbs target"
                        />
                        <span>g</span>
                      </span>
                      <span className="opacity-80 font-mono">{carbsProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-white/60 h-full rounded-full transition-all duration-500" style={{ width: `${carbsProgressPercent}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span className="font-bold uppercase tracking-wide flex items-center gap-1 flex-wrap">
                        <span>Fats:</span>
                        <span className="font-mono">{activeFat}g</span>
                        <span>/</span>
                        <input
                          type="number"
                          value={targetDailyFat}
                          onChange={(e) => setTargetDailyFat(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-14 bg-white/20 border border-white/10 rounded px-1 text-center font-bold font-mono focus:bg-white focus:text-slate-900 focus:outline-none"
                          title="Click to edit fats target"
                        />
                        <span>g</span>
                      </span>
                      <span className="opacity-80 font-mono">{fatProgressPercent}%</span>
                    </div>
                    <div className="w-full bg-green-900/30 h-2 rounded-full overflow-hidden">
                      <div className="bg-white/30 h-full rounded-full transition-all duration-500" style={{ width: `${fatProgressPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-green-800/40 text-xs flex justify-between items-center opacity-90">
                <button
                  onClick={handleRecalculateFromProfile}
                  className="bg-white/20 hover:bg-white/30 text-white font-bold px-2.5 py-1.5 rounded-xl transition-all border border-white/10 flex items-center gap-1 text-[10px] uppercase tracking-wider"
                  title="Auto-fill targets using Mifflin-St Jeor formula"
                >
                  <RefreshCw className="w-3 h-3" /> Set from Profile
                </button>
                <div className="flex flex-col items-end gap-1 font-bold">
                  <span className="bg-green-900/40 px-2 py-0.5 rounded text-[10px]">Diet: {onboarding.dietType || 'Normal'}</span>
                  <span className="bg-green-900/40 px-2 py-0.5 rounded text-[9px] opacity-85">Goal: {onboarding.goal.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full pointer-events-none"></div>
            </div>

            {/* AI Food Intake Logger */}
            <div id="ai-food-logger" className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600 animate-pulse" /> AI Food Logger
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Tell the AI what you ate today</p>
                  </div>
                  {loggedFoods.length > 0 && (
                    <button 
                      onClick={handleResetLoggedFoods}
                      className="text-[10px] text-red-500 hover:text-red-700 font-black uppercase tracking-wider bg-red-50 px-2 py-1 rounded-lg"
                    >
                      Clear Log
                    </button>
                  )}
                </div>

                <form onSubmit={handleLogFoodIntake} className="space-y-3">
                  <div className="relative">
                    <textarea
                      value={foodInput}
                      onChange={(e) => setFoodInput(e.target.value)}
                      placeholder="e.g., I had 2 scrambled eggs, a banana, and 100g of oats for breakfast"
                      disabled={isLoggingFood}
                      rows={3}
                      className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-2xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 disabled:opacity-50 transition resize-none font-medium placeholder:text-slate-400"
                    />
                  </div>

                  {logFoodError && (
                    <div className="text-[11px] text-red-600 font-bold bg-red-50 p-2.5 rounded-xl border border-red-100">
                      {logFoodError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoggingFood || !foodInput.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-xl shadow-md disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {isLoggingFood ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        AI is calculating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> Log what I ate
                      </>
                    )}
                  </button>
                </form>

                {/* Logged foods feed */}
                <div className="mt-5 space-y-2.5">
                  <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Logged Food Intake Feed</span>
                  {loggedFoods.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                      <p className="text-xs text-slate-400 font-medium">No meals logged today yet.</p>
                      <p className="text-[10px] text-slate-300 mt-1 font-bold">Try typing a breakfast or snack above!</p>
                    </div>
                  ) : (
                    <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                      {loggedFoods.map((f) => (
                        <div key={f.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center hover:border-slate-200 transition group">
                          <div className="min-w-0 flex-1">
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-xs font-black text-slate-800 line-clamp-1">{f.foodName}</span>
                              <span className="text-[9px] text-slate-400 font-bold shrink-0">{f.timestamp}</span>
                            </div>
                            <div className="flex flex-wrap gap-x-2.5 gap-y-0.5 mt-1.5 text-[10px] font-bold text-slate-500">
                              <span className="text-purple-600 font-black shrink-0">{f.calories} kcal</span>
                              <span className="shrink-0">P: {f.protein}g</span>
                              <span className="shrink-0">C: {f.carbs}g</span>
                              <span className="shrink-0">F: {f.fat}g</span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleClearLoggedFood(f.id)}
                            className="text-slate-300 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50/50 transition opacity-0 group-hover:opacity-100 ml-2"
                            title="Remove meal entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Weekly Planning Streak & Consistency Badge Card */}
            <div id="weekly-streak-adherence" className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-orange-500 animate-pulse" /> Weekly Planning Streak
                    </h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Daily Budget Adherence Log</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 font-black text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                    ⚡ {currentStreak} Days
                  </span>
                </div>

                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Log the days you successfully stayed within your grocery budget. Reaching a <strong className="text-slate-700 font-bold">5-day streak</strong> unlocks your gold Consistency Badge!
                </p>

                {/* Days of the Week checklist */}
                <div className="grid grid-cols-7 gap-1 bg-slate-50 p-2 rounded-2xl mb-5 border border-slate-100/50">
                  {daysOrdered.map(day => {
                    const checked = streakDays[day];
                    return (
                      <button
                        key={day}
                        onClick={() => {
                          setStreakDays(prev => ({
                            ...prev,
                            [day]: !prev[day]
                          }));
                        }}
                        className={`flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all ${
                          checked
                            ? 'bg-gradient-to-br from-green-50 to-green-100/40 border-[#4CAF50] text-[#2E7D32] shadow-sm font-black'
                            : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600 font-bold'
                        }`}
                        title={`Click to toggle budget adherence for ${day}`}
                      >
                        <span className="text-[10px] uppercase leading-none mb-1.5">{day}</span>
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all ${
                          checked
                            ? 'border-[#4CAF50] bg-[#4CAF50] text-white'
                            : 'border-slate-200 bg-transparent'
                        }`}>
                          {checked && (
                            <svg className="w-2.5 h-2.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Consistency Badge Display */}
                <div className={`p-4 rounded-2xl border transition-all duration-300 ${
                  hasConsistencyBadge
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50/50 border-amber-300/60 shadow-md shadow-amber-100/20'
                    : 'bg-slate-50/50 border-slate-100'
                }`}>
                  {hasConsistencyBadge ? (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md shadow-amber-200 ring-4 ring-amber-100 shrink-0 animate-bounce">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-amber-900 flex items-center gap-1.5 uppercase tracking-wide">
                          Consistency Badge Earned! 🏆
                        </h4>
                        <p className="text-[11px] text-amber-700/95 leading-relaxed mt-1">
                          Incredible discipline! You reached a 5+ day streak logging budget adherence. Your custom AI meal plan now prioritizes maximum waste reduction and leftover re-usage.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3 opacity-75">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                          Consistency Badge Locked
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                          Log at least <strong>5 days</strong> of staying within budget to unlock your gold badge and claim consistency rewards!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Health Score Gauge */}
            <div id="health-score-gauge" className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center p-6 text-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                  <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="301.6" strokeDashoffset={301.6 - (301.6 * shoppingList.avgHealthScore) / 100} className="text-[#4CAF50] transition-all duration-500" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-800">{shoppingList.avgHealthScore}</span>
                  <span className="text-[10px] font-bold text-slate-400">SCORE</span>
                </div>
              </div>
              <span className="mt-4 text-[10px] font-black uppercase text-slate-400 tracking-wider">NutriCart Health Score</span>
              <span className="text-sm font-bold text-green-600 mt-1">Grade A- Excellent</span>
              <p className="text-[10px] text-slate-400 mt-2 px-4 leading-tight">Low artificial additives and processing levels detected.</p>
            </div>

            {/* Budget Status & Efficiency */}
            <div id="budget-efficiency" className="lg:col-span-3 bg-[#FFC107] rounded-3xl p-6 flex flex-col justify-between min-h-[260px]">
              {(() => {
                const localSaved = onboarding.budget - manualSpentAmount;
                return (
                  <>
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-xs font-black uppercase text-amber-900/60 tracking-wider">Spent Tracker</h3>
                        <Wallet className="w-4 h-4 text-amber-900/60" />
                      </div>
                      <p className="text-3.5xl font-black text-amber-900 leading-none mt-2">
                        {formatPriceLocal(manualSpentAmount)}
                      </p>
                      <p className="text-[10px] text-amber-900/60 font-black mt-1 uppercase">Spent out of {formatPriceLocal(onboarding.budget)}</p>

                      {/* Add spent money input */}
                      <div className="mt-4 bg-white/20 p-2.5 rounded-2xl border border-white/10">
                        <span className="text-[10px] text-amber-950 font-black uppercase tracking-wider block mb-1">Add Spend / Purchase</span>
                        <div className="flex gap-1 border-b border-white/10 pb-2 mb-2">
                          <input
                            type="number"
                            placeholder="Amount..."
                            id="add-spent-input"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const val = parseFloat((e.target as HTMLInputElement).value) || 0;
                                setManualSpentAmount(prev => Math.max(0, prev + val));
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                            className="flex-1 w-full bg-white/50 border border-white/30 rounded-xl px-2 py-1 text-xs font-bold text-amber-950 placeholder-amber-900/40 focus:bg-white focus:outline-none"
                            title="Press Enter to add spent money"
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById('add-spent-input') as HTMLInputElement;
                              if (input) {
                                const val = parseFloat(input.value) || 0;
                                setManualSpentAmount(prev => Math.max(0, prev + val));
                                input.value = '';
                              }
                            }}
                            className="bg-amber-900 text-white px-2 py-1 rounded-xl text-[10px] font-black uppercase hover:bg-amber-850 transition shrink-0"
                          >
                            + Add
                          </button>
                          <button
                            onClick={() => setManualSpentAmount(0)}
                            className="bg-red-700/20 hover:bg-red-700/30 text-red-950 px-2 py-1 rounded-xl text-[10px] font-black uppercase transition shrink-0"
                            title="Reset spent to 0"
                          >
                            Reset
                          </button>
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto pb-1">
                          {[10, 50, 100].map(amt => (
                            <button
                              key={amt}
                              onClick={() => setManualSpentAmount(prev => prev + amt)}
                              className="bg-white/30 hover:bg-white/40 text-amber-950 font-bold px-2 py-1 rounded-lg text-[9px] uppercase transition-all whitespace-nowrap"
                            >
                              +{amt} {countryConfig.currency}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Choose Weekly Amount Component */}
                      <div className="mt-3 bg-white/20 p-2.5 rounded-2xl border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-amber-950 font-black uppercase tracking-wider block">Adjust Weekly Limit</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-xl border border-white/30 shadow-sm">
                          <input
                            type="number"
                            value={onboarding.budget}
                            onChange={e => {
                              const newBudget = parseInt(e.target.value) || 0;
                              setOnboarding(prev => prev ? { ...prev, budget: newBudget } : null);
                            }}
                            className="w-14 bg-transparent text-xs font-black text-amber-950 focus:outline-none text-center"
                            title="Adjust weekly budget"
                          />
                          <span className="text-[10px] font-black text-amber-950">{countryConfig.currency}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/40 rounded-2xl p-3 border border-white/20 mt-3">
                      <p className="text-[10px] font-bold text-amber-900">REMAINING WEEKLY BUDGET</p>
                      <p className="text-xl font-black text-amber-900">
                        {formatPriceLocal(localSaved)}
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Micro Stats Row: Cost per Protein */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#4CAF50]">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cost per Protein Gram</p>
                <p className="text-lg font-black text-slate-800">
                  {formatPrice(shoppingList.totalCost / (shoppingList.totalProtein || 1))} / g
                </p>
                <span className="text-[10px] text-green-600 font-bold">Cheapest in {onboarding.country}</span>
              </div>
            </div>

            {/* Micro Stats Row: Fiber Content */}
            <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-200 p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-[#FFC107]">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Fiber Content</p>
                <p className="text-lg font-black text-slate-800">{shoppingList.totalFiber}g / total</p>
                <span className="text-[10px] text-amber-600 font-bold">120% daily gut health</span>
              </div>
            </div>

            {/* Price Comparison Index between stores */}
            <div id="price-comparison-index" className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider">Price Comparison Index</h4>
                  <Store className="w-4 h-4 text-slate-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-xs font-mono text-slate-400 uppercase">{localizeStore('Lidl')}</div>
                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-[#4CAF50]" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-xs font-bold font-mono">{formatPrice(lidlTotal)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-xs font-mono text-slate-400 uppercase">{localizeStore('Kaufland')}</div>
                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-600" style={{ width: '75%' }}></div>
                    </div>
                    <span className="text-xs font-bold font-mono">{formatPrice(kauflandTotal)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 text-xs font-mono text-slate-400 uppercase">{localizeStore('Carrefour')}</div>
                    <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-slate-600" style={{ width: '90%' }}></div>
                    </div>
                    <span className="text-xs font-bold font-mono">{formatPrice(carrefourTotal)}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-black">AI Smart Strategy:</p>
                <p className="text-xs italic leading-tight text-slate-300 mt-1">
                  "Split buying: basic carbs from Lidl, meat and dairy from Kaufland for maximum 14% additional savings."
                </p>
              </div>
            </div>

            {/* Quick AI Action Banner */}
            <div className="lg:col-span-8 bg-white rounded-3xl border-2 border-[#4CAF50] p-6 flex flex-col md:flex-row items-center gap-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-[#4CAF50] shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-bold text-slate-800 text-sm">Ask your personal AI shopper optimizer</h3>
                <p className="text-xs text-slate-400 mt-0.5">Let the AI instantly find the cheapest product match or customized meal plan.</p>
                <div className="flex flex-wrap gap-2 mt-2 justify-center md:justify-start">
                  <button 
                    onClick={() => handleQuickOptimize(`I have ${formatPrice(250)}, get me 140g protein and 2000 calories for 5 days`)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 font-bold py-1 px-2.5 rounded-lg text-slate-600 transition"
                  >
                    "{formatPrice(250)}, 140g protein"
                  </button>
                  <button 
                    onClick={() => handleQuickOptimize(`Create a low budget vegan muscle plan under ${formatPrice(150)}`)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 font-bold py-1 px-2.5 rounded-lg text-slate-600 transition"
                  >
                    "Low budget vegan"
                  </button>
                  <button 
                    onClick={() => handleQuickOptimize(`Find healthy muscle snacks under ${formatPrice(10)} in ${localizeStore('Kaufland')}`)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 font-bold py-1 px-2.5 rounded-lg text-slate-600 transition"
                  >
                    "Snacks under {formatPrice(10)}"
                  </button>
                </div>
              </div>
              <button 
                onClick={() => setActiveTab('chat')}
                className="bg-[#4CAF50] text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-green-100 hover:bg-[#2E7D32] transition w-full md:w-auto text-center"
              >
                Launch AI Chat
              </button>
            </div>

            {/* Clinical Diet Recommendation Card */}
            <div id="clinical-diet-recommendation" className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between min-h-[380px] shadow-sm">
              <div>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#4CAF50]" />
                    Dietary Science
                  </h3>
                  <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-black">
                    <button
                      onClick={() => setRecommendationCardTab('rec')}
                      className={`px-2 py-1 rounded-md transition ${recommendationCardTab === 'rec' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      AI Match
                    </button>
                    <button
                      onClick={() => {
                        setRecommendationCardTab('research');
                        const activeOnb = onboarding || tempOnboarding;
                        if (activeOnb?.dietType) {
                          setViewDietResearchKey(activeOnb.dietType);
                        }
                      }}
                      className={`px-2 py-1 rounded-md transition ${recommendationCardTab === 'research' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      Research
                    </button>
                  </div>
                </div>

                {recommendationCardTab === 'rec' ? (
                  (() => {
                    const activeOnb = onboarding || tempOnboarding;
                    const rec = getRecommendedDiet(activeOnb.age, activeOnb.weight, activeOnb.height);
                    const isActive = activeOnb.dietType === rec.diet;
                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center bg-[#4CAF50]/5 border border-[#4CAF50]/10 p-3 rounded-2xl">
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none mb-1">Recommended Structure</span>
                            <span className="text-sm font-black text-[#2E7D32]">{rec.diet} Diet</span>
                          </div>
                          {isActive ? (
                            <span className="bg-[#4CAF50] text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 shrink-0">
                              ★ Active
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                setOnboarding(prev => prev ? { ...prev, dietType: rec.diet as any } : null);
                                setShoppingList(prev => recalculateShoppingListMetrics(prev.items, { ...activeOnb, dietType: rec.diet as any }));
                              }}
                              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-xl transition active:scale-95 shrink-0 shadow-sm"
                            >
                              Apply Diet
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                          {rec.reason}
                        </p>
                      </div>
                    );
                  })()
                ) : (
                  (() => {
                    const profile = DIET_RESEARCH_DATABASE[viewDietResearchKey] || DIET_RESEARCH_DATABASE['Normal'];
                    return (
                      <div className="space-y-3.5 text-slate-700">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase text-slate-400">Diet to Research:</span>
                          <select
                            value={viewDietResearchKey}
                            onChange={(e) => setViewDietResearchKey(e.target.value)}
                            className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl px-2 py-1 focus:outline-none focus:ring-1 focus:ring-green-500 text-slate-700"
                          >
                            {Object.keys(DIET_RESEARCH_DATABASE).map(k => (
                              <option key={k} value={k}>{k}</option>
                            ))}
                          </select>
                        </div>

                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-2xl">
                          <h4 className="text-xs font-black text-slate-800">{profile.title}</h4>
                          <p className="text-[9px] text-slate-400 font-medium italic mt-0.5 leading-tight">
                            Study: {profile.clinicalStudyCitation}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-relaxed mt-2 font-medium">
                            {profile.clinicalExplanation}
                          </p>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          <div className="bg-emerald-50/40 p-2.5 rounded-xl border border-emerald-100/50">
                            <strong className="text-emerald-800 font-black block text-[10px] uppercase">Protein Guidance</strong>
                            <p className="text-slate-600 font-medium mt-0.5 leading-relaxed">{profile.targetProteinAnalysis}</p>
                          </div>
                          <div className="bg-blue-50/40 p-2.5 rounded-xl border border-blue-100/50">
                            <strong className="text-blue-800 font-black block text-[10px] uppercase">Carbohydrate Guidance</strong>
                            <p className="text-slate-600 font-medium mt-0.5 leading-relaxed">{profile.targetCarbAnalysis}</p>
                          </div>
                          <div className="bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/50">
                            <strong className="text-amber-800 font-black block text-[10px] uppercase">Fat Guidance</strong>
                            <p className="text-slate-600 font-medium mt-0.5 leading-relaxed">{profile.targetFatAnalysis}</p>
                          </div>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[10.5px] text-amber-900 font-semibold leading-relaxed">
                          {profile.primaryWarning}
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
              <div className="border-t border-slate-100 mt-4 pt-4 flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                <Info className="w-3.5 h-3.5 text-slate-400" />
                Medical Research Database Match
              </div>
            </div>

            {/* Budget Smart suggestions */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6">
              <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">AI Budget Hacks &amp; Deals</h3>
              <div className="space-y-3">
                {budgetSuggestions.map((sug, i) => (
                  <div key={i} className="flex gap-2.5 items-start">
                    <span className="w-5 h-5 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 shrink-0 mt-0.5 font-bold text-xs">!</span>
                    <p className="text-xs text-slate-600 font-semibold">{sug}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Water logger & Gamification Achievements */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 flex flex-col justify-between min-h-[220px]">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">Water Intake tracker</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-black text-slate-800">{waterAmount} ml</span>
                  <span className="text-xs text-[#4CAF50] font-bold">Goal: 2500ml</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-4">
                  <div className="bg-[#4CAF50] h-full transition-all" style={{ width: `${Math.min((waterAmount/2500)*100, 100)}%` }}></div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setWaterAmount(prev => prev + 250)}
                    className="flex-1 bg-green-50 text-[#2E7D32] font-bold py-1.5 px-3 rounded-xl text-xs hover:bg-green-100 transition"
                  >
                    +250ml Glass
                  </button>
                  <button 
                    onClick={() => setWaterAmount(prev => prev + 500)}
                    className="flex-1 bg-green-50 text-[#2E7D32] font-bold py-1.5 px-3 rounded-xl text-xs hover:bg-green-100 transition"
                  >
                    +500ml Bottle
                  </button>
                </div>
              </div>
              <div className="border-t border-slate-100 mt-4 pt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 shrink-0">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Perfect Streak Locked!</p>
                  <p className="text-[10px] text-slate-400 font-semibold">Keep drinking and hit your target budget goal.</p>
                </div>
              </div>
            </div>

            {/* Catalog Browser Search Section */}
            <div id="catalog-browser" className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-800">Browse {activeCountry} Product Database</h3>
                  <p className="text-xs text-slate-400">Search fresh meats, dairy, complex carbs and supplements from {countryConfig.stores.slice(0, 3).join(', ')}, etc.</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="Search e.g. chicken, egg, oats..."
                    value={searchQuery}
                    onChange={e => {
                      setSearchQuery(e.target.value);
                      setCatalogLimit(6); // reset limit on manual type
                    }}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:ring-2 focus:ring-[#4CAF50]"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Popular Products Quick-Search Tags */}
              <div className="flex flex-wrap gap-1.5 mb-5 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block w-full mb-1 pl-1">Popular Quick-Search Products:</span>
                {[
                  { name: 'Chicken Breast 🍗', query: 'chicken' },
                  { name: 'Eggs 🥚', query: 'egg' },
                  { name: 'Greek Yogurt 🥛', query: 'yogurt' },
                  { name: 'Salmon Fillet 🐟', query: 'salmon' },
                  { name: 'Oatmeal 🥣', query: 'oats' },
                  { name: 'Basmati Rice 🌾', query: 'rice' },
                  { name: 'Tofu 🧊', query: 'tofu' },
                  { name: 'Frozen Veggies 🥦', query: 'veggies' },
                  { name: 'Bananas 🍌', query: 'banana' },
                  { name: 'Peanut Butter 🥜', query: 'butter' },
                  { name: 'Beef Steak 🥩', query: 'beef' },
                  { name: 'Protein Powder 🍼', query: 'protein' },
                  { name: 'Sweet Potatoes 🍠', query: 'potato' },
                  { name: 'Almond Milk 🥛', query: 'milk' },
                  { name: 'Canned Tuna 🐟', query: 'tuna' },
                  { name: 'Fresh Broccoli 🥦', query: 'broccoli' },
                  { name: 'Spinach 🍃', query: 'spinach' },
                  { name: 'Avocados 🥑', query: 'avocado' },
                  { name: 'Whole Bread 🍞', query: 'bread' },
                  { name: 'Cottage Cheese 🧀', query: 'cheese' }
                ].map(item => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setSearchQuery(item.query);
                      setCatalogLimit(12);
                    }}
                    className={`text-[10px] font-black px-2.5 py-1 rounded-xl transition cursor-pointer border ${
                      searchQuery.toLowerCase() === item.query.toLowerCase()
                        ? 'bg-[#2E7D32] text-white border-[#2E7D32] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200/60 hover:border-slate-400 hover:text-slate-800'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {(() => {
                const filtered = searchProducts(searchQuery || 'chicken')
                  .filter(p => {
                    const activeOnb = onboarding || tempOnboarding;
                    return !isAllergicOrDisliked(p, activeOnb?.foodAllergies || [], activeOnb?.foodsDislike || []);
                  });
                const displayed = filtered.slice(0, catalogLimit);
                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {displayed.map(p => (
                        <div key={p.id} className="border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-300 transition bg-slate-50/50">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <span className="text-2xl">{p.image}</span>
                              <span className="text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                {localizeStore(p.store)}
                              </span>
                            </div>
                            <h4 className="text-xs font-black text-slate-800 line-clamp-1">{localizeProductName(p.name)}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">{localizeBrand(p.brand)} • {p.weight}</p>
                            
                            <div className="grid grid-cols-3 gap-1 my-2 bg-white p-1.5 rounded-lg text-center text-[10px] font-bold border border-slate-100">
                              <div>
                                <p className="text-slate-400">P</p>
                                <p className="text-slate-700">{p.protein}g</p>
                              </div>
                              <div>
                                <p className="text-slate-400">C</p>
                                <p className="text-slate-700">{p.carbs}g</p>
                              </div>
                              <div>
                                <p className="text-slate-400">F</p>
                                <p className="text-slate-700">{p.fat}g</p>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                            <span className="text-sm font-black text-[#2E7D32] inline-flex items-center gap-0.5 cursor-help" title="Indicative web price. Actual shelf prices in supermarket branches may vary.">
                              {formatPrice(p.price)}
                              <span className="text-slate-400 text-[10px] font-semibold">*</span>
                            </span>
                            <button 
                              onClick={() => handleAddProductToList(p)}
                              className="text-[10px] bg-[#4CAF50] text-white hover:bg-[#2E7D32] font-black uppercase tracking-wider py-1 px-3 rounded-xl transition shadow-sm cursor-pointer"
                            >
                              + Add List
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    {filtered.length > catalogLimit && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => setCatalogLimit(prev => prev + 12)}
                          className="text-xs bg-[#4CAF50]/10 hover:bg-[#4CAF50]/20 text-[#2E7D32] font-black uppercase tracking-wider py-2 px-6 rounded-2xl transition cursor-pointer flex items-center gap-2 shadow-sm"
                        >
                          Show More Products ({filtered.length - catalogLimit} more)
                        </button>
                      </div>
                    )}

                    {/* Catalog disclaimer */}
                    <div className="mt-6 flex justify-center">
                      <p className="text-[10px] text-slate-400 font-semibold text-center italic">
                        * Store prices are indexed periodically. 100% real-time in-store accuracy is not guaranteed.
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>

          </div>
        )}

        {/* AI Coach Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            {/* Left sidebar info */}
            <div className="lg:col-span-4 bg-slate-50 p-6 border-r border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#4CAF50] rounded-xl flex items-center justify-center text-white shadow-md">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">NutriCart AI Engine</h3>
                    <p className="text-xs text-slate-400 font-semibold">Gemini 3.5 Real-time Optimizer</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-[#2E7D32] uppercase mb-1">How it works</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Enter what budget and protein target you need. The AI calculates exact mathematical constraints using product prices from {countryConfig.stores.slice(0, 3).join(', ')}, producing the cheapest grocery list possible!
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Example prompts:</p>
                    <ul className="space-y-2">
                      {[
                        `I have ${formatPrice(350)} and need 180g protein for 7 days`,
                        `Show me cheap high protein snacks under ${formatPrice(5)}`,
                        "Optimize my list to be vegetarian",
                        `Help me cut down sodium and sugar on a ${formatPrice(200)} budget`
                      ].map((promptText, i) => (
                        <li key={i}>
                          <button
                            onClick={() => sendChatMessage(promptText)}
                            className="text-left text-[11px] text-[#4CAF50] hover:text-[#2E7D32] font-semibold flex items-center gap-1 transition"
                          >
                            <ChevronRight className="w-3 h-3 shrink-0" /> "{promptText}"
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-500 font-bold">API Status: Connected &amp; Ready</span>
              </div>
            </div>

            {/* Chat Box */}
            <div className="lg:col-span-8 flex flex-col h-[600px] justify-between">
              {/* Message History */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-[#2E7D32] text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'}`}>
                      <p className="text-xs font-bold mb-1 opacity-70">
                        {msg.sender === 'user' ? 'You' : 'NutriCart Assistant'} • {msg.timestamp}
                      </p>
                      <p className="text-xs font-medium leading-relaxed whitespace-pre-line">{msg.text}</p>
                      
                      {/* Interactive Shopping List attachment from AI */}
                      {msg.shoppingList && (
                        <div className="mt-4 bg-white text-slate-800 p-4 rounded-xl border border-slate-200 shadow-sm text-xs">
                          <p className="font-bold text-[#2E7D32] mb-2 flex items-center gap-1.5">
                            <ShoppingCart className="w-4 h-4" /> AI Generated Smart Shopping List
                          </p>
                          <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                            {msg.shoppingList.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-[11px] border-b border-slate-50 pb-1">
                                <span className="font-semibold text-slate-700">{localizeProductName(item.product.name)} ({item.quantity}x)</span>
                                <span className="font-mono text-[#2E7D32]">{formatPrice(item.totalCost)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between font-bold">
                            <span>Total Estimated Cost</span>
                            <span className="text-slate-900">{formatPrice(msg.shoppingList.totalCost)}</span>
                          </div>
                          <button
                            onClick={() => {
                              if (msg.shoppingList) {
                                setShoppingList(msg.shoppingList);
                                if (msg.mealPlan) setMealPlan(msg.mealPlan);
                                alert('Success! Synced the shopping list and meal recipes onto your dashboard.');
                              }
                            }}
                            className="mt-3 w-full bg-[#4CAF50] text-white hover:bg-[#2E7D32] text-[10px] font-black uppercase py-2 rounded-lg text-center transition"
                          >
                            Apply this optimized plan to my active dashboard
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {apiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-800 rounded-2xl p-4 rounded-tl-none flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#4CAF50]" />
                      <span className="text-xs font-bold text-slate-500">NutriCart AI is calculating cheaper options...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex gap-2">
                <input
                  type="text"
                  placeholder={`Ask NutriCart: 'I have ${formatPrice(200)}, generate muscle building grocery plan...'`}
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendChatMessage(); }}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#4CAF50]"
                />
                <button
                  onClick={() => sendChatMessage()}
                  disabled={apiLoading}
                  className="bg-[#2E7D32] hover:bg-[#1b4e20] text-white text-xs font-black uppercase px-6 py-3 rounded-xl transition shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meal Planner Tab */}
        {activeTab === 'planner' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-[#4CAF50]" /> AI Personal Meal Plan ({onboarding.planningFrequency})
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">High compatibility recipes custom-tailored to reach your target physique fast.</p>
                {mealScaleFactor !== 1 && (
                  <p className="text-[10px] text-green-700 font-bold bg-green-50 px-2.5 py-1 rounded-lg inline-block mt-2 border border-green-100">
                    💡 Portions and macros are scaled ({mealScaleFactor.toFixed(2)}x) so this exact day targets your calculated limit of <strong>{targetDailyCalories} kcal</strong>.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleRefreshMealPlan}
                  disabled={refreshingPlan}
                  className="text-xs font-black bg-gradient-to-r from-[#4CAF50] to-[#2E7D32] hover:opacity-90 text-white px-4 py-2 rounded-xl transition shadow-md shadow-green-100 flex items-center gap-1.5 disabled:opacity-50"
                  title="Refresh meal planner dynamically for a new day"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${refreshingPlan ? 'animate-spin' : ''}`} />
                  {refreshingPlan ? 'Refreshing...' : 'Refresh Planner Daily'}
                </button>
                <span className="text-xs font-bold bg-[#FFC107] text-amber-950 px-3 py-2 rounded-xl shadow-sm">
                  {targetDailyCalories > 0 ? targetDailyCalories : 0} kcal Target / Day
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'breakfast', title: '🍳 Breakfast Option', meal: scaledMealPlan.breakfast },
                { key: 'lunch', title: '🥩 Lunch Option', meal: scaledMealPlan.lunch },
                { key: 'dinner', title: '🥗 Dinner Option', meal: scaledMealPlan.dinner },
                { key: 'snacks', title: '🍓 Snacks & Fuel', meal: scaledMealPlan.snacks }
              ].map(item => (
                <div key={item.key} className="border border-slate-100 rounded-2xl p-5 hover:border-slate-300 transition bg-slate-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-sm font-black text-slate-800">{item.title}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold border px-2.5 py-0.5 rounded-lg transition ${
                        item.meal.difficulty === 'Hard'
                          ? 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/40'
                          : item.meal.difficulty === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/40'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/40'
                      }`}>
                        {item.meal.difficulty || 'Easy'}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded">
                        {item.meal.cookingTime} Prep
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xs font-bold text-slate-500 mb-1 italic">"{item.meal.name}"</h4>
                  <p className="text-xs text-slate-600 mb-3">{item.meal.recipe}</p>

                  <div className="bg-white p-3 rounded-xl border border-slate-100 mb-3">
                    <p className="text-[10px] font-black uppercase text-slate-400 mb-1.5">Preparation Steps:</p>
                    <ol className="list-decimal pl-4 text-xs text-slate-600 space-y-1 font-medium">
                      {item.meal.preparationSteps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {item.meal.shoppingIngredients.map((ing, idx) => (
                      <span key={idx} className="text-[10px] bg-green-50 text-[#2E7D32] border border-green-100 px-2 py-0.5 rounded-lg font-bold">
                        {ing}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100/60 text-center text-[10px] font-black">
                    <div className="bg-slate-100 p-1.5 rounded">
                      <p className="text-slate-400">Calories</p>
                      <p className="text-slate-800 font-mono">{item.meal.nutrition.calories} kcal</p>
                    </div>
                    <div className="bg-slate-100 p-1.5 rounded">
                      <p className="text-slate-400">Protein</p>
                      <p className="text-[#2E7D32] font-mono">{item.meal.nutrition.protein}g</p>
                    </div>
                    <div className="bg-slate-100 p-1.5 rounded">
                      <p className="text-slate-400">Carbs</p>
                      <p className="text-slate-800 font-mono">{item.meal.nutrition.carbs}g</p>
                    </div>
                    <div className="bg-slate-100 p-1.5 rounded">
                      <p className="text-slate-400">Fat</p>
                      <p className="text-slate-800 font-mono">{item.meal.nutrition.fat}g</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pantry Tab */}
        {activeTab === 'pantry' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#4CAF50]" /> {dict.pantryTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{dict.pantryDesc}</p>
              </div>
              <button
                onClick={() => {
                  setPantryItemName('');
                  setPantryItemQty('');
                  setPantryItemDays(10);
                  setIsPantryModalOpen(true);
                }}
                className="w-full sm:w-auto bg-[#2E7D32] hover:bg-[#1b4e20] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all shadow-md shadow-green-100 flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> {dict.addPantryBtn}
              </button>
            </div>

            {pantryItems.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                <p className="text-sm font-bold text-slate-400">No items in your pantry.</p>
                <p className="text-xs text-slate-400 mt-1">Add items you already own at home for smarter grocery planning.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pantryItems.map(item => (
                  <div key={item.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-extrabold text-slate-800 text-sm leading-tight">{item.name}</h3>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full whitespace-nowrap ${item.daysRemaining < 7 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                          {item.daysRemaining} {dict.daysLeft}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 font-semibold">{dict.stockQty}: <span className="text-slate-800 font-bold">{item.quantity}</span></p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">{dict.expires}: <span className="font-bold">{item.expirationDate}</span></p>
                    </div>
                    <div className="flex gap-2 pt-3 border-t border-slate-100/60 mt-4">
                      <button
                        onClick={() => {
                          setPantryItems(prev => prev.filter(i => i.id !== item.id));
                        }}
                        className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 py-1.5 rounded-lg flex-1 text-center font-bold transition"
                      >
                        {dict.usedRemove}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Smart Pantry Modal Dialog Overlay */}
            {isPantryModalOpen && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 relative">
                  <button 
                    onClick={() => setIsPantryModalOpen(false)}
                    className="absolute right-4 top-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-[#4CAF50]" /> {dict.pantryModalTitle}
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 font-medium">Configure items you already own so NutriCart AI doesn't duplicate them in your shopping lists.</p>

                  <div className="space-y-4">
                    {/* Common items quick selector */}
                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-2">{dict.pantrySelectDbLabel}</label>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200/50">
                        {[
                          { roName: 'Piept de pui', enName: 'Chicken Breast', qty: '1 kg', days: 4, emoji: '🍗' },
                          { roName: 'Ouă', enName: 'Eggs', qty: '10 buc', days: 15, emoji: '🥚' },
                          { roName: 'Fulgi de ovăz', enName: 'Oats', qty: '500g', days: 90, emoji: '🥣' },
                          { roName: 'Iaurt grecesc', enName: 'Greek Yogurt', qty: '400g', days: 8, emoji: '🥛' },
                          { roName: 'Banane', enName: 'Bananas', qty: '1 kg', days: 5, emoji: '🍌' },
                          { roName: 'Unt de arahide', enName: 'Peanut Butter', qty: '350g', days: 120, emoji: '🥜' },
                          { roName: 'Lapte 3.5%', enName: 'Milk 3.5%', qty: '1 L', days: 7, emoji: '🥛' },
                          { roName: 'Orez', enName: 'Rice', qty: '1 kg', days: 180, emoji: '🌾' },
                          { roName: 'Somon', enName: 'Salmon', qty: '500g', days: 3, emoji: '🐟' },
                          { roName: 'Mere', enName: 'Apples', qty: '1 kg', days: 14, emoji: '🍎' }
                        ].map(preset => {
                          const displayName = preset.enName;
                          return (
                            <button
                              key={preset.enName}
                              type="button"
                              onClick={() => {
                                setPantryItemName(displayName);
                                setPantryItemQty(preset.qty);
                                setPantryItemDays(preset.days);
                              }}
                              className="bg-white hover:bg-green-50 hover:border-green-300 border border-slate-200/60 px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 transition flex items-center gap-1"
                            >
                              <span>{preset.emoji}</span>
                              <span>{displayName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 my-2"></div>

                    <div>
                      <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.pantryItemNameLabel}</label>
                      <input 
                        type="text"
                        value={pantryItemName}
                        onChange={e => setPantryItemName(e.target.value)}
                        placeholder="e.g. Peanut Butter"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.pantryItemQtyLabel}</label>
                        <input 
                          type="text"
                          value={pantryItemQty}
                          onChange={e => setPantryItemQty(e.target.value)}
                          placeholder="e.g. 500g, 10 pcs"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">{dict.pantryItemDaysLabel}</label>
                        <input 
                          type="number"
                          value={pantryItemDays}
                          onChange={e => setPantryItemDays(parseInt(e.target.value) || 1)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsPantryModalOpen(false)}
                      className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition"
                    >
                      {dict.cancel}
                    </button>
                    <button 
                      type="button"
                      disabled={!pantryItemName.trim()}
                      onClick={() => {
                        handleAddPantryItem(pantryItemName, pantryItemQty, pantryItemDays);
                      }}
                      className="bg-[#2E7D32] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#1b4e20] transition"
                    >
                      {dict.save}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Modal Dialog Overlay */}
            {isSettingsModalOpen && settingsOnboarding && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl p-6 sm:p-8 relative">
                  <button 
                    onClick={() => setIsSettingsModalOpen(false)}
                    className="absolute right-4 top-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#4CAF50]" /> Edit Onboarding Settings
                  </h3>
                  <p className="text-xs text-slate-400 mb-6 font-medium">
                    Modify the physical stats, goals, and location settings configured during initial onboarding.
                  </p>

                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* STEP 1: Physical Profile */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-4">
                      <h4 className="text-xs font-black text-[#2E7D32] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#4CAF50]"></span> Step 1: Physical Profile
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                          <input 
                            type="number" 
                            value={settingsOnboarding.age}
                            onChange={e => setSettingsOnboarding({ ...settingsOnboarding, age: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                          <select 
                            value={settingsOnboarding.gender}
                            onChange={e => setSettingsOnboarding({ ...settingsOnboarding, gender: e.target.value as any })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800"
                          >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Height (cm)</label>
                          <input 
                            type="number" 
                            value={settingsOnboarding.height}
                            onChange={e => setSettingsOnboarding({ ...settingsOnboarding, height: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Weight (kg)</label>
                          <input 
                            type="number" 
                            value={settingsOnboarding.weight}
                            onChange={e => setSettingsOnboarding({ ...settingsOnboarding, weight: parseInt(e.target.value) || 0 })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800" 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1.5">Activity Level</label>
                        <select
                          value={settingsOnboarding.activityLevel}
                          onChange={e => setSettingsOnboarding({ ...settingsOnboarding, activityLevel: e.target.value as any })}
                          className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800"
                        >
                          <option value="sedentary">Sedentary (Little to no exercise)</option>
                          <option value="lightly_active">Lightly Active (1-3 days light exercise)</option>
                          <option value="moderately_active">Moderately Active (3-5 days moderate exercise)</option>
                          <option value="very_active">Very Active (6-7 days heavy training)</option>
                        </select>
                      </div>
                    </div>

                    {/* STEP 2: Goal & Diet */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-4">
                      <h4 className="text-xs font-black text-[#2E7D32] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#4CAF50]"></span> Step 2: Goal &amp; Diet
                      </h4>

                      {/* AI & Clinical Normative Diet Recommendation Callout */}
                      {(() => {
                        const rec = getRecommendedDiet(settingsOnboarding.age, settingsOnboarding.weight, settingsOnboarding.height);
                        return (
                          <div className="bg-[#4CAF50]/10 border border-[#4CAF50]/20 rounded-xl p-3.5 text-left shadow-sm">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-[#2E7D32]" />
                              <h5 className="text-[11px] font-black text-[#2E7D32] uppercase tracking-wider">Clinical Recommendation (Normatives)</h5>
                            </div>
                            <p className="text-[11px] text-slate-700 leading-normal">
                              Based on your physical profile (Age: <span className="font-bold">{settingsOnboarding.age}</span>, Weight: <span className="font-bold">{settingsOnboarding.weight}kg</span>), public health normatives recommend the <span className="font-bold text-[#2E7D32]">{rec.diet}</span> diet structure.
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1 leading-normal italic bg-white/60 p-2 rounded-lg border border-slate-100">
                              "{rec.reason}"
                            </p>
                            <button
                              type="button"
                              onClick={() => setSettingsOnboarding({ ...settingsOnboarding, dietType: rec.diet as any })}
                              className="mt-2 inline-flex items-center gap-1 bg-[#2E7D32] hover:bg-[#1b4e20] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition active:scale-95 shadow-sm"
                            >
                              Auto-Apply {rec.diet} Diet
                            </button>
                          </div>
                        );
                      })()}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Target Goal</label>
                          <select
                            value={settingsOnboarding.goal}
                            onChange={e => setSettingsOnboarding({ ...settingsOnboarding, goal: e.target.value as any })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800"
                          >
                            <option value="lose_weight">Lose Weight</option>
                            <option value="gain_muscle">Gain Muscle</option>
                            <option value="maintain">Maintain weight</option>
                            <option value="general_health">Improve General Health</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Diet Type Preset</label>
                          <select
                            value={settingsOnboarding.dietType}
                            onChange={e => setSettingsOnboarding({ ...settingsOnboarding, dietType: e.target.value as any })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800"
                          >
                            {['Normal', 'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 'High Protein', 'Low Carb', 'Gluten Free'].map(diet => (
                              <option key={diet} value={diet}>{diet}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* STEP 3: Location & Budget */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-4">
                      <h4 className="text-xs font-black text-[#2E7D32] uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#4CAF50]"></span> Step 3: Location, Budget &amp; Period
                      </h4>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Country</label>
                          <select
                            value={settingsOnboarding.country || 'Romania'}
                            onChange={e => {
                              const val = e.target.value;
                              const countryData = COUNTRIES[val] || COUNTRIES['Romania'];
                              const currentCountryData = COUNTRIES[settingsOnboarding.country || 'Romania'] || COUNTRIES['Romania'];
                              
                              const defaultRate = countryData.rate / (currentCountryData.rate || 1.0);
                              const equivalentBudget = Math.round(settingsOnboarding.budget * defaultRate);
      
                              setSettingsOnboarding({
                                ...settingsOnboarding,
                                country: val,
                                currency: countryData.currency,
                                budget: equivalentBudget,
                                preferredStores: [...countryData.stores]
                              });
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800"
                          >
                            {Object.keys(COUNTRIES).map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Currency</label>
                          <select
                            value={settingsOnboarding.currency || 'RON'}
                            onChange={e => setSettingsOnboarding({ ...settingsOnboarding, currency: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800"
                          >
                            <option value="RON">Romanian Leu (RON, lei)</option>
                            <option value="MDL">Moldovan Leu (MDL, MDL)</option>
                            <option value="USD">US Dollar (USD, $)</option>
                            <option value="GBP">British Pound (GBP, £)</option>
                            <option value="EUR">Euro (EUR, €)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Budget Limit</label>
                          <div className="relative">
                            <input 
                              type="number" 
                              value={settingsOnboarding.budget}
                              onChange={e => setSettingsOnboarding({ ...settingsOnboarding, budget: parseInt(e.target.value) || 0 })}
                              className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none pr-12 font-semibold text-slate-800" 
                            />
                            <span className="absolute right-3 top-3 text-[10px] font-bold text-[#4CAF50]">{settingsOnboarding.currency || 'lei'}</span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase mb-1">Planning Period</label>
                          <select
                            value={settingsOnboarding.planningFrequency}
                            onChange={e => setSettingsOnboarding({ ...settingsOnboarding, planningFrequency: e.target.value as any })}
                            className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs sm:text-sm focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent outline-none font-semibold text-slate-800"
                          >
                            <option value="daily">Daily Target</option>
                            <option value="weekly">Weekly Target</option>
                            <option value="monthly">Monthly Target</option>
                          </select>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsSettingsModalOpen(false)}
                      className="bg-slate-100 text-slate-600 px-5 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-200 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        handleSaveSettings(settingsOnboarding);
                      }}
                      className="bg-[#2E7D32] text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-[#1b4e20] transition shadow-md"
                    >
                      Save Settings Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Shopping Cart Tab */}
        {activeTab === 'cart' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <ShoppingCart className="w-5.5 h-5.5 text-[#4CAF50]" />
                  Active Shopping Cart
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Check off products as you buy them to deduct from your budget and automatically transfer them to your pantry.
                </p>
              </div>
              {cartItems.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to empty your cart?')) {
                      setCartItems([]);
                    }
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 px-4 py-2 rounded-xl transition"
                >
                  Clear Cart
                </button>
              )}
            </div>

            {cartItems.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/20 max-w-lg mx-auto my-6 px-6">
                <div className="w-16 h-16 bg-green-50 text-[#4CAF50] rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-md font-black text-slate-800">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-semibold">
                  Go to your Dashboard and add individual items, or click "Add to Cart & Sync" on the AI-optimized grocery list to load your cart.
                </p>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className="mt-6 bg-[#4CAF50] hover:bg-[#2E7D32] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase transition-all shadow-md shadow-green-100 inline-flex items-center gap-1.5"
                >
                  Go to Dashboard
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="overflow-x-auto border border-slate-100 rounded-3xl bg-white shadow-inner p-1">
                    <table className="w-full text-sm min-w-[600px] border-collapse">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider font-semibold">
                          <th className="text-center pb-3 pt-3 pl-4 w-12">
                            <input
                              type="checkbox"
                              checked={cartItems.every(item => item.checked)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setCartItems(prev => prev.map(i => ({ ...i, checked })));
                              }}
                              className="w-4 h-4 rounded text-[#4CAF50] border-slate-300 focus:ring-[#4CAF50] cursor-pointer"
                              title="Toggle all items"
                            />
                          </th>
                          <th className="text-left pb-3 pt-3 font-semibold text-slate-500">Product</th>
                          <th className="text-left pb-3 pt-3 font-semibold text-slate-500">Supermarket</th>
                          <th className="text-center pb-3 pt-3 font-semibold text-slate-500">Qty</th>
                          <th className="text-right pb-3 pt-3 font-semibold text-slate-500">
                            <span className="inline-flex items-center gap-0.5 cursor-help" title="Indicative prices only. In-store prices may vary.">
                              Approx. Price <span className="text-amber-500 font-bold">*</span>
                            </span>
                          </th>
                          <th className="pb-3 pt-3 pr-4 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {cartItems.map((item) => {
                          const activeOnb = onboarding || tempOnboarding;
                          const userCountry = activeOnb.country || 'Romania';
                          const countryConfig = COUNTRIES[userCountry] || COUNTRIES['Romania'];
                          const rate = countryConfig.rate;
                          const localItemPrice = item.product.price * rate * item.quantity;

                          return (
                            <tr key={item.id} className={`hover:bg-slate-50/30 transition group ${item.checked ? 'bg-green-50/10' : ''}`}>
                              <td className="py-4 text-center pl-4">
                                <input
                                  type="checkbox"
                                  checked={!!item.checked}
                                  onChange={() => handleToggleCartItemCheck(item.id)}
                                  className="w-4 h-4 rounded text-[#4CAF50] border-slate-300 focus:ring-[#4CAF50] cursor-pointer"
                                />
                              </td>
                              <td className="py-4 flex items-center gap-3 font-medium">
                                <span className="text-2xl" role="img" aria-label="product icon">{item.product.image || '🛒'}</span>
                                <div>
                                  <p className={`font-bold text-slate-800 leading-tight ${item.checked ? 'line-through text-slate-400' : ''}`}>
                                    {localizeProductName(item.product.name)}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-bold mt-1">
                                    {localizeBrand(item.product.brand)} • {item.product.weight}
                                  </p>
                                </div>
                              </td>
                              <td className="py-4 text-slate-500 font-semibold">{localizeStore(item.product.store)}</td>
                              <td className="py-4 text-center">
                                <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 rounded-xl px-2 py-1 shadow-sm">
                                  <button
                                    onClick={() => handleUpdateCartItemQty(item.id, item.quantity - 1)}
                                    className="w-5 h-5 flex items-center justify-center rounded-md bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-black transition active:scale-95"
                                    title="Decrease quantity"
                                  >
                                    -
                                  </button>
                                  <span className="font-mono font-bold text-slate-700 min-w-[22px] text-center text-xs">{item.quantity}</span>
                                  <button
                                    onClick={() => handleUpdateCartItemQty(item.id, item.quantity + 1)}
                                    className="w-5 h-5 flex items-center justify-center rounded-md bg-white hover:bg-slate-200 text-slate-600 border border-slate-200 text-xs font-black transition active:scale-95"
                                    title="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 text-right font-bold text-[#2E7D32]">
                                <span className="inline-flex items-center gap-0.5 cursor-help" title="Indicative estimated price. Local shelf price may vary.">
                                  ~ {formatPriceLocal(localItemPrice)}
                                  <span className="text-slate-400 text-[10px] font-semibold">*</span>
                                </span>
                              </td>
                              <td className="py-4 text-right pr-4">
                                <button
                                  onClick={() => handleRemoveFromCart(item.id)}
                                  className="text-slate-300 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50/50 transition"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right summary section */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Cart metrics & checkout */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between shadow-xl">
                    <div>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block mb-1">
                        Cart Summary
                      </span>
                      
                      <div className="space-y-4 mt-4 pb-4 border-b border-slate-800">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-bold">Total Items:</span>
                          <span className="text-sm font-black font-mono">
                            {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-slate-400 font-bold">
                            Total Cart Cost:
                          </span>
                          <span className="text-md font-black font-mono text-[#4CAF50]">
                            {(() => {
                              const activeOnb = onboarding || tempOnboarding;
                              const userCountry = activeOnb.country || 'Romania';
                              const countryConfig = COUNTRIES[userCountry] || COUNTRIES['Romania'];
                              const rate = countryConfig.rate;
                              const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                              return formatPriceLocal(total * rate);
                            })()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                          <span className="text-xs text-slate-300 font-bold">
                            Cost of Checked Items:
                          </span>
                          <span className="text-sm font-black font-mono text-[#FFC107]">
                            {(() => {
                              const activeOnb = onboarding || tempOnboarding;
                              const userCountry = activeOnb.country || 'Romania';
                              const countryConfig = COUNTRIES[userCountry] || COUNTRIES['Romania'];
                              const rate = countryConfig.rate;
                              const total = cartItems.filter(i => i.checked).reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                              return formatPriceLocal(total * rate);
                            })()}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-[10px] text-slate-400 leading-tight font-medium">
                          Checking out selected products will add their cost to your spent budget tracker and automatically transfer them into your Smart Pantry.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleCheckoutCheckedItems}
                      className="mt-6 w-full bg-[#4CAF50] hover:bg-[#3d9c3f] text-white py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-green-950/20 flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      CHECKOUT CHECKED ITEMS
                    </button>
                  </div>

                  {/* Quick Budget Status Reference Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 mb-4">
                      <Wallet className="w-4 h-4 text-slate-400" />
                      Active Budget Status
                    </h3>
                    
                    <div className="space-y-3.5 font-sans">
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs text-slate-500 font-bold">Weekly Limit:</span>
                        <span className="text-xs font-bold text-slate-800">{formatPriceLocal(onboarding.budget)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-xs text-slate-500 font-bold">Money Spent:</span>
                        <span className="text-xs font-black text-red-600">-{formatPriceLocal(manualSpentAmount)}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-xs text-slate-800 font-black">Remaining:</span>
                        <span className="text-xs font-black text-green-600">
                          {formatPriceLocal(onboarding.budget - manualSpentAmount)}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}



      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-400 font-medium">
        <div className="max-w-7xl w-full mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 NutriCart AI. All rights reserved. Romanian Supermarket Index.</p>
          <div className="flex gap-4">
            <span className="hover:text-slate-600 transition">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-600 transition">Privacy Shield</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
