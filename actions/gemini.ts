"use server";

import prisma from "@/lib/prisma";
import { ContentType } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export const generateCreativePrompt = async (userPrompt: string) => {
  const finalPrompt = `
    You are an assistant that generates safe, professional, and educational content outlines.

    User prompt: "${userPrompt}"

    Rules:
    - Do not include or describe any explicit, sexual, violent, hateful, or illegal content.
    - If the user's prompt is inappropriate, return a polite refusal message.
    - The outline must be strictly SFW (Safe For Work) and presentation-appropriate.
    - Each point should be concise and factual.
    - Return the response in **valid JSON** format as:

    {
      "outlines": [
        "Point 1",
        "Point 2",
        "Point 3",
        "Point 4",
        "Point 5",
        "Point 6"
      ]
    }
  `;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528-qwen3-8b:free", // ✅ use your chosen model
          messages: [
            {
              role: "system",
              content:
                "You are a helpful, safe, and structured AI that outputs only JSON data.",
            },
            { role: "user", content: finalPrompt },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error:", data);
      return {
        status: 400,
        message: data.error?.message || "Failed to generate response",
      };
    }

    // Extract raw model text
    const text = data.choices?.[0]?.message?.content?.trim() || "";

    // 🧹 Clean and extract JSON safely (handles ```json ... ``` cases)
    const cleanedText = text
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();

    const match = cleanedText.match(/\{[\s\S]*\}/);
    let jsonResponse = { outlines: [] };

    if (match) {
      try {
        jsonResponse = JSON.parse(match[0]);
      } catch (err) {
        console.error("JSON parse error:", err, "Raw text:", cleanedText);
      }
    } else {
      console.warn("No JSON found in AI response:", cleanedText);
    }

    return {
      status: 200,
      data: jsonResponse,
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      status: 500,
      error: "Internal server error",
    };
  }
};

const existingLayouts = [
  {
    id: uuidv4(),
    slideName: "Blank card",
    type: "blank-card",
    className: "p-8 mx-auto flex justify-center items-center min-h-[200px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Accent left",
    type: "accentLeft",
    className: "min-h-[300px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      restrictDropTo: true,
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: "image" as ContentType,
              name: "Image",
              content:
                "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "Title",
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Accent Right",
    type: "accentRight",
    className: "min-h-[300px]",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Resizable column",
          restrictToDrop: true,
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
            {
              id: uuidv4(),
              type: "image" as ContentType,
              name: "Image",
              restrictToDrop: true,
              content:
                "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              alt: "Title",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Image and text",
    type: "imageAndText",
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Image and text",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "image" as ContentType,
                  name: "Image",
                  className: "p-3",
                  content:
                    "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "Title",
                },
              ],
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Text and image",
    type: "textAndImage",
    className: "min-h-[200px] p-8 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "",
              content: [
                {
                  id: uuidv4(),
                  type: "heading1" as ContentType,
                  name: "Heading1",
                  content: "",
                  placeholder: "Heading1",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "start typing here",
                },
              ],
              className: "w-full h-full p-8 flex justify-center items-center",
              placeholder: "Heading1",
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "image" as ContentType,
                  name: "Image",
                  className: "p-3",
                  content:
                    "https://plus.unsplash.com/premium_photo-1729004379397-ece899804701?q=80&w=2767&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  alt: "Title",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Two columns",
    type: "twoColumns",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "Paragraph",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Two columns with headings",
    type: "twoColumnsWithHeadings",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading3" as ContentType,
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
            {
              id: uuidv4(),
              type: "column" as ContentType,
              name: "Column",
              content: [
                {
                  id: uuidv4(),
                  type: "heading3" as ContentType,
                  name: "Heading3",
                  content: "",
                  placeholder: "Heading 3",
                },
                {
                  id: uuidv4(),
                  type: "paragraph" as ContentType,
                  name: "Paragraph",
                  content: "",
                  placeholder: "Start typing...",
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: uuidv4(),
    slideName: "Three column",
    type: "threeColumns",
    className: "p-4 mx-auto flex justify-center items-center",
    content: {
      id: uuidv4(),
      type: "column" as ContentType,
      name: "Column",
      content: [
        {
          id: uuidv4(),
          type: "title" as ContentType,
          name: "Title",
          content: "",
          placeholder: "Untitled Card",
        },
        {
          id: uuidv4(),
          type: "resizable-column" as ContentType,
          name: "Text and image",
          className: "border",
          content: [
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
            {
              id: uuidv4(),
              type: "paragraph" as ContentType,
              name: "",
              content: "",
              placeholder: "Start typing...",
            },
          ],
        },
      ],
    },
  },
];

export const generateLayouts = async (projectId: string, theme: string) => {
  try {
    if (!projectId) {
      return {
        status: 400,
        error: "Project ID is required",
      };
    }

    const user = await currentUser();

    if (!user) {
      return {
        status: 403,
        error: "User not authenticated",
      };
    }

    const userExist = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    });

    if (!userExist || !userExist.subscription) {
      return {
        status: 403,
        error: !userExist?.subscription
          ? "User does not have an active subscription"
          : "User not found in the database",
      };
    }

    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
        isDeleted: false,
      },
    });

    if (!project) {
      return {
        status: 404,
        error: "Project not found",
      };
    }

    if (!project.outlines || project.outlines.length === 0) {
      return {
        status: 400,
        error: "Project does not have any outlines",
      };
    }

    const layouts = await generateLayoutJson(project.outlines);

    console.log(layouts);

    if (layouts.status !== 200) {
      return layouts;
    }

    await prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        slides: layouts.data,
        themeName: theme,
      },
    });

    return {
      status: 200,
      data: layouts.data,
    };
  } catch (error) {
    console.error("ERROR", error);
    return {
      status: 500,
      error: "Internal server error",
      data: [],
    };
  }
};

export const generateLayoutJson = async (outlineArray: string[]) => {
  const prompt = `
You are a highly creative AI that generates JSON-based layouts for presentations. I will provide you with an array of outlines, and for each outline, you must generate a unique and creative layout. Use the existing layouts as examples for structure and design, and generate unique designs based on the provided outline.

### Guidelines:
1. Write layouts based on the specific outline provided.
2. Use diverse and engaging designs, ensuring each layout is unique.
3. Adhere to the structure of existing layouts but add new styles or components if needed.
4. Fill placeholder data into content fields where required.
5. DO NOT include any image components or image placeholders in the layouts.
6. Focus on text-based components such as headings, paragraphs, lists, and cards.
7. Ensure proper formatting and schema alignment in the output JSON.

### Example Layouts:
${JSON.stringify(existingLayouts, null, 2)}

### Outline Array:
${JSON.stringify(outlineArray)}

For each entry in the outline array, generate:
- A unique JSON layout with creative text-based designs.
- Properly filled content with meaningful placeholder text.
- Clear and well-structured JSON data without any image components.

Output the layouts in JSON format as a single object with a "slides" array. Ensure there are no duplicate layouts across the array.

Expected format:
{
  "slides": [
    { /* slide 1 layout */ },
    { /* slide 2 layout */ },
    ...
  ]
}
`;

  try {
    console.log("Generating layouts...");

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
          messages: [
            {
              role: "system",
              content:
                'You generate JSON layouts for presentations. Always return valid JSON in the format: {"slides": [...]}',
            },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" }, // Request JSON response
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "API Response error:",
        response.status,
        response.statusText
      );
      return {
        status: response.status,
        error: `API request failed: ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (!data || !data.choices || !data.choices[0]) {
      console.error("Invalid API response structure:", data);
      return {
        status: 400,
        error: "No content generated from AI",
      };
    }

    const text = data.choices[0].message?.content?.trim() || "";

    if (!text) {
      return {
        status: 400,
        error: "Empty response from AI",
      };
    }

    // Clean and extract JSON safely (handles ```json ... ``` cases)
    let cleanedText = text
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    // Try to extract JSON if there's extra text
    const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedText = jsonMatch[0];
    }

    let jsonResponse;

    try {
      jsonResponse = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw text:", text);
      console.error("Cleaned text:", cleanedText);
      return {
        status: 500,
        error: "Failed to parse AI response as JSON",
      };
    }

    // Validate response structure
    if (!jsonResponse.slides || !Array.isArray(jsonResponse.slides)) {
      console.error(
        "Invalid JSON structure - missing slides array:",
        jsonResponse
      );
      return {
        status: 400,
        error: "AI response missing required 'slides' array",
      };
    }

    if (jsonResponse.slides.length === 0) {
      return {
        status: 400,
        error: "No slides generated",
      };
    }

    return {
      status: 200,
      data: jsonResponse,
    };
  } catch (error) {
    console.error("AI Error:", error);
    return {
      status: 500,
      error: error instanceof Error ? error.message : "Internal server error",
    };
  }
};
