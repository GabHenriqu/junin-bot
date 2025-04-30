/**
 * Manipulador de comandos
 */
const fs = require('fs');
const path = require('path');
const config = require('../config');

class CommandHandler {
  constructor() {
    this.commands = new Map();
    this.prefix = config.prefix;
    this.loadCommands();
  }

  /**
   * Carrega todos os comandos do diretório commands
   */
  loadCommands() {
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      
      // Valida se o comando tem as propriedades necessárias
      if ('name' in command && 'execute' in command) {
        this.commands.set(command.name, command);
        console.log(`✅ Comando carregado: ${command.name}`);
      } else {
        console.log(`⚠️ O comando ${file} está faltando a propriedade 'name' ou 'execute'`);
      }
    }
  }

  /**
   * Verifica se uma mensagem é um comando e executa
   * @param {Object} message - Objeto de mensagem do Discord.js
   * @returns {boolean} - True se foi um comando processado, false caso contrário
   */
  async handleMessage(message) {
    const content = message.content.trim();
    
    // Verifica se a mensagem começa com o prefixo
    if (!content.startsWith(this.prefix)) {
      return false;
    }

    // Remove o prefixo e divide em argumentos
    const args = content.slice(this.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase() || '';
    
    // Se não há comando (apenas o prefixo), considera como chat
    if (!commandName) {
      // Trata como comando de chat sem argumentos
      const chatCommand = this.commands.get('chat');
      if (chatCommand) {
        try {
          await chatCommand.execute(message, ['']);
        } catch (error) {
          console.error('❌ Erro ao executar comando de chat:', error);
          message.reply('❌ Ocorreu um erro ao processar seu comando.');
        }
        return true;
      }
      return false;
    }

    // Comandos especiais
    switch (commandName) {
      case 'lembrar':
        const memoryCommand = this.commands.get('memory');
        if (memoryCommand) {
          try {
            await memoryCommand.execute(message, args, 'add');
          } catch (error) {
            console.error('❌ Erro ao executar comando de memória:', error);
            message.reply('❌ Ocorreu um erro ao processar seu comando.');
          }
        }
        return true;
        
      case 'memórias':
      case 'memorias':
        const listCommand = this.commands.get('memory');
        if (listCommand) {
          try {
            await listCommand.execute(message, args, 'list');
          } catch (error) {
            console.error('❌ Erro ao listar memórias:', error);
            message.reply('❌ Ocorreu um erro ao processar seu comando.');
          }
        }
        return true;
        
      case 'esquecer':
        const forgetCommand = this.commands.get('memory');
        if (forgetCommand) {
          try {
            await forgetCommand.execute(message, args, 'remove');
          } catch (error) {
            console.error('❌ Erro ao remover memória:', error);
            message.reply('❌ Ocorreu um erro ao processar seu comando.');
          }
        }
        return true;
        
      case 'reset':
        const resetCommand = this.commands.get('memory');
        if (resetCommand) {
          try {
            await resetCommand.execute(message, args, 'reset');
          } catch (error) {
            console.error('❌ Erro ao resetar memória:', error);
            message.reply('❌ Ocorreu um erro ao processar seu comando.');
          }
        }
        return true;
        
      case 'comandos':
      case 'ajuda':
      case 'help':
        const helpCommand = this.commands.get('help');
        if (helpCommand) {
          try {
            await helpCommand.execute(message, args);
          } catch (error) {
            console.error('❌ Erro ao executar comando de ajuda:', error);
            message.reply('❌ Ocorreu um erro ao processar seu comando.');
          }
        }
        return true;
        
      default:
        // Se não foi um comando especial, trata a mensagem inteira como input para o chat
        const chatCmd = this.commands.get('chat');
        if (chatCmd) {
          try {
            // Reconstrói o prompt original
            const fullPrompt = `${commandName} ${args.join(' ')}`.trim();
            await chatCmd.execute(message, [fullPrompt]);
          } catch (error) {
            console.error('❌ Erro ao executar comando de chat:', error);
            message.reply('❌ Ocorreu um erro ao processar seu comando.');
          }
        }
        return true;
    }
  }
}

module.exports = new CommandHandler();