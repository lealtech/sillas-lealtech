This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

Unit tests use [Vitest](https://vitest.dev) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [jest-dom](https://github.com/testing-library/jest-dom). Configuration lives in `vitest.config.mts`, with global setup in `vitest.setup.ts`.

```bash
npm test              # run Vitest in watch mode
npm run test:run      # run once (CI)
npm run test:coverage # run once with a coverage report in ./coverage
npm run test:e2e      # run Playwright end-to-end tests
```

Unit test files use the `*.test.ts` / `*.test.tsx` suffix and can live next to the code they test (for example `app/[locale]/page.test.tsx`). Playwright specs are kept in `tests/` and are excluded from Vitest. `playwright.config.ts` starts `npm run dev` automatically and runs the suite against `http://localhost:3000`. The admin auth spec needs the database seeded with the credentials from `.env`; `tests/global-setup.ts` runs `npm run admin:create` before the suite.

```bash
npx playwright test --project=chromium
```

## Internationalization

The project uses [next-intl](https://next-intl.dev) with locale-prefixed routes:

- English: `/en` (default)
- Portuguese: `/pt`
- Spanish: `/es`

When a visitor opens `/` (or any unprefixed page), `proxy.ts` inspects the browser's `Accept-Language` header and redirects to the best supported locale. Unsupported languages fall back to English. Users can switch languages from the links on the home page.

Translations live in `messages/{en,pt,es}.json`. Routing, request config and navigation helpers are in `i18n/`. To add a language, add it to `routing.ts`, create a matching messages file and add the corresponding route label.

## Admin area and authentication

The admin screens live under `app/[locale]/admin` and are available at `/{locale}/admin` (for example `/pt/admin`). Authentication uses [Auth.js (NextAuth v5)](https://authjs.dev) with the Credentials provider (email + password) and Prisma as the user store:

- `auth.config.ts` — shared, database-free config (JWT sessions, 8-hour lifetime, token callbacks) used by the proxy.
- `auth.ts` — Auth.js instance with the Credentials provider and the Prisma adapter.
- `app/api/auth/[...nextauth]/route.ts` — Auth.js route handlers.
- `app/[locale]/admin/login` — public login screen (the only admin route that does not require a session).
- `app/[locale]/admin/(protected)` — dashboard and any future admin screens. Its layout verifies the session on the server and redirects to the localized login page when absent.
- `proxy.ts` — combines the next-intl middleware with an early auth check so anonymous visitors are redirected before the admin segment renders.

Sessions are JWTs signed and encrypted with `AUTH_SECRET` and stored in an HttpOnly cookie. The Credentials provider only supports JWT sessions, so the Prisma `Session` table is not used yet; it is part of the standard Auth.js schema and is ready for OAuth providers.

Create or update the admin account with the variables in `.env` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, optional `ADMIN_NAME`):

```bash
npm run admin:create
```

## Database (development only)

PostgreSQL runs via Docker Compose:

```bash
docker compose up -d    # start the database
docker compose down     # stop it (the data volume is kept)
```

Credentials and the exposed port live in `.env`, which is ignored by git. Use `.env.example` as a template when setting up a new machine. The database is exposed on `localhost:5433` by default to avoid clashing with a local PostgreSQL on `5432`.

### Prisma

[Prisma ORM 7](https://www.prisma.io/docs/orm) is configured through `prisma.config.ts` and `prisma/schema.prisma`. The PostgreSQL schema is defined once in `.env` via `POSTGRES_SCHEMA` (`sillas-lealtech` in this project) and used by both the Prisma CLI and the runtime adapter.

- Connection URL: `DATABASE_URL` in `.env`
- CLI config: `prisma.config.ts` (appends `POSTGRES_SCHEMA` to the URL)
- Runtime client: `lib/prisma.ts` (singleton with `@prisma/adapter-pg`)
- Generated client: `generated/prisma/` (ignored by git; created by `postinstall`)

```bash
npm run db:generate  # regenerate the client after changing the schema
npm run db:validate  # validate schema.prisma
npm run db:migrate   # create and apply a migration in development
npm run db:deploy    # apply migrations (CI/production)
npm run db:push      # push the schema without creating a migration
npm run db:studio    # open Prisma Studio
```

The Docker init script (`docker/postgres/init.sh`) creates the schema on the first database initialization. If you change `POSTGRES_SCHEMA`, recreate the volume with `docker compose down -v && docker compose up -d`.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
