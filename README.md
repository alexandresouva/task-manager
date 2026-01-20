# Task Manager 📝

![Página inicial do Task Manager, exibindo tarefas pendentes e concluídas](/public/home.png)

Aplicação de **gerenciamento de tarefas** desenvolvida em **Angular**, com foco forte em **TDD (Test-Driven Development)** e **testes E2E com Cypress**.

---

## ✨ Visão Geral

O **Task Manager** permite criar, listar, atualizar, concluir e remover tarefas, separando-as por status (pendentes e concluídas). Mais do que a funcionalidade em si, o principal objetivo do projeto é:

- Praticar **TDD** e seus benefícios
- Testes focados em **comportamento**, não em implementação
- Uso de **helpers e abstrações** para reduzir duplicação
- Estruturar testes de forma **legível e sustentável**

---

## 🚀 Testes E2E com Cypress

O projeto conta com testes _end-to-end_ cobrindo os principais fluxos da aplicação:

- Listagem de tarefas
- Criação de uma nova tarefa
- Marcar tarefa como concluída
- Remoção de tarefa
- Estados vazios (empty states)

Destaques:

- Uso de **Page Objects**
- Integração com **Cypress Cloud** para histórico e visibilidade

---

## 🛠️ Stack Utilizada

### Front-end

- **Angular**
- **TypeScript**
- **RxJS**
- **DaisyUI**
- **Tailwind CSS**

### Testes

- **Jest** (unitários)
- **Cypress** (E2E)
- **Cypress Cloud**

### Ferramentas

- **Nx** (monorepo e orquestração)
- **ESLint**
- **Prettier**
- **dotenv** (variáveis de ambiente)

---

## ▶️ Como rodar o projeto

### Instalação

```bash
npm install
```

### Servir a aplicação

```bash
# Apenas front
npm start

# Front e JSON server
npm run start:workspace
```

A aplicação ficará disponível em:

```
http://localhost:4200
```

---

## 🧪 Rodando os testes

### Testes unitários

```bash
npx nx test task-manager
```

### Testes E2E (Cypress)

```bash
# Browser
npm run test:e2e

# Headless
npm run test:e2e:ci
```

### Cypress com recording (Cloud)

Crie um arquivo `.env` na raiz do projeto:

```env
CYPRESS_RECORD_KEY=your-record-key-here
```

Depois execute:

```bash
npm run e2e:record
```

> ⚠️ O arquivo `.env` **não deve ser versionado**. Use `.env.example` como referência.
