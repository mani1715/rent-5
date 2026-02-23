const OpenAI = require('openai');

// Use INTEGRATION_PROXY_URL from environment or default
const baseURL = process.env.INTEGRATION_PROXY_URL 
  ? `${process.env.INTEGRATION_PROXY_URL}/openai/v1`
  : 'https://integrations.emergentagent.com/openai/v1';

// Initialize OpenAI client with Emergent Universal Key
const client = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
  baseURL: baseURL
});

console.log('AI Service initialized with baseURL:', baseURL);

// Export async function to generate description
async function generateDescription(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: 'You are a professional real estate copywriter. Write compelling, attractive property descriptions that highlight key features and appeal to potential renters. Keep descriptions around 150 words.'
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
    console.error('Error generating description:', error.message);
    throw error;
  }
}

// Log AI service status on startup
if (process.env.EMERGENT_LLM_KEY && process.env.EMERGENT_LLM_KEY.length > 0) {
  console.log('EMERGENT_LLM_KEY loaded: Yes - AI features enabled');
} else {
  console.log('EMERGENT_LLM_KEY not provided - AI features disabled');
}

module.exports = {
  generateDescription
};
