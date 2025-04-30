# Juninho Bot

Um bot de Discord que utiliza LLM (Llama 3) via Ollama para interagir com usuários, com sistema de memória.

## Recursos

- Conversa natural usando LLM via Ollama
- Sistema de memória persistente para lembrar informações de usuários
- Comandos simples e intuitivos
- Configuração fácil

## Comandos

- `!junin <mensagem>` – Fala com o Juninho
- `!junin lembrar <informação>` – Faz o Juninho guardar algo importante sobre você
- `!junin memórias` – Mostra tudo que o Juninho guardou sobre você
- `!junin esquecer <número>` – Apaga uma memória específica
- `!junin reset` – Apaga todo o histórico e memórias
- `!junin comandos` – Mostra a lista de comandos disponíveis

## Configuração

### Requisitos

- Node.js v16+
- [Ollama](https://ollama.ai/) instalado e rodando localmente com o modelo llama3
- Discord Bot Token

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/GabHenriqu/juninho-bot.git
cd juninho-bot
```

2. Instale as dependências
```bash
npm install
```

3. Configure o arquivo `.env`
```bash
# Copie o arquivo .env.example
cp .env.example .env
# Edite-o com seu token do Discord
```

4. Inicie o bot
```bash
npm start
```

### Configurando o Ollama

Certifique-se de que você tem o Ollama rodando localmente e o modelo llama3 instalado:

```bash
ollama pull llama3
```

## Estrutura do Projeto

O projeto está organizado em módulos para facilitar a manutenção:

- `src/index.js` - Ponto de entrada
- `src/config.js` - Configurações
- `src/handlers/` - Manipuladores de eventos e comandos
- `src/commands/` - Implementação dos comandos
- `src/events/` - Manipuladores de eventos do Discord
- `src/services/` - Serviços como IA e gerenciamento de memória

## Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir um PR ou uma issue.