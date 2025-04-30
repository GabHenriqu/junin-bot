/**
 * Manipulador de eventos do Discord
 */
const fs = require('fs');
const path = require('path');

class EventHandler {
  /**
   * Carrega e registra eventos para o cliente Discord
   * @param {Client} client - Cliente Discord.js
   */
  static registerEvents(client) {
    const eventsPath = path.join(__dirname, '../events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const event = require(filePath);
      
      // Verifica se o evento tem as propriedades necessárias
      if (!event.name || !event.execute) {
        console.warn(`⚠️ O evento ${file} está faltando a propriedade 'name' ou 'execute'`);
        continue;
      }
      
      try {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`✅ Evento registrado: ${event.name}`);
      } catch (error) {
        console.error(`❌ Erro ao registrar evento ${event.name}:`, error);
      }
    }
  }
}

module.exports = EventHandler;