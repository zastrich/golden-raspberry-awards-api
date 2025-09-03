# MVP API – Fastify + TypeScript (Node 22)

API REST mínima para o desafio: calcula o(s) produtor(es) com **menor** e **maior** intervalo entre vitórias consecutivas, a partir de um CSV.

## Requisitos
- Node.js **22**+
- npm
- Um arquivo .CSV conforme o exemplo em `data/movies.csv`
- TypeORM

# 🚀 Rodar a aplicação da forma padrão

```bash
npm run make:all
```

# 👣 Rodar a aplicação passo a passo

## 1. Instalação de dependências
```bash
npm install
```

## 2. Configurando as ENVs
#### Copie o arquivo `example.env` para `.env` e ajuste as configurações conforme achar necessário.

## 3. Iniciar
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

## 3. Iniciar no modo Desenvolvimento
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
- O banco de dados é **em memória** (SQLite) e é populado a cada inicialização da aplicação com os dados do CSV.

## Testes
```bash
npm test
```

## Estrutura
```text
src/
  app.ts                     # Configures Fastify and loads routes
  server.ts                  # Starts the server
  controllers/
    producersController.ts   # Logic for producers endpoints
  db/
    dataSource.ts            # TypeORM data source initialization
    entities/                # TypeORM entity definitions
      Movie.ts
      MovieProducer.ts
      MovieStudio.ts
      Producer.ts
      Studio.ts
      index.ts
      types.ts
    repositories/            # Functions for database operations (insertions)
      insertMovie.ts
      insertProducer.ts
      insertStudio.ts
    index.ts                 # Exports dataSource
  helpers/
    string.helpers.ts        # Utility functions (e.g., splitNames)
  loaders/
    index.ts                 # Exports loadCsvIntoDb
    loadCsvIntoDb.ts         # Loads CSV data into the database
    readCsvFile.ts           # Reads and parses CSV file
    types.ts                 # Type definitions for CSV data
  routes/
    index.ts                 # Registers main routes
    movies/
      index.ts               # Exports movie-related routes
      maxMinWinIntervalForProducers.ts # Endpoint for min/max win intervals
data/
  movies.csv                 # Consumed default dataset
tests/
  maxMinWinIntervalForProducers.e2e.test.ts # E2E tests for producer intervals
  types.ts                   # Type definitions for tests
```