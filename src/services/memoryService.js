/**
 * Serviço para gerenciar a memória do bot
 */
const fs = require('fs');
const path = require('path');
const config = require('../config');

class MemoryService {
  constructor() {
    this.memoryFilePath = config.memory.filePath;
    this.memory = {};
    this.loadMemory();
  }

  /**
   * Carrega a memória do arquivo
   */
  loadMemory() {
    try {
      // Verifica se o arquivo existe
      if (fs.existsSync(this.memoryFilePath)) {
        const data = fs.readFileSync(this.memoryFilePath, 'utf8');
        // Se o arquivo estiver vazio, inicializa com objeto vazio
        if (!data || data.trim() === '') {
          this.memory = {};
        } else {
          this.memory = JSON.parse(data);
        }
        console.log('✅ Memória carregada com sucesso');
      } else {
        console.log('⚠️ Arquivo de memória não encontrado. Iniciando com memória vazia.');
        this.memory = {};
        // Cria o arquivo de memória
        this.saveMemory();
      }
    } catch (error) {
      console.error('❌ Erro ao carregar memória:', error);
      console.warn("⚠️ Resetando memória devido a erro na leitura.");
      this.memory = {};
      this.saveMemory();
    }
  }

  /**
   * Salva a memória no arquivo
   */
  saveMemory() {
    try {
      // Cria diretório se não existir (apenas se o caminho tiver diretórios)
      const dir = path.dirname(this.memoryFilePath);
      if (dir !== '.' && !fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.memoryFilePath, JSON.stringify(this.memory, null, 2));
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar memória:', error);
      return false;
    }
  }

  /**
   * Inicializa a memória de um usuário se necessário
   * @param {string} userId - ID do usuário
   */
  initUserMemory(userId) {
    if (!this.memory[userId]) {
      this.memory[userId] = {
        history: [],
        facts: []
      };
    }
    
    // Garante que as propriedades existam
    if (!this.memory[userId].history) this.memory[userId].history = [];
    if (!this.memory[userId].facts) this.memory[userId].facts = [];
  }

  /**
   * Adiciona uma mensagem ao histórico
   * @param {string} userId - ID do usuário
   * @param {string} role - Papel (user/assistant)
   * @param {string} content - Conteúdo da mensagem
   */
  addToHistory(userId, role, content) {
    this.initUserMemory(userId);
    
    this.memory[userId].history.push({ 
      role, 
      content,
      timestamp: new Date().toISOString()
    });
    
    // Limita o tamanho do histórico
    if (this.memory[userId].history.length > config.memory.maxHistoryLength) {
      this.memory[userId].history = this.memory[userId].history.slice(-config.memory.maxHistoryLength);
    }
    
    return this.saveMemory();
  }

  /**
   * Adiciona um fato sobre o usuário
   * @param {string} userId - ID do usuário
   * @param {string} fact - Fato sobre o usuário
   */
  addFact(userId, fact) {
    this.initUserMemory(userId);
    
    this.memory[userId].facts.push(fact);
    return this.saveMemory();
  }

  /**
   * Remove um fato sobre o usuário
   * @param {string} userId - ID do usuário
   * @param {number} index - Índice do fato a ser removido
   */
  removeFact(userId, index) {
    this.initUserMemory(userId);
    
    if (index < 0 || index >= this.memory[userId].facts.length) {
      return { success: false, message: 'Índice inválido' };
    }
    
    const removedFact = this.memory[userId].facts.splice(index, 1)[0];
    const success = this.saveMemory();
    
    return { 
      success, 
      fact: removedFact,
      message: success ? `Fato removido: "${removedFact}"` : 'Erro ao remover fato'
    };
  }

  /**
   * Obtém todos os fatos de um usuário
   * @param {string} userId - ID do usuário
   */
  getUserFacts(userId) {
    this.initUserMemory(userId);
    return this.memory[userId].facts;
  }

  /**
   * Obtém o histórico de conversas de um usuário
   * @param {string} userId - ID do usuário
   */
  getUserHistory(userId) {
    this.initUserMemory(userId);
    return this.memory[userId].history;
  }

  /**
   * Reseta a memória de um usuário
   * @param {string} userId - ID do usuário
   */
  resetUserMemory(userId) {
    this.memory[userId] = {
      history: [],
      facts: []
    };
    
    return this.saveMemory();
  }
}

module.exports = new MemoryService();