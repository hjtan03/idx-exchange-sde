const express = require("express");
const router = express.Router();
const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a filter-extraction assistant for a real estate search API. Given a natural language property search query, extract the following fields into a JSON object:

{
  "city": string or null,
  "zipcode": string or null,
  "minPrice": number or null,
  "maxPrice": number or null,
  "beds": number or null,
  "baths": number or null,
  "minYearBuilt": number or null,
  "maxYearBuilt": number or null
}

Rules:
- Only extract a value if the query states or clearly implies a specific number or exact name.
- Never guess or estimate a number for vague qualitative language (e.g. "cheap," "spacious," "new," "affordable"). If the query doesn't give you a concrete number, return null for that field.
- Extract city names exactly as they appear in the query, without reformatting casing.
- "beds" and "baths" should be extracted as a minimum count (e.g. "3 bedroom" -> beds: 3), since the search treats these as "at least this many."
- Respond with ONLY the JSON object. No prose, no explanation, no markdown code fences, no leading or trailing text.`;

router.post("/natural", async (req, res) => {
    const { query } = req.body;

    const message = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: query }]
    });

    console.log(message.content[0].text);

    res.json({ raw: message.content[0].text });
});

module.exports = router;