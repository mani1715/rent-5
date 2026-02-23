const OpenAI = require('openai');

// Initialize OpenAI client with Emergent Universal Key
const client = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
  baseURL: 'https://integrations.emergentagent.com/api/v1'
});

// Export async function to generate description
async function generateDescription(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional real estate copywriter. Write compelling, attractive property descriptions that highlight key features and appeal to potential renters.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
}

// Test AI service on startup if key is available
if (process.env.EMERGENT_LLM_KEY && process.env.EMERGENT_LLM_KEY.length > 0) {
  console.log('EMERGENT_LLM_KEY loaded: Yes - AI features enabled');
} else {
  console.log('EMERGENT_LLM_KEY not provided - AI features disabled');
}

module.exports = {
  generateDescription
};
