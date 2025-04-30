/**
 * Evento messageCreate - Disparado quando uma mensagem é enviada
 */
const commandHandler = require('../handlers/commandHandler');

module.exports = {
  name: 'messageCreate',
  once: false,
  async execute(message) {
    // Ignora mensagens de bots para evitar loops
    if (message.author.bot) return;
    
    try {
      // Passa a mensagem para o manipulador de comandos
      await commandHandler.handleMessage(message);
    } catch (error) {
      console.error('❌ Erro ao processar mensagem:', error);
    }
  }
};