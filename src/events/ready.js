/**
 * Evento ready - Disparado quando o bot está pronto
 */
module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
      const guilds = client.guilds.cache.size;
      console.log(`✅ Bot online como ${client.user.tag} em ${guilds} servidor(es)`);
      
      // Define status personalizado
      client.user.setPresence({
        activities: [{ name: '!junin comandos' }],
        status: 'online'
      });
    }
  };