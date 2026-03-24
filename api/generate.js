export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
  }

  try {
    const { testDate, selectedDays, level, targetScore, resources, hp } = req.body;

    // Anti-Spam Honeypot Check
    if (hp && hp.length > 0) {
      console.log("Spam bot detected via honeypot.");
      return res.status(200).json({ planTitle: "Access Denied", weeks: [] });
    }

    // Calculate weeks
    const dateNow = new Date();
    const tDate = new Date(testDate);
    let timeDiff = tDate.getTime() - dateNow.getTime();
    if (timeDiff < 0) timeDiff = 0;
    
    let weeksDiff = Math.ceil(timeDiff / (1000 * 3600 * 24 * 7));
    if (weeksDiff <= 0) weeksDiff = 1;
    if (weeksDiff > 12) weeksDiff = 12; // Cap at 12 weeks to prevent timeouts

    const systemInstruction = `You are an elite, highly structured SAT tutor. Generate a customized, week-by-week study plan based STRICTLY on the provided JSON schema.
PHILOSOPHY: Maximize score improvement via targeted practice, deep review, and pattern recognition. Review is more important than solving.
Constraints:
- The plan must span exactly ${weeksDiff} weeks.
- The student is at ${level} level. Target score: ${targetScore || 'Maximum Improvement'}.
- Resources available: ${resources.join(', ') || 'Standard Practice Test materials'}.
- Days available per week: ${selectedDays.join(', ')}. YOU MUST ONLY SCHEDULE TASKS ON THESE SPECIFIC DAYS. If they selected 3 days, there must be exactly 3 days in each week's plan matching those names.
- Day "type" must be exactly one of: "Test Day", "Review Day", "Reading Day", "Practice Day", "Light Review Day".
- Final week must be a Tapering Phase: reduce workload, review mistakes, 3 days before test NO heavy studying ("Light Review Day").
Ensure tasks are highly specific (e.g. "Complete Module 1 of Reading on Bluebook"). Do not recommend ACT or PSAT. Focus on Digital SAT logic.`;

    const requestBody = {
      contents: [{
        parts: [{ text: "Please generate the customized SAT study plan." }]
      }],
      systemInstruction: {
        parts: [{ text: systemInstruction }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            planTitle: { type: "STRING", description: "Catchy title combining week count and level e.g. '12-Week Advanced Mastery Plan'" },
            weeks: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  weekNumber: { type: "INTEGER" },
                  title: { type: "STRING", description: "e.g., Week 1 - Diagnostics, or Week 12 - Final Taper" },
                  days: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        dayName: { type: "STRING", description: "e.g., Monday. Must be from the selected days." },
                        type: { type: "STRING", description: "Must be Test Day, Review Day, Reading Day, Practice Day, or Light Review Day" },
                        duration: { type: "STRING", description: "e.g., 2.5 Hours" },
                        focus: { type: "STRING" },
                        tasks: { type: "ARRAY", items: { type: "STRING" } },
                        hasVocab: { type: "BOOLEAN", description: "True if they should extract vocabulary" }
                      },
                      required: ["dayName", "type", "duration", "focus", "tasks", "hasVocab"]
                    }
                  }
                },
                required: ["weekNumber", "title", "days"]
              }
            }
          },
          required: ["planTitle", "weeks"]
        }
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to generate plan securely.');
    }

    const aiText = data.candidates[0].content.parts[0].text;
    const jsonOutput = JSON.parse(aiText);

    return res.status(200).json(jsonOutput);

  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
