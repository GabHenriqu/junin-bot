/**
 * Configurações globais do bot
 */
const path = require('path');

// Carrega o arquivo .env da pasta raiz do projeto
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  // Discord
  token: process.env.DISCORD_TOKEN,
  prefix: '!junin',
  
  // Ollama
  ollama: {
    apiUrl: process.env.OLLAMA_API_URL || 'http://localhost:11434',
    model: process.env.OLLAMA_MODEL || 'llama3',
  },
  
  // Configurações de memória
  memory: {
    filePath: process.env.MEMORY_FILE || './memory.json',
    maxHistoryLength: parseInt(process.env.MAX_HISTORY_LENGTH) || 15
  },
  
  // Sistema
  systemPrompt: "Você é um assistente chamado Juninho Ruindade Pura. Responda sempre em português do Brasil, de forma direta, informal e com humor rápido. Nunca use outro idioma."
};