# Common Ground Brisbane

A **PROG2002 Assessment 2 (A2)** charity events website for discovering local fundraisers in Brisbane. Visitors can browse upcoming events, search by date, location and category, and view event information, ticket prices and fundraising progress.

**Repository:** [prog2002-charity-events](https://github.com/Sakitam630/prog2002-charity-events)

## Implemented features

- **Upcoming events:** the homepage lists active events at or after the current Brisbane time, ordered by event date and time.
- **Search:** optional date, case-insensitive partial location and category filters can be combined. Search includes past active events and excludes suspended events.
- **Clear Filters:** resets the form and reloads all active events.
- **Event details:** shows the description, date, location, ticket price, fundraising goal and progress, and charity contact information. Free tickets display as free admission.
- **User feedback:** loading, empty-result, validation and service-error messages help visitors understand the current state.
- **Responsive pages:** homepage, search and detail layouts adapt to desktop and mobile screens.

## Technology stack

Node.js, Express and MySQL/MariaDB provide a read-only JSON API. The frontend uses HTML, CSS and vanilla JavaScript with DOM updates, Fetch and Promises. Automated checks use Node.js's test runner and Playwright with Microsoft Edge.

Express serves the website and API from the same origin. No frontend build step is required.

## Project structure

```text
project/
├── api/                    # Express application, database connection and tests
│   ├── scripts/            # Browser checks
│   ├── test/               # API and input-validation tests
│   └── .env.example        # Configuration template; no real password
├── clientside/             # HTML pages and shared CSS/JavaScript assets
├── database/               # Fresh-install SQL schema and sample data
├── docs/                   # Setup, API reference, image sources and verification
├── scripts/                # Source packaging helper
└── README.md
```

**Keep `api/` and `clientside/` at the same directory level**, including after extracting the submission archives. Express resolves the frontend as `../clientside`. Local runtime files and browser screenshots are stored in `.runtime/`; delivery files belong in `submission/`. Both directories are excluded from Git.

## Requirements

- **Node.js 20 or later**, with npm.
- **MySQL or MariaDB**, running locally, plus a database client for the SQL import.
- A modern browser to use the website; **installed Microsoft Edge** to run the browser checks.
- Internet access for dependency installation unless cached, and for the remote event photographs.

| Setting | Value |
| --- | --- |
| Website and API port | `3101` |
| Required database name | `charityevents_db` |
| Database host in the example configuration | `127.0.0.1` |
| Database port on the original development computer | `3307` |

The website port and database port are separate settings. Set `DB_PORT` to your own database service's port; a standard installation may use `3306`. Port `3307` is used here for an isolated instance so another local project can retain its own database.

## Install and run

### 1. Download and import the database

Clone or download the repository, keep its directory structure, and start MySQL/MariaDB on the intended port.

Import [database/charityevents_db.sql](database/charityevents_db.sql) into a **fresh, isolated database instance** using a client configured to stop on the first error. The SQL creates `charityevents_db`; it does not drop an existing database. If that name already exists, stop and confirm which project owns it before proceeding. Do not use a force/continue-on-error option.

For example, from the project root in **Windows PowerShell**, with `mysql` available on PATH:

```powershell
cmd /c "mysql --host=127.0.0.1 --port=3307 --protocol=tcp --user=root --password < database\charityevents_db.sql"
if ($LASTEXITCODE -ne 0) { throw 'Database import failed. Resolve the error before continuing.' }
```

Use your actual database port and an account with permission to create the database and tables. Enter the password when prompted. This example uses Command Prompt redirection because PowerShell does not support `<` input redirection directly. Alternatively, import the SQL with your database client, stopping on errors.

The seed creates 1 fictional organisation, 5 categories and 8 events: 7 active and 1 suspended. Event times represent Brisbane local time (UTC+10).

### 2. Install API dependencies

From the project root:

```sh
cd api
npm ci
```

This installs the locked dependencies, including the browser-test dependency. Do not omit development dependencies if you intend to run the browser checks. In PowerShell, use `npm.cmd` if execution policy blocks `npm.ps1`.

### 3. Configure the environment

In `api/`, copy `.env.example` to `.env` unless you already have a local configuration. PowerShell example:

```powershell
if (-not (Test-Path -LiteralPath '.env')) {
    Copy-Item -LiteralPath '.env.example' -Destination '.env'
}
```

Edit `.env` with your own database account and connection settings:

```dotenv
PORT=3101
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=charityevents_db
```

Replace the username and password placeholders, and change `DB_PORT` if necessary. Use an existing account with access to this database, or create one through your database administration tool. The A2 application only needs `SELECT` permission; the SQL import requires an account with schema-creation permissions.

Never commit `.env` or include it in submission archives. The repository ignores it and provides `.env.example` for configuration instructions.

### 4. Start the application

Still inside `api/`, run:

```sh
npm start
```

Keep the terminal open. The development server listens on the local loopback interface and serves both the website and API on port `3101`.

- Homepage: [http://localhost:3101/](http://localhost:3101/)
- Search: [http://localhost:3101/search.html](http://localhost:3101/search.html)
- Health check: [http://localhost:3101/api/health](http://localhost:3101/api/health)

Expected health response:

```json
{"status":"ok","database":"connected"}
```

Open the website through HTTP, not by opening the HTML files with `file://`; the frontend uses relative `/api` URLs. If `localhost` does not resolve to the listening interface, use `http://127.0.0.1:3101/`.

See [local setup](docs/local-setup.md) for portable installation, archive extraction and troubleshooting. The original computer also has a machine-specific startup helper in the complete reference project; it is not included or required in this repository.

## API endpoints

All endpoints use `GET` and return JSON. Base URL: `http://localhost:3101`.

| Endpoint | Purpose |
| --- | --- |
| `/api/health` | Check database connectivity. |
| `/api/categories` | Retrieve search categories. |
| `/api/events/upcoming` | Retrieve upcoming active events using the current Brisbane time. |
| `/api/events/search` | Filter active events by `date`, `location` and `category_id`. |
| `/api/events/:id` | Retrieve an active event and its organisation details. |

Example: [combined event search](http://localhost:3101/api/events/search?date=2026-11-07&location=New%20Farm&category_id=1).

All supplied filters must match. Invalid input returns `400`, unavailable events or API endpoints return `404`, and database/service failures return `503`. See the [API reference](docs/api-reference.md) for parameter rules and response details.

## Testing

Run the following commands from `api/`.

### API and validation tests

```sh
npm test
```

These seven tests cover input validation, combined-search query parameters, invalid requests, unavailable resources and Brisbane timestamp serialization. They use a database test double and temporary HTTP servers; they do not require a running MySQL service or prove a real database connection.

### Browser checks

Start the application and database first, keep the original sample data available, and install Microsoft Edge. In a second terminal inside `api/`, run:

```sh
node scripts/browser-check.js
```

You can also run `npm run test:browser`; it invokes the same Playwright script.

The checks use `http://127.0.0.1:3101` by default; set `TEST_URL` to test another running address. They cover the three pages at widths of 1440, 390 and 320 pixels, combined search, Clear Filters, empty/error states, free admission, suspended events and the Register notice. Screenshots are saved under `.runtime/screenshots/`.

**Date-sensitive test data:** the browser script expects 5 upcoming active events, 7 active search results and 2 past events, using the original 2026 sample dates. These expectations need review when dates pass or seed data changes; a changed count alone does not establish an application defect.

### Recorded results

On **2026-10-04**, using Node.js **v24.10.0**, the existing local database and Microsoft Edge:

- `npm test`: **7 passed, 0 failed**.
- `/api/health`: returned `status: ok` and `database: connected`.
- `node scripts/browser-check.js`: completed successfully at all three viewport widths, with no horizontal document overflow or browser JavaScript exceptions detected by the script. The inspected event images loaded during this run.

See the [verification record](docs/a2-verification.md) for the 2026-10-04 staged-delivery checks, reproduction steps and test limitations. Automated checks cover the listed scenarios, not every possible browser or user interaction.

## Scope and limitations

- **Register** displays only: `This feature is currently under construction.` It does not create a registration or take payment.
- Actual registration, event administration and deployment are planned A3 work and are not implemented in this A2 version.
- Event and organisation records are fictional. Photographs are illustrative and load from Unsplash's image CDN; they require an internet connection. Text and API results remain usable without the images.
- Upcoming-event results depend on the current time. An empty homepage can be valid after the sample events have passed.

## Documentation and acknowledgement

- [Local setup and troubleshooting](docs/local-setup.md)
- [API reference](docs/api-reference.md)
- [Image sources](docs/image-sources.md)
- [Verification record](docs/a2-verification.md)
- [Delivery checklist](docs/a2-delivery-checklist.md)
- [A2模块划分](docs/a2-a3-module-plan.md)

This README was revised with OpenAI Codex assistance, using the repository's source files, existing documentation and the test runs described above. This statement covers the README revision; it is not a complete declaration of AI use elsewhere in the project. The assessed submission should accurately acknowledge any additional AI assistance in accordance with the course's rules.

Source packages can be reproduced with `scripts/package-a2.ps1`; see the [delivery checklist](docs/a2-delivery-checklist.md). Module planning remains in the linked plan. The course report, demonstration video, marker access and final submission are separate deliverables; passing the application checks does not mean those tasks are complete.
