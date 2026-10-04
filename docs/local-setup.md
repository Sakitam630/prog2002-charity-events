# A2 installation and startup

Website and API use one Express service at http://localhost:3101.
Requires Node.js 20+ and MySQL/MariaDB. Do not open HTML using file://.

## Extract the source packages

Extract both Hongke OuyangA2-clientside.zip and Hongke OuyangA2-api.zip into the
SAME empty directory. Keep the top-level folders already included in each ZIP:

    A2/
      README.md
      api/              server.js, app.js, event_db.js, package files, .env.example
      clientside/       index.html, search.html, detail.html, assets/
      database/         charityevents_db.sql, verify.sql, README.md
      docs/             setup, API reference and verification notes
      scripts/          package-a2.ps1

api/ and clientside/ must be siblings because Express serves ../clientside.
Do not put one archive inside the other or add an extra api/clientside folder.

## Database

Use a fresh database instance where charityevents_db does not already exist.
Import database/charityevents_db.sql with a client that stops on errors; do not
use --force. The SQL contains schema, keys and sample data, and intentionally
refuses to recreate an existing database. Do not overwrite another project.

Choose the actual MySQL host and port. This development computer uses an isolated
instance at 127.0.0.1:3307; another installation may use 3306. Database access is
separate from the website/API port 3101. See database/README.md for the import
procedure, using the actual extracted SQL path on your computer.

Use a database account with SELECT permission on charityevents_db. Obtain its
credentials from your own database setup; no password is included in the ZIP.
Run database/verify.sql to check 1 organisation, 5 categories and 8 events.
The seed includes 7 active events and 1 suspended event.

## Configure and run

In PowerShell, change to the extracted api/ directory and run:

```powershell
npm ci
if (-not (Test-Path -LiteralPath '.env')) {
    Copy-Item -LiteralPath .env.example -Destination .env
}
```

Copy the example only if .env does not exist. Edit the new .env with the actual
DB_HOST, DB_PORT, DB_USER and DB_PASSWORD. Keep DB_NAME=charityevents_db and
PORT=3101. The .env file is local configuration and must not be submitted.

```powershell
npm start
```

Keep the terminal running. Open http://localhost:3101/api/health and check for
{"status":"ok","database":"connected"}, then open http://localhost:3101.
The service binds to loopback for local assessment; this is not A3 public hosting.

## Check the installation

In a second terminal in api/, run npm test. Seven tests use database stubs.
With the application running and Microsoft Edge installed, run npm run test:browser.
See docs/a2-verification.md for sample date assumptions and test limitations.

## Troubleshooting

- HTTP 503: check the database process, host/port, credentials and SELECT permission.
- Port 3101 in use: identify the existing application before starting a second one.
  Do not stop another project or change the agreed port without checking.
- Pages return 404: confirm api/ and clientside/ are siblings after extraction.
- Remote photos do not load: internet access is required; see image-sources.md.
- Upcoming sample count changes: event dates are fixed in 2026, not relative dates.

## Existing development computer

The complete reference project remains E:/workplace/user1 and its local startup
helper is E:/workplace/user1/scripts/start-local.ps1. The staged source repository
is E:/workplace/user1/.runtime/module-delivery. That machine-specific helper is
not required by the submitted source packages; follow the portable steps above.
