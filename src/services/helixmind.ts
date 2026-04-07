type HelixMindChatResponse = {
  choices?: Array<{
    message?: {
      content?: unknown;
    };
  }>;
};

const DEFAULT_BASE_URL = "https://helixmind.online/v1";
const DEFAULT_MODEL = "gemini-3-flash-preview";

const HELIXMIND_API_KEY = process.env.HELIXMIND_API_KEY;
const HELIXMIND_BASE_URL = (process.env.HELIXMIND_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
const HELIXMIND_CHAT_URL = process.env.HELIXMIND_CHAT_URL || `${HELIXMIND_BASE_URL}/chat/completions`;
const HELIXMIND_MODEL = process.env.HELIXMIND_MODEL || DEFAULT_MODEL;

const extractTextContent = (content: unknown): string => {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (part && typeof part === "object" && "text" in part) {
          const text = (part as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        }

        return "";
      })
      .filter(Boolean)
      .join("\n")
      .trim();
  }

  return "";
};

const parseStructuredJson = (raw: string): any => {
  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced?.[1]) {
      return JSON.parse(fenced[1]);
    }

    const objectMatch = raw.match(/\{[\s\S]*\}/);
    if (objectMatch?.[0]) {
      return JSON.parse(objectMatch[0]);
    }

    throw new Error("Could not parse JSON from HelixMind response.");
  }
};

const requestImageAnalysis = async (prompt: string, imageData: string) => {
  if (!HELIXMIND_API_KEY) {
    throw new Error("Missing HELIXMIND_API_KEY. Add it to your environment variables.");
  }

  const response = await fetch(HELIXMIND_CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${HELIXMIND_API_KEY}`,
    },
    body: JSON.stringify({
      model: HELIXMIND_MODEL,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: "You are a scientific assistant. Return strictly valid JSON without markdown.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageData } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`HelixMind request failed (${response.status}): ${detail || response.statusText}`);
  }

  const payload = (await response.json()) as HelixMindChatResponse;
  const rawContent = extractTextContent(payload?.choices?.[0]?.message?.content);

  if (!rawContent) {
    throw new Error("HelixMind returned an empty analysis response.");
  }

  return parseStructuredJson(rawContent);
};

export const analyzeWater = async (imageData: string) => {
  const prompt = `
Act as an environmental scientist specializing in water quality.
Analyze this image for visual indicators of quality risks.

Return JSON only with this exact structure:
{
  "score": number,
  "risks": string[],
  "observations": string,
  "recommendations": string[]
}

Rules:
- score is 0 to 100, where 100 means pristine and 0 means critical risk.
- risks should be short phrases.
- observations should be concise and evidence-based.
- recommendations should be practical and safety-focused.
`;

  return requestImageAnalysis(prompt, imageData);
};

export const identifyPlant = async (imageData: string) => {
  const prompt = `
Act as a botanist. Identify the plant species in this image.

Return JSON only with this exact structure:
{
  "commonName": string,
  "scientificName": string,
  "family": string,
  "habitat": string,
  "conservationStatus": string,
  "description": string,
  "funFact": string,
  "isPoisonous": boolean,
  "warning": string
}

Rules:
- warning must be non-empty only when isPoisonous is true.
- keep all text factual, concise, and suitable for general users.
`;

  return requestImageAnalysis(prompt, imageData);
};
