const { GoogleGenerativeAI } = require('@google/generative-ai');

// Verify GEMINI_API_KEY is loaded
console.log('GEMINI_API_KEY loaded:', process.env.GEMINI_API_KEY ? 'Yes' : 'No');

// Initialize GoogleGenerativeAI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Export async function to generate description
async function generateDescription(prompt) {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating description:', error);
    throw error;
  }
}

// Temporary test: Call generateDescription with static prompt
(async () => {
  try {
    console.log('Testing AI service...');
    const testPrompt = 'Write a short description for a 2BHK apartment in Hyderabad.';
    const result = await generateDescription(testPrompt);
    console.log('AI Response:', result);
  } catch (error) {
    console.log('AI Test failed:', error.message);
  }
})();

module.exports = {
  generateDescription
};
