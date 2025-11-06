// server/api/public/chatbot.ts
import { createApp } from "#server/factory";
import { badReq, forbidden, ok } from "#server/helper";
import { z } from "zod";
import { env } from "#server/env";

const chatbot = createApp();

import { db } from "#server/drizzle/db";
import * as schema from "#server/drizzle/schema";
import { user } from "#server/drizzle/schema";
import { gte, eq, or, like } from "drizzle-orm";

function getSystemPrompt(isLoggedIn: boolean, availableProjects: any[] = []) {
  const projectsContext = availableProjects.length > 0
    ? `\n\nAVAILABLE PROJECTS LIST (use these actual projects when answering):\n` +
      availableProjects.map((p, i) => 
        `${i + 1}. Title: "${p.title}" | Category: ${p.category} | Organisation: ${p.organisation} | Location: ${p.location || p.country || 'Remote'} | Type: ${p.type} | Description: ${(p.description || '').substring(0, 150)}${p.description && p.description.length > 150 ? '...' : ''}`
      ).join('\n')
    : '';

  return `You are a helpful assistant for SMUnity, a platform that connects SMU students with Community Service Projects (CSPs). 

Your role is to help students and visitors understand:
- How to browse and search for CSPs
- How to apply for projects
- Project requirements and details
- Application status and process
- General questions about the platform

SPECIFIC INSTRUCTIONS:

1. STATUS QUERIES (e.g., "What is the status of my application?", "Check my application status"):
   - CRITICAL: At the start of this conversation, you were told the user's login status. Check the IMPORTANT note above.
   - If you see "user IS NOT LOGGED IN": You MUST immediately respond with "You must log in to check your application status. Please sign in first."
   - If you see "user IS CURRENTLY LOGGED IN": Direct them to check their dashboard at /dashboard or /my-applications where they can see all their application statuses. DO NOT tell them to log in - they already are!
   - The login status is fixed for the entire conversation - don't change your answer based on the question wording

2. FINDING PROJECTS (e.g., "Find me an environmental project", "Show me community projects"):
   - CRITICAL: You MUST use the actual project titles from the AVAILABLE PROJECTS LIST above
   - Search through the available projects list by matching category, keywords in description, or title
   - When user asks for a specific type (e.g., "environmental", "community", "education"):
     * Search for projects where the category matches OR the description/title contains related keywords
     * Return ALL matching projects from the list, not just generic suggestions
     * Format your response like: "Here are some [category] projects I found:\n\n1. [Project Title] - [Brief description from the list]\n2. [Project Title] - [Brief description]"
   - If you find matching projects: List them by their EXACT titles from the AVAILABLE PROJECTS LIST. Include the organisation name and location.
   - If NO matching projects found: Say "I don't have any projects matching that criteria currently available. Try browsing the Discover page to see all available projects."
   - IMPORTANT: Always use the exact project titles from the list - never make up project names

3. GENERAL GUIDANCE:
   - Be friendly, concise, and helpful
   - Always provide actionable next steps
   - Direct users to relevant pages when appropriate (e.g., /discover for browsing, /dashboard for applications)
${projectsContext}

Important: Only provide general guidance. Never make specific changes to applications or provide personal information about users.`;
}

const chatRequestSchema = z.object({
  message: z.string().min(1).max(1000),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
});

chatbot.post("/chat", async (c) => {
  const user = c.get("user");
  const accountType = user?.accountType;

  if (user && accountType !== "student") {
    return forbidden(c, "Chatbot is only available for students and visitors");
  }

  if (!env.GEMINI_API_KEY) {
    return c.json(
      { error: "Chatbot service is not configured. Please contact support." },
      503
    );
  }

  try {
    const body = await c.req.json();
    const { message, conversationHistory } = chatRequestSchema.parse(body);

    let availableProjects: any[] = [];
    const isFindingProject = /find|show|search|looking for|recommend|suggest|want.*project|need.*project|any.*project|available.*project/i.test(message);

    if (isFindingProject) {
      try {
        const now = new Date();
        const projects = await db
          .select({
            id: schema.projects.id,
            title: schema.projects.title,
            category: schema.projects.category,
            description: schema.projects.description,
            location: schema.projects.district,
            country: schema.projects.country,
            type: schema.projects.type,
            organisationUserId: schema.projects.orgId,
            projectTags: schema.projects.projectTags,
            skillTags: schema.projects.skillTags,
          })
          .from(schema.projects)
          .where(gte(schema.projects.applyBy, now))
          .limit(30);

        const orgs = await db
          .select({
            userId: schema.organisations.userId,
            orgName: schema.user.name,
          })
          .from(schema.organisations)
          .leftJoin(schema.user, eq(schema.organisations.userId, schema.user.id));

        const orgNameMap = new Map(orgs.map(o => [o.userId, o.orgName || "Unknown Organisation"]));

        availableProjects = projects.map(p => ({
          ...p,
          organisation: orgNameMap.get(p.organisationUserId) || "Unknown Organisation",
        }));
      } catch (error) {
        console.error("Error fetching projects for chatbot:", error);
      }
    }

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    
    const isLoggedIn = !!user && user.accountType === "student";
    const systemPrompt = getSystemPrompt(isLoggedIn, availableProjects);
    
    const loginStatusNote = isLoggedIn 
      ? "\n\n IMPORTANT: The user asking questions IS CURRENTLY LOGGED IN as a student. They have access to their dashboard and can check application statuses."
      : "\n\n IMPORTANT: The user asking questions IS NOT LOGGED IN. They must sign in to check application statuses.";
    
    contents.push({
      role: "user",
      parts: [{ text: systemPrompt + loginStatusNote + "\n\nYou are now ready to answer questions." }],
    });
    
    contents.push({
      role: "model",
      parts: [{ text: "Understood. I'm ready to help with SMUnity questions." }],
    });
    
    (conversationHistory || []).forEach((msg) => {
      contents.push({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      });
    });
    
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // Call Gemini API
    const model = "gemini-2.5-flash";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Gemini API error:", error);
      return c.json(
        { error: "Failed to get response from AI assistant" },
        500
      );
    }

    const data = (await response.json()) as Record<string, any>;
    const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't process your request.";

    return ok(c, {
      message: assistantMessage,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
  return badReq(c, "Invalid request format", {
    errors: (error as any).issues ?? [],
  });
}
    console.error("Chatbot error:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default chatbot;

