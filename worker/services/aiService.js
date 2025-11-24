import fetch from "node-fetch";

export async function generateContentFromAI({ prompt, contentType }) {
    const typeTextMap = {
        "blog-outline": "a blog post outline",
        "product-description": "a product description",
        "social-media-caption": "a social media caption",
    };

    const typeText = typeTextMap[contentType] || "content";

    const fullPrompt = `Generate ${typeText} based on this topic: "${prompt}" not more than 100 words`;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OPENAI_API_KEY not set");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful content generator." },
                { role: "user", content: fullPrompt }
            ],
            temperature: 0.7
        })
    });

    if (!response.ok) {
        const errText = await response.text();
        console.error("OpenAI error:", errText);
        throw new Error("AI API call failed");
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() ?? "";
    return text;
}
