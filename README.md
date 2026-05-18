# Copa API — Seleções e jogadores (Copa do Mundo 2026)

API REST em **TypeScript** com **Fastify** que expõe as **48 seleções** qualificadas para a **Copa do Mundo de 2026** e os **jogadores** associados a cada uma. Os dados vêm de ficheiros **JSON** na pasta `data/` (sem dependência de base de dados).

## Requisitos

- **Node.js** 20 ou superior  
- **npm** (incluído com o Node)

## Instalação e execução local

```bash
npm install
npm run dev        # desenvolvimento (recarrega ao alterar ficheiros)
# ou
npm start          # execução simples
```

Por omissão o servidor escuta em **`http://0.0.0.0:8000`**. Podes alterar com variáveis de ambiente:

| Variável | Significado | Omissão |
|----------|-------------|---------|
| `PORT`   | Porta HTTP  | `8000`  |
| `HOST`   | Endereço de bind | `0.0.0.0` |

Exemplo (PowerShell):

```powershell
$env:PORT=3000; npm start
```

## Endpoints

| Método | Rota | Descrição |
|--------|------|------------|
| `GET` | `/health` | Estado do serviço (`{ "status": "ok" }`) |
| `GET` | `/teams` | Lista todas as seleções (inclui `logoUrl`, contagem de jogadores, etc.) |
| `GET` | `/teams/:countryCode` | Detalhe de uma seleção (código FIFA de 3 letras, ex.: `BRA`, `bra`) |
| `GET` | `/teams/:countryCode/players` | Seleção + todos os jogadores dessa nação; cada jogador inclui `countryName` |
| `GET` | `/players` | Lista de jogadores (opcional: `?countryCode=BRA`) |
| `GET` | `/players/:id` | Um jogador pelo `id` (ex.: `bra-alisson`) |

### Exemplos com `curl`

```bash
curl http://localhost:8000/health
curl http://localhost:8000/teams
curl http://localhost:8000/teams/BRA
curl http://localhost:8000/teams/BRA/players
curl "http://localhost:8000/players?countryCode=ARG"
curl http://localhost:8000/players/bra-alisson
```

## Modelo de dados (ficheiros JSON)

A aplicação lê **dois** ficheiros principais (validados com **Zod** em [`src/schema.ts`](src/schema.ts)):

### `data/teams.json`

- `tournament`: identificador fixo `FIFA World Cup 2026`
- `teams[]`: cada seleção com `countryCode`, `countryName`, `logoUrl` (bandeira via FlagCDN), `listType`, `asOf`, `sourceUrl`, `notes` (opcional)

### `data/players.json`

- `tournament`: `FIFA World Cup 2026`
- `players[]`: cada jogador com:
  - `id`: identificador estável (slug)
  - `name`
  - **`countryCode`**: código FIFA da **seleção** em que o jogador entra no conjunto de dados (nacionalidade na Copa)
  - `position` (opcional): `GK` \| `DEF` \| `MID` \| `FWD`
  - `club`, `age`, `imageUrl` (opcionais)
  - `enrichmentSource` (opcional): rasto de enriquecimento manual ou automatizado

Nas respostas JSON da API, os jogadores podem incluir também **`countryName`** (nome português da seleção), derivado de `teams.json`.

### `data/squads.json` (legado / cópia monolítica)

Pode existir um ficheiro com todas as seleções e listas de jogadores no mesmo documento. **A API em execução não usa este ficheiro** — usa apenas `teams.json` + `players.json`. Mantém-se útil como backup ou para gerar/atualizar os dois ficheiros principais com ferramentas externas.

## Docker

Imagem base **Node 22 Alpine**, utilizador não-root, healthcheck em `/health`.

```bash
docker build -t copa-api .
docker run --rm -p 8000:8000 copa-api
```

Ou com Compose:

```bash
docker compose up --build
```

Serviço disponível em `http://localhost:8000`.

**Dados dentro da imagem:** `teams.json` e `players.json` são copiados no *build*. Se alterares os JSON localmente e quiseres refletir sem reconstruir a imagem, monta a pasta:

```bash
docker run --rm -p 8000:8000 -v "%CD%\data:/app/data" copa-api
```

*(No PowerShell podes usar `${PWD}/data` em vez de `%CD%\data`.)*

## Estrutura do repositório

```
├── data/
│   ├── teams.json       # seleções + logos
│   ├── players.json     # jogadores
│   └── squads.json      # opcional / legado
├── src/
│   ├── server.ts        # arranque Fastify
│   ├── schema.ts        # contratos Zod
│   ├── data/
│   │   └── loadDataset.ts
│   └── routes/
│       ├── teams.ts
│       └── players.ts
├── Dockerfile
├── docker-compose.yml
├── .dockerignore
├── package.json
└── tsconfig.json
```

## Scripts npm

| Script | Função |
|--------|--------|
| `npm run dev` | Servidor com `tsx watch` |
| `npm start` | Servidor (`tsx src/server.ts`) |
| `npm run typecheck` | Verificação TypeScript (`tsc --noEmit`) |

## Notas

- Os dados são **curados** a partir de fontes públicas (por exemplo listas de álbum / imprensa); **`listType`** pode ser `album`, `pre-list`, `final` ou `provisional` consoante a origem.
- Qualquer atualização de convocados ou pré-listas deve ser feita editando **`data/teams.json`** e **`data/players.json`** (e validando o JSON) ou regenerando-os a partir do teu próprio pipeline.

## Licença

Projeto académico 
