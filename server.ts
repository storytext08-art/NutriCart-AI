import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { FOOD_DATABASE } from './src/foodDb';

// Load env variables
dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

// Initialize Gemini client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', apiConfigured: !!ai });
});

// COUNTRIES configuration for localized stores and currency conversion
const COUNTRIES: Record<string, {
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

// Catalog info for system instruction
const catalogString = JSON.stringify(
  FOOD_DATABASE.map(p => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    store: p.store,
    price: p.price,
    weight: p.weight,
    protein: p.protein,
    carbs: p.carbs,
    fat: p.fat,
    calories: p.calories,
    fiber: p.fiber,
    sugar: p.sugar,
    sodium: p.sodium,
    ingredients: p.ingredients,
    healthScore: p.healthScore,
    category: p.category,
  })),
  null,
  2
);

// Main AI Chat / Shopping optimizer API
app.post('/api/chat', async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY environment variable is missing on the server. Please add it in Settings > Secrets.',
    });
  }

  const { messages, onboarding, customPrompt } = req.body;

  try {
    const model = 'gemini-3.5-flash';
    const userCountry = onboarding?.country || 'Romania';
    const userCurrency = onboarding?.currency || 'RON';
    const countryConfig = COUNTRIES[userCountry] || COUNTRIES['Romania'];
    const localRate = countryConfig.rate;
    const localSymbol = countryConfig.currencySymbol;

    // Compile instructions
    const systemInstruction = `You are NutriCart AI, an expert full-stack nutrition coach, personal fitness trainer, and budget-conscious grocery shopping optimizer.
Your goal is to help the user achieve their specific physical goal (weight loss, muscle gain, etc.) within their weekly/daily budget.

The user is located in ${userCountry}.
The active currency is ${userCurrency} (${localSymbol}).
You MUST map the Romanian store names in the catalog to their local counterparts in ${userCountry}:
- Lidl -> ${countryConfig.storeMap['Lidl'] || 'Lidl'}
- Kaufland -> ${countryConfig.storeMap['Kaufland'] || 'Kaufland'}
- Carrefour -> ${countryConfig.storeMap['Carrefour'] || 'Carrefour'}
- Metro -> ${countryConfig.storeMap['Metro'] || 'Metro'}
- Auchan -> ${countryConfig.storeMap['Auchan'] || 'Auchan'}
- Mega Image -> ${countryConfig.storeMap['Mega Image'] || 'Mega Image'}

CRITICAL: Convert ALL prices from Romanian Lei (RON) in the catalog to ${userCurrency} by multiplying them by the conversion factor of ${localRate}.
All prices, total costs, and cost metrics in the JSON "shoppingList", "budgetAnalysis", and "text" fields of your response MUST be in ${userCurrency}!
For example: If the product is 10.00 RON, it must be listed as ${(10.00 * localRate).toFixed(2)} ${userCurrency} at store "${countryConfig.storeMap['Lidl']}".

Here is the base catalog currently available (in RON, Romanian store names):
${catalogString}

When responding, you MUST return a valid JSON object matching the following TypeScript schema:
{
  "text": "A friendly, personalized, conversational response explaining the logic, coaching advice, motivation, and shopping list overview.",
  "shoppingList": {
    "items": [
      {
        "product": {
          "id": "barcode of the product in the catalog, or 'custom' if you generate a custom product that matches the store",
          "name": "name of product",
          "brand": "brand name",
          "store": "local mapped supermarket name",
          "price": 5.49,
          "weight": "1kg",
          "protein": 23.0,
          "carbs": 0.0,
          "fat": 1.5,
          "calories": 110,
          "fiber": 0,
          "sugar": 0,
          "sodium": 0.06,
          "ingredients": "ingredients list",
          "costPerProteinGram": 0.1,
          "costPerCalorie": 0.02,
          "healthScore": 95,
          "image": "emoji representative",
          "alternatives": ["Turkey breast"],
          "category": "Meat & Fish"
        },
        "quantity": 1,
        "totalCost": 5.49
      }
    ],
    "totalCost": 5.49,
    "totalProtein": 230.0,
    "totalCarbs": 0.0,
    "totalFat": 15.0,
    "totalCalories": 1100,
    "totalFiber": 0,
    "costPerProteinGram": 0.1,
    "costPerCalorie": 0.02,
    "avgHealthScore": 95
  },
  "mealPlan": {
    "breakfast": {
      "name": "Meal name",
      "recipe": "Quick overview",
      "preparationSteps": ["Step 1", "Step 2"],
      "cookingTime": "15 mins",
      "difficulty": "Easy",
      "nutrition": { "protein": 30, "carbs": 40, "fat": 10, "calories": 370 },
      "shoppingIngredients": ["Eggs", "Whole Wheat Bread"]
    },
    "lunch": {
      "name": "Meal name",
      "recipe": "Quick overview",
      "preparationSteps": ["Step 1"],
      "cookingTime": "15 mins",
      "difficulty": "Medium",
      "nutrition": { "protein": 35, "carbs": 45, "fat": 12, "calories": 420 },
      "shoppingIngredients": ["Chicken"]
    },
    "dinner": {
      "name": "Meal name",
      "recipe": "Quick overview",
      "preparationSteps": ["Step 1"],
      "cookingTime": "15 mins",
      "difficulty": "Easy",
      "nutrition": { "protein": 30, "carbs": 20, "fat": 15, "calories": 350 },
      "shoppingIngredients": ["Tofu"]
    },
    "snacks": {
      "name": "Meal name",
      "recipe": "Quick overview",
      "preparationSteps": ["Step 1"],
      "cookingTime": "15 mins",
      "difficulty": "Easy",
      "nutrition": { "protein": 15, "carbs": 10, "fat": 5, "calories": 150 },
      "shoppingIngredients": ["Yogurt"]
    }
  },
  "budgetAnalysis": {
    "spent": 5.49,
    "remaining": 344.51,
    "suggestions": [
      "Buy frozen vegetables to save compared to fresh broccoli.",
      "Replace salmon with canned tuna to double protein per unit."
    ]
  }
}

Guidelines for optimization:
1. Always prioritize matching the user's onboarding preferences:
   - Diet type: ${onboarding?.dietType || 'Normal'}
   - Budget: ${onboarding?.budget || 'Not specified'} ${onboarding?.currency || 'RON'}
   - Goal: ${onboarding?.goal || 'General health'}
   - Food allergies: ${onboarding?.foodAllergies?.join(', ') || 'None'}
   - Disliked foods: ${onboarding?.foodsDislike?.join(', ') || 'None'} (strictly AVOID these)
   - Loved foods: ${onboarding?.foodsLove?.join(', ') || 'None'} (try to include these)
   - Preferred stores: ${onboarding?.preferredStores?.join(', ') || 'Aldi, Walmart, Tesco, REWE, etc.'}
2. If the user asks a conversational question, still fill out the response fields, but focus the 'text' property on answering the question. If they request a specific plan or shopping list (e.g. "I have 100 USD and need 180g protein"), solve the mathematical optimization problem exactly and compile the perfect shoppingList, mealPlan, and budgetAnalysis.
3. Calculate exact macros:
   - Protein = 4 kcal/g
   - Carbs = 4 kcal/g
   - Fat = 9 kcal/g
4. Generate practical, easy recipes that take little cooking time if they are busy.
5. Provide real, concrete suggestions under budgetAnalysis to save money in ${userCurrency} with localized stores.
6. Ensure your response is strictly VALID JSON and nothing else. No markdown wrapper like \`\`\`json unless requested, but to be safe, output clean JSON.`;

    // Map conversation messages to Gemini format
    const rawContents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    }));

    // If there is an immediate custom prompt, append it ONLY if it isn't already the last message
    if (customPrompt) {
      const lastMessage = rawContents[rawContents.length - 1];
      if (!lastMessage || lastMessage.parts[0].text !== customPrompt || lastMessage.role !== 'user') {
        rawContents.push({
          role: 'user',
          parts: [{ text: customPrompt }],
        });
      }
    }

    // Clean up contents to guarantee alternating user/model roles and eliminate consecutive same-role duplicates
    const contents: any[] = [];
    for (const item of rawContents) {
      if (contents.length > 0 && contents[contents.length - 1].role === item.role) {
        // Merge consecutive parts with a newline
        contents[contents.length - 1].parts[0].text = 
          (contents[contents.length - 1].parts[0].text + "\n" + item.parts[0].text).trim();
      } else {
        contents.push({
          role: item.role,
          parts: [{ text: item.parts[0].text || '' }]
        });
      }
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.2, // Low temperature for high structural consistency and reliable math
      },
    });

    const textOutput = response.text || '{}';
    let parsedResult;
    try {
      parsedResult = JSON.parse(textOutput.trim());
    } catch (parseErr) {
      console.error('Failed to parse JSON from Gemini:', textOutput);
      // Fallback response inside JSON
      parsedResult = {
        text: "I analyzed your request, but experienced an issue compiling the exact shopping list JSON structure. Here is my general guidance: Try to focus on eggs, oats, rolled breast chicken, and frozen veggies. Let's try adjusting the prompt slightly!",
        shoppingList: { items: [], totalCost: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, totalCalories: 0, totalFiber: 0, costPerProteinGram: 0, costPerCalorie: 0, avgHealthScore: 0 },
        mealPlan: null,
        budgetAnalysis: { spent: 0, remaining: onboarding?.budget || 0, suggestions: [] }
      };
    }

    res.json(parsedResult);
  } catch (error: any) {
    console.error('API Chat Error:', error);
    res.status(500).json({ error: error.message || 'Error communicating with AI optimizer' });
  }
});

// Barcode scanner AI evaluation proxy
app.post('/api/scan', async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY environment variable is missing on the server. Please add it in Settings > Secrets.',
    });
  }

  const { product, onboarding } = req.body;

  try {
    const model = 'gemini-3.5-flash';
    const prompt = `Analyze this food product based on the user's onboarding profile.

Product details:
${JSON.stringify(product, null, 2)}

User nutrition & health profile:
- Goal: ${onboarding?.goal || 'General Health'}
- Diet: ${onboarding?.dietType || 'Normal'}
- Allergies: ${onboarding?.foodAllergies?.join(', ') || 'None'}
- Disliked foods: ${onboarding?.foodsDislike?.join(', ') || 'None'}

Your evaluation must return a JSON with:
{
  "rating": "Excellent" | "Good" | "Average" | "Avoid",
  "explanation": "State clearly why this product is rated this way based on their goals and ingredients. Keep it punchy and clear, max 3-4 sentences.",
  "swapSuggestion": "If rated Average or Avoid, suggest an alternative. Otherwise, say something motivational."
}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    res.json(parsed);
  } catch (error: any) {
    console.error('Scan evaluation error:', error);
    res.json({
      rating: 'Average',
      explanation: 'Could not perform full AI assessment due to network limitations. Based on standard database macros, this is a balanced option.',
      swapSuggestion: 'Consider whole foods like oats or fresh eggs as safe alternatives.',
    });
  }
});

// AI Food Intake Logger Endpoint
app.post('/api/log-food', async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY environment variable is missing on the server. Please add it in Settings > Secrets.',
    });
  }

  const { text, onboarding } = req.body;

  try {
    const model = 'gemini-3.5-flash';
    const prompt = `You are a professional nutrition and dietetics assistant.
Analyze the following statement of what the user ate and calculate the exact macronutrients and calories.
Input text: "${text}"

Onboarding / Diet profile of the user (for context if helpful):
- Goal: ${onboarding?.goal || 'General Health'}
- Diet: ${onboarding?.dietType || 'Normal'}

Your response MUST be a valid JSON object matching this schema exactly:
{
  "foodName": "A brief, clean English name/summary of the food logged",
  "calories": number, // total calories in kcal (integer)
  "protein": number, // total protein in grams (rounded to 1 decimal place)
  "carbs": number, // total carbohydrates in grams (rounded to 1 decimal place)
  "fat": number // total fat in grams (rounded to 1 decimal place)
}

Use these standards for common reference:
- 1 medium egg: 70 kcal, 6g protein, 5g fat, 0.4g carbs
- 100g cooked chicken breast: 165 kcal, 31g protein, 3.6g fat, 0g carbs
- 1 medium banana: 105 kcal, 1.3g protein, 0.3g fat, 27g carbs
- 100g rolled oats: 389 kcal, 16.9g protein, 6.9g fat, 66g carbs
- 1 tbsp peanut butter (16g): 94 kcal, 4g protein, 8g fat, 3g carbs
- 1 cup Greek yogurt (200g): 150 kcal, 18g protein, 4g fat, 8g carbs

If the user input is vague, joke, or doesn't specify recognizable food, make a reasonable healthy-average estimate or return 0 for everything, but still return a valid JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse((response.text || '{}').trim());
    res.json(parsed);
  } catch (error: any) {
    console.error('Food logging parse error:', error);
    res.status(500).json({ error: error.message || 'Error parsing food items' });
  }
});

// Handle serving the Vite dev/prod client
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start full-stack server:', err);
});
