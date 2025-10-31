"use server";

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
