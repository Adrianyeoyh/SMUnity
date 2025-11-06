// scripts/test-gemini-api.ts
// Test script to verify Gemini API key is working
import { config } from "dotenv";

config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is not set in your .env file");
  console.log("\n📝 Please add the following to your .env file:");
  console.log("   GEMINI_API_KEY=your_api_key_here");
  process.exit(1);
}

console.log("🔑 API Key found (first 10 chars):", GEMINI_API_KEY.substring(0, 10) + "...");
console.log("🧪 Testing Gemini API connection...\n");

console.log("🔍 Checking available models...");
try {
  const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`;
  const listResponse = await fetch(listUrl);
  
  if (listResponse.ok) {
    const listData = await listResponse.json();
    const availableModels = listData.models
      ?.filter((m: any) => m.supportedGenerationMethods?.includes("generateContent"))
      ?.map((m: any) => m.name.replace("models/", ""))
      || [];
    
    console.log(` Found ${availableModels.length} available models:`);
    availableModels.slice(0, 10).forEach((m: string) => console.log(`   - ${m}`));
    
    if (availableModels.length > 0) {
      // Prefer stable models over preview versions
      const stableModels = availableModels.filter((m: string) => 
        !m.includes("preview") && (m.includes("flash") || m.includes("pro"))
      );
      
      if (stableModels.length > 0) {
        console.log(`\n Testing with stable model: ${stableModels[0]}`);
        var modelsToTry = [stableModels[0]];
      } else {
        console.log(`\n Testing with: ${availableModels[0]}`);
        var modelsToTry = [availableModels[0]];
      }
    } else {
      console.log("\n  No models found with generateContent support");
      var modelsToTry: string[] = [];
    }
  } else {
    console.log("  Could not list models, trying common model names...");
    var modelsToTry = [
      "gemini-1.5-flash-latest",
      "gemini-1.5-flash-002",
      "gemini-1.5-pro-latest",
      "gemini-pro",
      "gemini-1.5-flash",
    ];
  }
} catch (error: any) {
  console.log("  Could not list models, trying common model names...");
  var modelsToTry = [
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro-latest",
    "gemini-pro",
    "gemini-1.5-flash",
  ];
}

const testMessage = {
  contents: [
    {
      role: "user",
      parts: [{ text: "Say 'Hello, SMUnity!' if you can read this." }],
    },
  ],
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 50,
  },
};

let workingModel = "";

for (const model of modelsToTry) {
  console.log(` Trying model: ${model}...`);
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testMessage),
    });

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 429) {
        console.log(`     Rate limited (429) - This means your API key works!`);
        console.log(`    Try again in a moment or use a different model`);
        // Still consider this a success since the key is valid
        workingModel = model;
        break;
      }
      console.log(`    Failed: ${response.status}`);
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          console.log(`   Error: ${errorData.error.message}`);
        }
      } catch {}
      continue;
    }

    const data = await response.json();
    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (assistantMessage) {
      workingModel = model;
      console.log(`\n SUCCESS! Model ${model} is working!`);
      console.log("\n Response:");
      console.log("   " + assistantMessage);
      console.log(`\n Update your chatbot.ts file to use: "${model}"`);
      break;
    }
  } catch (error: any) {
    console.log(`    Error: ${error.message}`);
    continue;
  }
}

if (!workingModel) {
  console.error("\n None of the tested models worked.");
  console.log("\n Please check:");
  console.log("   1. Your API key is valid");
  console.log("   2. You have access to Gemini API");
  console.log("   3. Your API key has proper permissions");
  console.log("\n Visit https://aistudio.google.com/ to verify your API key");
  process.exit(1);
} else {
  console.log("\n Your chatbot API is configured correctly!");
  console.log(`\n Update server/api/public/chatbot.ts line 93 to use: "${workingModel}"`);
}
