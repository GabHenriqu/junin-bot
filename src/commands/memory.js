/**
 * Comandos relacionados à memória do bot
 */
const memoryService = require('../services/memoryService');

module.exports = {
  name: 'memory',
  description: 'Gerencia a memória do bot (fatos sobre usuários)',
  async execute(message, args, action = 'list') {
    const userId = message.author.id;

    switch (action) {
      case 'add':
        return await addMemory(message, args, userId);
      case 'list':
        return await listMemories(message, userId);
      case 'remove':
        return await removeMemory(message, args, userId);
      case 'reset':
        return await resetMemory(message, userId);
      default:
        return message.reply('❌ Ação de memória inválida.');
    }
  }
};

/**
 * Adiciona uma memória para o usuário
 * @param {Object} message - Objeto de mensagem do Discord
 * @param {Array} args - Argumentos do comando
 * @param {string} userId - ID do usuário
 */
async function addMemory(message, args, userId) {
  const fact = args.join(' ').trim();
  
  if (!fact) {
    return message.reply('⚠️ Fala o que tu quer que eu lembre.');
  }
  
  // Verifica se o fato é demasiado longo
  if (fact.length > 500) {
    return message.reply('⚠️ Essa informação tá muito grande. Tenta algo mais curto (máximo 500 caracteres).');
  }
  
  const success = memoryService.addFact(userId, fact);
  
  if (success) {
    return message.reply('💾 Tá lembrado. Vou guardar isso aí.');
  } else {
    return message.reply('❌ Deu algum erro ao salvar. Tenta de novo mais tarde.');
  }
}

/**
 * Lista todas as memórias do usuário
 * @param {Object} message - Objeto de mensagem do Discord
 * @param {string} userId - ID do usuário
 */
async function listMemories(message, userId) {
  const facts = memoryService.getUserFacts(userId);
  
  if (!facts || facts.length === 0) {
    return message.reply('🤷‍♂️ Não tem nada salvo pra aqui.');
  }
  
  // Formata a lista de fatos
  const formattedList = facts.map((fact, index) => `${index + 1}. ${fact}`).join('\n');
  
  // Divide em partes se for muito grande
  if (formattedList.length > 1900) {
    const chunks = [];
    let currentChunk = '🧠 **Memórias salvas:**\n';
    
    for (let i = 0; i < facts.length; i++) {
      const line = `${i + 1}. ${facts[i]}\n`;
      
      // Se adicionar essa linha exceder o limite, começamos um novo chunk
      if (currentChunk.length + line.length > 1900) {
        chunks.push(currentChunk);
        currentChunk = `🧠 **Memórias salvas (continuação):**\n${line}`;
      } else {
        currentChunk += line;
      }
    }
    
    // Adiciona o último chunk se não estiver vazio
    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }
    
    // Envia todos os chunks
    await message.reply(chunks[0]);
    for (let i = 1; i < chunks.length; i++) {
      await message.channel.send(chunks[i]);
    }
  } else {
    await message.reply(`🧠 **Memórias salvas:**\n${formattedList}`);
  }
}

/**
 * Remove uma memória específica
 * @param {Object} message - Objeto de mensagem do Discord
 * @param {Array} args - Argumentos do comando
 * @param {string} userId - ID do usuário
 */
async function removeMemory(message, args, userId) {
  const index = parseInt(args[0]) - 1; // Converte para base zero
  
  if (isNaN(index) || index < 0) {
    return message.reply('⚠️ Preciso de um número válido pra apagar. Usa `!junin memórias` pra ver a lista com os números.');
  }
  
  const result = memoryService.removeFact(userId, index);
  
  if (result.success) {
    return message.reply(`🗑️ Esqueci: "${result.fact}"`);
  } else {
    return message.reply('⚠️ Índice inválido. Vê aí direitinho.');
  }
}

/**
 * Reseta toda a memória do usuário
 * @param {Object} message - Objeto de mensagem do Discord
 * @param {string} userId - ID do usuário
 */
async function resetMemory(message, userId) {
  const success = memoryService.resetUserMemory(userId);
  
  if (success) {
    return message.reply('🧼 Memória resetada. Tamo zerado.');
  } else {
    return message.reply('❌ Deu erro ao resetar a memória. Tenta de novo mais tarde.');
  }
}