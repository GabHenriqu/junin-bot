/**
 * Serviço para interagir com a API do Ollama
 */
const axios = require('axios');
const config = require('../config');

class AIService {
  constructor() {
    this.apiUrl = config.ollama.apiUrl;
    this.model = config.ollama.model;
  }

  /**
   * Envia uma solicitação para a API do Ollama
   * @param {Array} messages - Array de mensagens no formato {role, content}
   * @returns {Promise<string>} - Resposta da API
   */
  async chat(messages) {
    try {
      const response = await axios.post(`${this.apiUrl}/api/chat`, {
        model: this.model,
        messages: messages,
        stream: false
      }, {
        timeout: 30000 // 30 segundos de timeout
      });

      return {
        success: true,
        content: response.data.message.content
      };
    } catch (error) {
      console.error('❌ Erro na API do Ollama:', error.message);
      
      // Mensagens de erro mais descritivas
      if (error.code === 'ECONNREFUSED') {
        return {
          success: false,
          error: 'Não foi possível conectar ao servidor Ollama. Verifique se ele está rodando.'
        };
      }
      
      if (error.response) {
        return {
          success: false,
          error: `Erro ${error.response.status}: ${error.response.data?.error || 'Erro desconhecido na API'}`
        };
      }
      
      return {
        success: false,
        error: error.message || 'Erro desconhecido ao se comunicar com a API'
      };
    }
  }

  /**
   * Prepara mensagens para envio à API, incluindo prompts do sistema
   * @param {string} userPrompt - Prompt do usuário
   * @param {Array} history - Histórico de conversas
   * @param {Array} facts - Fatos sobre o usuário
   * @returns {Array} - Array de mensagens formatado
   */
  prepareMessages(userPrompt, history, facts) {
    const messages = [
      // Prompt do sistema
      {
        role: "system",
        content: config.systemPrompt
      }
    ];

    // Adiciona fatos sobre o usuário
    if (facts && facts.length > 0) {
      facts.forEach(fact => {
        messages.push({
          role: 'system',
          content: `Lembrete permanente: ${fact}`
        });
      });
    }

    // Adiciona histórico de conversas (limitado pelo config)
    if (history && history.length > 0) {
      // Usa apenas as mensagens mais recentes
      const recentHistory = history.slice(-config.memory.maxHistoryLength);
      recentHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });
    }

    // Adiciona a mensagem atual do usuário
    messages.push({
      role: 'user',
      content: userPrompt
    });

    return messages;
  }
}

module.exports = new AIService();