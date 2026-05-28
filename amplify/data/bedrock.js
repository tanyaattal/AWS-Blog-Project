export function request(ctx) {
    const { notes = [], instruction = "" } = ctx.args;
  
    // Construct the prompt with the provided ingredients
    const prompt = `
            Use the bullet points as source material.
            User instructions for tone/style: ${instruction}
            Write a polished personal learning blog post.
            Do not use the same opening every time.
            Use 2–4 paragraphs.
            Add a natural title.
            Make it reflective but not overly formal.
            Do not invent facts beyond the notes.

            Notes: ${notes.join(", ")}`;
  
    // Return the request configuration
    return {
      resourcePath: "/model/anthropic.claude-sonnet-4-5-20250929-v1:0/invoke",
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            anthropic_version: "bedrock-2023-05-31",
            max_tokens: 1000,
            messages: [
                {
                role: "user",

                content: [
                    {
                    type: "text",
                    text: prompt,
                    },
                ],
                },
            ],
            }),
      },
    };
  }
  
  export function response(ctx) {
    const parsedBody = JSON.parse(ctx.result.body);
    return {
        body:parsedBody.content[0].text,
        error: null,
  };
}