/**
 * Comando principal de chat com a IA
 */
const aiService = require('../services/aiService');
const memoryService = require('../services/memoryService');

module.exports = {
  name: 'chat',
  description: 'Conversa com o Juninho',
  async execute(message, args) {
    const userId = message.author.id;
    const prompt = args[0] || '';

    if (!prompt) {
      return message.reply('❌ Escreve alguma coisa depois de `!junin`.');
    }

    try {
      // Indica que o bot está "digitando"
      await message.channel.sendTyping();

      // Obtém histórico e fatos do usuário
      const userHistory = memoryService.getUserHistory(userId);
      const userFacts = memoryService.getUserFacts(userId);

      // Prepara mensagens para a IA
      const messages = aiService.prepareMessages(prompt, userHistory, userFacts);

      // Envia para o modelo de IA
      const response = await aiService.chat(messages);

      if (!response.success) {
        return message.reply(`⚠️ ${response.error || 'Deu ruim falando com o LLaMA 3.'}`);
      }

      // Adiciona ao histórico
      memoryService.addToHistory(userId, 'user', prompt);
      memoryService.addToHistory(userId, 'assistant', response.content);

      // Divide a resposta se for muito longa
      if (response.content.length > 1900) {
        // Divide em pedaços de aproximadamente 1900 caracteres
        const chunks = splitTextIntoChunks(response.content, 1900);
        
        // Envia o primeiro chunk como resposta direta
        await message.reply(chunks[0]);
        
        // Envia os chunks restantes como mensagens normais
        for (let i = 1; i < chunks.length; i++) {
          await message.channel.send(chunks[i]);
        }
      } else {
        await message.reply(response.content);
      }
    } catch (err) {
      console.error('❌ Erro no comando de chat:', err);
      message.reply('⚠️ Deu ruim ao processar sua mensagem.');
    }
  }
};

/**
 * Divide texto em pedaços menores, tentando não quebrar palavras
 * @param {string} text - Texto para dividir
 * @param {number} maxLength - Tamanho máximo de cada pedaço
 * @returns {Array} - Array com os pedaços de texto
 */
function splitTextIntoChunks(text, maxLength) {
  const chunks = [];
  let currentChunk = '';
  
  // Divide por parágrafos primeiro
  const paragraphs = text.split('\n');
  
  for (const paragraph of paragraphs) {
    // Se o parágrafo já é maior que o máximo, precisamos dividir por palavras
    if (paragraph.length > maxLength) {
      const words = paragraph.split(' ');
      
      for (const word of words) {
        // Verifica se adicionar a palavra excede o limite
        if ((currentChunk + ' ' + word).length > maxLength && currentChunk.length > 0) {
          chunks.push(currentChunk);
          currentChunk = word;
        } else {
          currentChunk = currentChunk.length === 0 ? word : currentChunk + ' ' + word;
        }
      }
      
      // Adiciona uma quebra de linha se não formos começar um novo chunk
      if (currentChunk.length > 0 && currentChunk.length + 1 <= maxLength) {
        currentChunk += '\n';
      }
    } else {
      // Se adicionar o parágrafo excede o limite, começamos um novo chunk
      if ((currentChunk + '\n' + paragraph).length > maxLength && currentChunk.length > 0) {
        chunks.push(currentChunk);
        currentChunk = paragraph;
      } else {
        currentChunk = currentChunk.length === 0 ? paragraph : currentChunk + '\n' + paragraph;
      }
    }
  }
  
  // Adiciona o último chunk se não estiver vazio
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }
  
  return chunks;
}