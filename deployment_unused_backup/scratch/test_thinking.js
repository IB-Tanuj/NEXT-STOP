const apiKey = 'dahl_EbRtrWgbMJRN4jiepFa1Zju1xDuKxsXUP';

async function testThinkingControls() {
  const tests = [
    {
      name: "Standard prompt",
      body: {
        model: "MiniMaxAI/MiniMax-M2.7",
        messages: [
          { role: "system", content: "Return ONLY valid JSON. Do not include markdown or explanations." },
          { role: "user", content: "Generate 1 day itinerary for Agra in JSON: {\"itinerary\": [{\"day\": 1, \"title\": \"\", \"morning\": \"\", \"afternoon\": \"\", \"evening\": \"\", \"estimatedCost\": 500}]}" }
        ]
      }
    },
    {
      name: "Explicit no-thinking in system and user prompt",
      body: {
        model: "MiniMaxAI/MiniMax-M2.7",
        messages: [
          { role: "system", content: "You are a fast API endpoint. Do NOT think, reason, or output <think> tags. Start your response immediately with {" },
          { role: "user", content: "Generate 1 day itinerary for Agra in JSON: {\"itinerary\": [{\"day\": 1, \"title\": \"\", \"morning\": \"\", \"afternoon\": \"\", \"evening\": \"\", \"estimatedCost\": 500}]}. Output raw JSON only with zero thinking." }
        ]
      }
    },
    {
      name: "enable_thinking: false parameter",
      body: {
        model: "MiniMaxAI/MiniMax-M2.7",
        messages: [
          { role: "system", content: "Return ONLY valid JSON." },
          { role: "user", content: "Generate 1 day itinerary for Agra in JSON: {\"itinerary\": [{\"day\": 1, \"title\": \"\", \"morning\": \"\", \"afternoon\": \"\", \"evening\": \"\", \"estimatedCost\": 500}]}" }
        ],
        enable_thinking: false,
        thinking: { type: "disabled" }
      }
    }
  ];

  for (const t of tests) {
    console.log(`\nTesting: ${t.name}...`);
    const start = Date.now();
    try {
      const res = await fetch("https://inference.dahl.global/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(t.body)
      });
      const duration = Date.now() - start;
      const json = await res.json();
      console.log(`Status: ${res.status} in ${duration}ms`);
      const content = json.choices?.[0]?.message?.content || "";
      console.log(`Has <think>: ${content.includes('<think>')}, Length: ${content.length}`);
      if (content.includes('<think>')) {
        const thinkMatch = content.match(/<think>([\s\S]*?)<\/think>/);
        console.log(`Thinking chars: ${thinkMatch ? thinkMatch[0].length : 'unclosed'}`);
      }
      console.log("Snippet:", content.slice(0, 100).replace(/\n/g, ' '));
    } catch (e) {
      console.error("Error:", e.message);
    }
  }
}

testThinkingControls();
