# Poll App

![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white)
![Vitest](https://img.shields.io/badge/Tests-Vitest-6E9F18?logo=vitest&logoColor=white)

A responsive survey application built with Angular and Supabase as part of the Developer Academy curriculum.

The application supports multi-question surveys, single- and multiple-answer questions, live result updates, active/past filtering, deadline-based “Ending soon” highlighting, responsive desktop/mobile layouts, and browser-scoped vote protection.

## Features

- Create surveys in an overlay editor without leaving the overview.
- Add multiple questions to one survey.
- Add up to six answers per question.
- Configure single-answer or multiple-answer voting per question.
- Optional survey description and deadline.
- Category-based filtering.
- Active and past survey tabs.
- Automatic deadline sorting.
- “Ending soon” section for surveys ending within the next three days.
- Survey detail view with live result visualization.
- Supabase Realtime updates for persisted survey changes.
- Browser-local voter identity to prevent duplicate votes.
- Responsive layouts for desktop, tablet, mobile, and wide screens.
- Figma-aligned visual design and interaction states.

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | Angular 22 |
| Language | TypeScript 6 |
| Forms | Angular Reactive Forms |
| State | Angular Signals |
| Routing | Angular Router |
| Database | Supabase PostgreSQL |
| Realtime | Supabase Realtime |
| Tests | Vitest |
| Styling | SCSS |
| Tooling | Angular CLI, Supabase CLI, Prettier |

## Project Structure

```text
src/
├── app/
│   ├── core/
│   │   ├── supabase/
│   │   ├── time/
│   │   └── voter/
│   ├── features/
│   │   └── polls/
│   │       ├── components/
│   │       │   ├── poll-card/
│   │       │   ├── poll-option/
│   │       │   └── poll-results/
│   │       ├── mappers/
│   │       ├── models/
│   │       ├── pages/
│   │       │   ├── poll-create/
│   │       │   ├── poll-detail/
│   │       │   └── poll-list/
│   │       ├── services/
│   │       ├── utils/
│   │       └── validators/
│   └── shared/
│       └── components/
│           ├── app-logo/
│           └── hero-visual/
├── assets/
│   ├── branding/
│   ├── icons/
│   └── illustrations/
├── environments/
└── styles.scss

supabase/
├── config.toml
└── migrations/
```

## Architecture

The project uses a small feature-oriented architecture.

### `PollRepository`

Owns direct Supabase persistence operations:

- loading surveys, questions, answers, and votes;
- inserting surveys and related records;
- inserting votes;
- cleanup after partial creation failures.

### `PollService`

Owns application/domain orchestration:

- public survey state;
- loading and error state;
- active/past checks;
- creation workflow;
- voting rules;
- local state refresh after writes;
- Realtime coordination.

### Mappers

Convert persisted Supabase rows into frontend domain models.

### Voter identity

`VoterIdentityService` stores a generated browser voter token and local vote markers in `localStorage`.

This is intentionally lightweight and is not an authentication system.

## Data Model

The current Supabase schema is centered around four tables:

### `polls`

Stores survey-level information such as title, category, description, deadline, and creation timestamp.

### `poll_questions`

Stores ordered questions belonging to a survey. Each question can independently allow or disallow multiple answers.

### `poll_options`

Stores answer options for a question.

### `votes`

Stores submitted votes and associates them with the survey, question, answer option, and browser voter token.

Database constraints and triggers enforce vote cardinality and relational consistency.

## Supabase Migrations

Migrations are stored in `supabase/migrations/` and must be applied in order.

Current migration history:

```text
20260903_create_poll_schema.sql
20260902_add_vote_identity_and_realtime.sql
20260903141000_expand_poll_to_survey_model.sql
20260904131500_add_poll_questions.sql
20260904142000_add_multiple_answer_questions.sql
```

Apply pending migrations:

```bash
npx supabase db push
```

Link a project when needed:

```bash
npx supabase link --project-ref <project-ref>
```

## Environment Configuration

The Supabase client reads from:

```text
src/environments/environment.ts
```

Required values:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabasePublishableKey: 'YOUR_SUPABASE_PUBLISHABLE_KEY',
};
```

Use a Supabase publishable/anonymous client key only. Never place service-role credentials in frontend code.

## Installation

Requirements:

- Node.js compatible with Angular 22;
- npm;
- Supabase CLI for database migration workflows.

Install dependencies:

```bash
npm install
```

## Development

Start the application:

```bash
npm start
```

Open:

```text
http://localhost:4200
```

## Type Checking

Application sources:

```bash
npx tsc -p tsconfig.app.json --noEmit
```

Test sources:

```bash
npx tsc -p tsconfig.spec.json --noEmit
```

`noEmit` is intentionally enabled so TypeScript does not generate JavaScript files inside `src/`.

## Build

```bash
npm run build
```

## Tests

```bash
npm test -- --watch=false
```

The repository contains unit tests for poll services, persistence behavior, pages, and reusable poll components.

## Survey Lifecycle

A survey is considered:

- **Active** while its persisted status is `active` and its deadline has not elapsed.
- **Completed** after manual completion or once its deadline has elapsed.
- **Past** in the UI when the persisted status is `completed` or the deadline has elapsed.
- **Ending soon** when it is active and its deadline is within the next three days.

Manual completion and deadline completion are persisted in Supabase. Completed surveys store a completion timestamp and whether completion happened manually or because of the deadline.

## Voting Behavior

For single-answer questions, one browser voter identity can submit one answer for the question.

For multiple-answer questions, one browser voter identity can submit more than one distinct answer option.

The database remains the final authority for vote consistency.

## Realtime Results

Supabase Realtime refreshes survey state after relevant database changes.

Result percentages are calculated from persisted vote totals and update without requiring a manual page reload.

## Responsive Design

The UI includes dedicated behavior for desktop, tablet, mobile, and wide screens.

The visual implementation follows the supplied Figma design, including custom typography, branded colors, button transitions, result bars, mobile overlays, and responsive survey detail views.

## Code Quality Rules

Project-owned source files follow these limits:

- maximum **400 lines per file**;
- maximum **14 lines per named function, method, getter, or constructor**;
- one clear responsibility per function;
- JSDoc for named production functions, methods, getters, and constructors;
- no `any`;
- no generated JavaScript inside `src/`;
- no duplicate fallback architecture or temporary runtime workaround structure.

Generated or tool-managed files such as `package-lock.json` and Supabase CLI configuration are not treated as application source-code modules.

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Survey overview and create-survey modal |
| `/polls/:id` | Survey detail, voting, and live results |

Unknown routes redirect to `/`.

## Design Assets

Branding, icons, and illustrations live under:

```text
src/assets/
```

The application uses supplied Poll App assets instead of recreating those visuals in code.

## Final Verification

Before submitting or deploying, run:

```bash
npx tsc -p tsconfig.app.json --noEmit
npx tsc -p tsconfig.spec.json --noEmit
npm run build
npm test -- --watch=false
```

Manual verification should include:

- active/past tab separation;
- category filtering;
- three-day “Ending soon” behavior;
- survey creation with multiple questions;
- single-answer voting;
- multiple-answer voting;
- live result updates;
- expired survey voting lockout;
- mobile overview/editor/detail layouts;
- create-survey modal open/close behavior.
