/**
 * Ponto de entrada principal do Juninho Bot
 */
const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config');
const EventHandler = require('./handlers/eventHandler');

// Inicializa o cliente do Discord com as intents necessárias
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Registra todos os eventos do diretório events
EventHandler.registerEvents(client);

// Login no Discord
client.login(config.token)
  .then(() => {
    console.log('🚀 Inicialização completa!');
  })
  .catch(error => {
    console.error('❌ Erro ao fazer login no Discord:', error);
    process.exit(1);
  });

// Trata erros não capturados
process.on('unhandledRejection', error => {
  console.error('🔥 Erro não tratado:', error);
});