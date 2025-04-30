/**
 * Comando de ajuda - Lista todos os comandos disponíveis
 */
const config = require('../config');

module.exports = {
  name: 'help',
  description: 'Mostra a lista de comandos disponíveis',
  async execute(message) {
    try {
      const helpMessage = `📜 **Comandos do Juninho**\n
\`${config.prefix} <mensagem>\` – Fala com o Juninho.

\`${config.prefix} lembrar <informação>\` – Faz o Juninho guardar algo importante sobre você (ex: "gosto de bolo", "amo rock").

\`${config.prefix} memórias\` – Mostra tudo que o Juninho guardou de você com \`lembrar\`.

\`${config.prefix} esquecer <número>\` – Apaga uma memória específica (o número aparece na lista do comando acima).

\`${config.prefix} reset\` – Apaga **tudo** da memória (histórico e lembranças). Começa do zero.

\`${config.prefix} comandos\` – Mostra essa listinha aqui de novo.`;

      await message.reply(helpMessage);
    } catch (error) {
      console.error('❌ Erro ao executar comando de ajuda:', error);
      message.reply('⚠️ Ocorreu um erro ao mostrar a ajuda.');
    }
  }
};