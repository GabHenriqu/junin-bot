# 🤖 Juninho Bot

[![Licença MIT](https://img.shields.io/badge/Licença-MIT-green.svg)](LICENSE)
[![Discord.js](https://img.shields.io/badge/discord.js-v14-blue.svg)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-brightgreen)](https://nodejs.org/)

Um bot de Discord inteligente e personalizado que utiliza Large Language Models (LLM) através do [Ollama](https://ollama.ai/) para criar interações naturais com usuários, equipado com um sistema de memória persistente.

![Juninho Bot Banner](./images.jpg)

## ✨ Recursos

- 💬 **Conversa Natural** - Interações fluidas e contextuais usando Llama 3 via Ollama
- 🧠 **Sistema de Memória** - Armazena e recupera informações sobre os usuários
- 🚀 **Fácil de Usar** - Comandos intuitivos e interface amigável
- ⚙️ **Altamente Configurável** - Adapte o comportamento do bot às necessidades do seu servidor
- 🔒 **Seguro** - Processamento local de LLM para maior privacidade dos dados

## 📋 Comandos

| Comando | Descrição |
|---------|-----------|
| `!junin <mensagem>` | Inicia uma conversa com o Juninho |
| `!junin lembrar <informação>` | Armazena uma informação importante sobre você |
| `!junin memórias` | Exibe todas as memórias que o Juninho tem sobre você |
| `!junin esquecer <número>` | Remove uma memória específica da lista |
| `!junin reset` | Limpa todo o histórico de conversa e memórias |
| `!junin comandos` | Mostra a lista completa de comandos disponíveis |

## 🛠️ Instalação e Configuração

### Pré-requisitos

- [Node.js](https://nodejs.org/) v16 ou superior
- [Ollama](https://ollama.ai/) instalado e em execução no seu ambiente
- [Discord Bot Token](https://discord.com/developers/applications)
- [Git](https://git-scm.com/) (opcional, para clonar o repositório)

### Configuração Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/GabHenriqu/juninho-bot.git
   cd juninho-bot
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o ambiente**
   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env
   
   # Edite o arquivo .env com seu editor favorito
   # Adicione seu token do Discord e outras configurações
   nano .env
   ```

4. **Configure o Ollama**
   
   Certifique-se de que o Ollama está instalado e baixe o modelo Llama 3:
   ```bash
   ollama pull llama3
   ```

5. **Inicie o bot**
   ```bash
   npm start
   ```

## 🏗️ Estrutura do Projeto

```
juninho-bot/
├── src/
│   ├── index.js         # Ponto de entrada do aplicativo
│   ├── config.js        # Configurações e constantes
│   ├── commands/        # Implementação dos comandos
│   ├── events/          # Manipuladores de eventos do Discord
│   ├── handlers/        # Processadores de eventos e comandos
│   └── services/        # Serviços (IA, memória, etc.)
├── .env                 # Variáveis de ambiente (não versionado)
├── .env.example         # Exemplo de variáveis de ambiente
├── package.json         # Dependências e scripts
└── README.md            # Este arquivo
```

## 📊 Uso Avançado

### Personalização do Modelo LLM

O Juninho Bot é configurado para usar o modelo Llama 3 por padrão, mas você pode facilmente alterá-lo editando a configuração no arquivo `.env`:

```
OLLAMA_MODEL=llama3
```

### Ajustando Parâmetros de IA

Você pode ajustar os parâmetros de geração de texto (temperatura, top_p, etc.) no arquivo `src/services/aiService.js`.

## 🤝 Contribuindo

Contribuições são muito bem-vindas! Siga estas etapas para contribuir:

1. Faça um fork do repositório
2. Crie um branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. Commit suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Push para o branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## 📜 Licença

Este projeto está licenciado sob a [Licença MIT](LICENSE) - veja o arquivo LICENSE para detalhes.

## 📬 Contato

- **GitHub:** [GabHenriqu](https://github.com/GabHenriqu)
- **Discord:** gabhenrique

---

⭐ **Gostou do Juninho Bot?** Não se esqueça de dar uma estrela no GitHub! ⭐
