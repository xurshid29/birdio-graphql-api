## Description

Sample GraphQL API server with Nestjs

## Installation

1. Duplicate .env.dist file and rename it as .env
2. (optional) Modify environment variables (inside .env)

Then:
```bash
$ docker compose up --build
```
DB seed:
```bash
$ docker compose run --rm nest-api npx prisma db seed
```

Open in browser (with default .env values):
```text
http://localhost:8088/graphql
```