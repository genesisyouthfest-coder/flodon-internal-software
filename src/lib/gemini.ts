export async function generateOutreachEmail(variables: {
  recipientName: string;
  recipientRole?: string;
  businessName?: string;
  industry?: string;
  serviceName: string;
  serviceDescription: string;
  promptTemplate: string;
}) {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not set in environment variables.");
  }

  const prompt = variables.promptTemplate
    .replace("{{NAME}}", variables.recipientName)
    .replace("{{ROLE}}", variables.recipientRole || "Owner/Operator")
    .replace("{{BUSINESS_NAME}}", variables.businessName || "your business")
    .replace("{{INDUSTRY}}", variables.industry || "your industry")
    .replace("{{SERVICE_NAME}}", variables.serviceName)
    .replace("{{SERVICE_DESCRIPTION}}", variables.serviceDescription)
    + "\n\nIMPORTANT: Return the response in the following JSON format exactly, with no extra text:\n{ \"subject\": \"...\", \"body\": \"...\" }";

  // Use the exact URL format with API key embedded as per common successful patterns
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage = response.statusText;
    try {
      const errorJson = JSON.parse(errorBody);
      errorMessage = errorJson.error?.message || errorMessage;
      console.error("Gemini API Error Detail:", JSON.stringify(errorJson, null, 2));
    } catch {
      console.error("Gemini API Error Raw:", errorBody);
    }
    throw new Error(`Gemini API failed: ${errorMessage}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanText = jsonMatch ? jsonMatch[0] : text.trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.warn("Parsing failed, using fallback extraction", e);
    const lines = text.split('\n');
    let subject = "";
    const bodyLines = [];

    for (const line of lines) {
      if (line.toLowerCase().startsWith('subject:')) {
        subject = line.replace(/subject:/i, "").trim();
      } else {
        bodyLines.push(line);
      }
    }

    if (!subject) subject = lines[0]?.trim() || "Outreach from Flodon";

    return {
      subject: subject,
      body: bodyLines.join('\n').trim()
    };
  }
}
