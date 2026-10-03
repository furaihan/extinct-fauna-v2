# Extinct Fauna

A website about rare and extinct animals: browse species, read their stories, and
test your knowledge with timed quizzes.

This is **v2**, a full migration of the original
[`fp-pemrog-web`](https://github.com/furaihan/fp-pemrog-web) (React SPA + Express +
Sequelize) to a single **TanStack Start** application with **TypeORM** and
**shadcn/ui**. It is organized by feature module and uses **server functions only**
— there is no separate backend server.

## Tech stack

| Concern    | Choice                                                              |
| ---------- | ------------------------------------------------------------------- |
| Framework  | TanStack Start (RC) + TanStack Router (file-based, `routeToken: layout`) |
| Data       | TanStack Query, TanStack Form                                       |
| Runtime    | Bun, Vite 8, React 19, TypeScript (strict)                          |
| Database   | TypeORM + PostgreSQL                                                |
| UI         | shadcn/ui (Base UI) + Tailwind CSS v4                               |
| Auth       | httpOnly session cookie; passwords hashed with `Bun.password` (argon2id) |

## Requirements

- **Bun `1.4.2`** — this repo is Bun-only. Use `bun` / `bunx`, not `npm` or `node`.
- **PostgreSQL** running locally.

## Getting started

```sh
# 1. Install dependencies
bun install

# 2. Create your environment file and fill in the values
cp .env.example .env

# 3. Create the schema, import the legacy data, and seed the admin
bun run db:setup

# 4. Start the dev server
bun run dev
```

The dev server runs at **http://localhost:3100**.

## Environment variables

| Variable         | Required | Description                                                              |
| ---------------- | -------- | ------------------------------------------------------------------------ |
| `DATABASE_URL`   | yes      | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5432/extinct-fauna-v2` |
| `SESSION_SECRET` | yes      | 32+ random characters used to sign the session cookie                    |
| `ADMIN_USERNAME` | no       | Username for the seeded admin account (default `admin`)                  |
| `ADMIN_PASSWORD` | no       | Password for the seeded admin account (default `admin12345`)             |
| `NODE_ENV`       | no       | `development` (default) or `production`                                  |
| `PORT`           | no       | Port for the production server (`bun run start`); dev always uses 3100   |
| `LOG_LEVEL`      | no       | `fatal` \| `error` \| `warn` \| `info` (default) \| `debug` \| `trace` \| `silent` |

> The database password must not contain `@`, `/`, or `#` — these break
> `DATABASE_URL` parsing.

## Scripts

| Script                  | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `bun run dev`           | Start the Vite dev server on port 3100                             |
| `bun run build`         | Build the client and server bundles into `dist/`                   |
| `bun run start`         | Run the production server (`bun server.ts`)                        |
| `bun run preview`       | Preview the production build                                       |
| `bun run typecheck`     | Type-check with `tsc --noEmit`                                     |
| `bun run generate-routes` | Regenerate `src/routeTree.gen.ts` from the files in `src/routes/` |
| `bun run db:migrate`    | Apply pending TypeORM migrations                                   |
| `bun run db:import`     | Import the legacy MySQL dump into PostgreSQL                       |
| `bun run db:seed`       | Seed the admin account                                             |
| `bun run db:setup`      | `db:migrate` → `db:import` → `db:seed`                             |

## Database

The schema is created by a TypeORM migration (`src/db/migrations/`), and
`synchronize` is disabled — always change the schema through migrations.

`bun run db:import` reads the legacy MySQL dump **`extinct-fauna.sql`** from the
repository root and loads it into PostgreSQL. The import:

- is **idempotent** (it truncates the target tables before inserting),
- skips the unused Indonesian region tables (`provinsi`, `kabupaten`,
  `kecamatan`, `kelurahan`, `wilayah`) and `SequelizeMeta`,
- preserves the existing IDs: `animals.animal_id` stays an integer and legacy
  UUID (v4) primary keys are kept as-is.

Newly generated primary keys use **UUID v7** (`Bun.randomUUIDv7`).

> `extinct-fauna.sql` is **gitignored** (it is large). To run `db:import` you must
> place it in the repository root yourself. Skip `db:import` if you only need the
> empty schema and the seeded admin.

## Authentication note

Passwords are hashed with **argon2id** via `Bun.password`. Legacy accounts imported from the old database use bcrypt and are verified via `PREFIX_SALT` and `SUFFIX_SALT`. Upon successful login, legacy accounts are transparently rehashed to argon2id.

Expected, user-facing errors (wrong credentials, duplicate username/email) are
thrown as `AppError` and logged at `debug`, so they do not pollute server logs;
unexpected faults are logged at `warn`/`error`.

## Project structure

```
src/
├── routes/                  # File-based routes (flat; "_authed" is the auth guard layout)
│   ├── __root.tsx           # HTML shell, providers, header/footer
│   ├── index.tsx  about.tsx  login.tsx  signup.tsx
│   ├── explore/index.tsx  explore/$animalId.tsx
│   └── _authed/             # Requires a session
│       ├── profile/index.tsx  profile/edit.tsx
│       └── quiz/$animalId.tsx  quiz/result/$quizId.tsx
├── modules/                 # Feature modules
│   ├── auth/    server/{auth.functions,auth.middleware,guards,session,password.server,auth.repo}.ts
│   │            db/{account,user}.entity.ts  components/
│   ├── user/    server/{user.functions,user.repo}.ts  components/
│   ├── animal/  server/{animal.functions,animal.repo}.ts  db/{animal,description}.entity.ts  components/
│   └── quiz/    server/{quiz.functions,quiz.repo}.ts  db/{question,quiz,quiz-detail}.entity.ts  components/
├── db/          migrate.ts  import-old-dump.ts  migrations/  seeder/
├── lib/         typeorm.lib.ts  env.lib.ts  logger.lib.ts  id.lib.ts
└── shared/      ui/ (shadcn)  lib/  hook/  form/  components/
```

Conventions:

- Each module owns its `server/*.functions.ts` (server functions), `*.repo.ts`
  (TypeORM queries), entities, zod `schemas.ts`, `types.ts`, and components.
- Import aliases: `@/*` and `#/*` both map to `src/*`.

## Routes

| Route                       | Access   | Description                         |
| --------------------------- | -------- | ----------------------------------- |
| `/`                         | public   | Home: hero, fun facts, stats, quiz  |
| `/about`                    | public   | About the project and the team      |
| `/explore`                  | public   | Animal list with filters            |
| `/explore/$animalId`        | public   | Animal detail                       |
| `/login`                    | public   | Login                               |
| `/signup`                   | public   | Sign up                             |
| `/profile`                  | session  | Profile and recent quiz history     |
| `/profile/edit`             | session  | Edit profile                        |
| `/quiz/$animalId`           | session  | 5 questions, 30 seconds each        |
| `/quiz/result/$quizId`      | session  | Quiz result                         |

## Verification

Before committing changes, run:

```sh
bun run typecheck
bun run build
```

## Credits

Original project by **Team 8 (21-IF-08)**, Informatics, Universitas Amikom
Yogyakarta — [`fp-pemrog-web`](https://github.com/furaihan/fp-pemrog-web)
(Apache-2.0).
