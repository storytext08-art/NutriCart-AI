export interface OnboardingData {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  goal: 'lose_weight' | 'gain_muscle' | 'maintain' | 'general_health';
  activityLevel: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
  preferredStores: string[]; // e.g. Lidl, Kaufland, Carrefour, Metro, Auchan
  country: string;
  currency: string;
  budget: number;
  foodAllergies: string[];
  foodsDislike: string[];
  foodsLove: string[];
  dietType: 'Normal' | 'Vegetarian' | 'Vegan' | 'Keto' | 'Paleo' | 'Mediterranean' | 'High Protein' | 'Low Carb' | 'Gluten Free';
  planningFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface FoodProduct {
  id: string;
  name: string;
  brand: string;
  store: string;
  price: number; // in active currency
  discount?: number; // discount percentage or absolute
  weight: string; // e.g. "500g", "1kg"
  protein: number; // per 100g or per package
  carbs: number;
  fat: number;
  calories: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  ingredients: string;
  nutritionLabel?: string; // description or key highlights
  costPerProteinGram: number; // price / total protein
  costPerCalorie: number; // price / total calories
  healthScore: number; // 0-100
  image: string; // emoji or URL
  alternatives: string[]; // product names
  category: string;
}

export interface Meal {
  name: string;
  recipe: string;
  preparationSteps: string[];
  cookingTime: string; // e.g. "15 mins"
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  nutrition: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  shoppingIngredients: string[];
}

export interface MealPlan {
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
  snacks: Meal;
}

export interface ShoppingItem {
  product: FoodProduct;
  quantity: number;
  totalCost: number;
  consumeType?: 'daily' | 'weekly';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  shoppingList?: {
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
  };
  mealPlan?: MealPlan;
  budgetAnalysis?: {
    spent: number;
    remaining: number;
    suggestions: string[];
  };
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expirationDate: string;
  daysRemaining: number;
}

export interface WaterLog {
  amount: number; // in ml
  timestamp: string;
}
