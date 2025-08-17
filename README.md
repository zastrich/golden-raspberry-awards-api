# MVP API – Fastify + TypeScript (Node 22)

API REST mínima para o desafio: calcula o(s) produtor(es) com **menor** e **maior** intervalo entre vitórias consecutivas, a partir de um CSV.

## Requisitos
- Node.js **22**+
- npm

# 🚀 Rodar a aplicação da forma padrão

## 1. Instalação de dependências
```bash
npm install
```

## 2. Configurando as ENVs
#### Copie o arquivo `example.env` para `.env` e ajuste as configurações conforme achar necessário.

## 3. Criação do Database a partir do Schema
```bash
npm run prisma:start
```

## 4. Build
```bash
npm run build
```

## 5. Iniciar
```bash
npm start
```

Testar em [http://localhost:3000/api/movies/maxMinWinIntervalForProducers](http://localhost:3000/api/movies/maxMinWinIntervalForProducers)

# 🧩 Rodar a aplicação para desenvolvimento

## 1. Instalação de dependências
```bash
npm install
```

## 2. Configurando as ENVs
#### Copie o arquivo `example.env` para `.env` e ajuste as configurações conforme achar necessário.

## 3. Criação do Database a partir do Schema
```bash
npm run prisma:start
```

## 4. Iniciar no modo Desenvolvimento
```bash
npm run dev
```
Testar em [http://localhost:3000/api/movies/maxMinWinIntervalForProducers](http://localhost:3000/api/movies/maxMinWinIntervalForProducers)


## Endpoint
- `GET /api/movies/maxMinWinIntervalForProducers`
  - **200 OK**
  ```json
  {
    "min": [{"producer":"...", "interval":1, "previousWin":1990, "followingWin":1991}],
    "max": [{"producer":"...", "interval":10, "previousWin":2000, "followingWin":2010}]
  }
  ```

## Dados
- Por padrão usa `./data/movies.csv`.
- Pode customizar via `CSV_PATH = /caminho/arquivo.csv` no arquivo `.env`
- O CSV deve ter as colunas: `year`, `title`, `producer`, `winner` (a coluna `studios` é opcional)
- A forma de usar o CSV na base pode ser configurado no arquivo `.env` em `DB_INIT_STRATEGY`:
  - `TRUNCATE` para apagar os dados antigos (**`modo padrão`**)
  - `APPEND` para adicionar novos dados sem apagar os antigos respeitando as chaves primárias

## Testes
```bash
npm test
```

## Estrutura
```text
src/
  app.ts           # monta fastify e carrega rotas
  server.ts        # inicia servidor
  routes/intervals.ts
  services/intervals.ts
  db/index.ts
  loaders/csv.ts
data/movies.csv    # dataset de exemplo
tests/intervals.e2e.test.ts
```