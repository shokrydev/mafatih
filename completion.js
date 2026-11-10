const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "YOUR_API_KEY_HERE"; TODO implement secret management

async function callQwen(promptText) {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: "qwen/qwen3-235b-a22b:free",
      messages: [
        { role: "user", content: promptText }
      ]
    })
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API error: ${error}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

// Example usage:
callQwen("Hello, how are you?")
  .then(answer => {
    console.log("Qwen response:", answer);
  })
  .catch(console.error);