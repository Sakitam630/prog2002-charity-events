# A2 database module

Module 2 delivers charityevents_db.sql: schema and fictional sample data for
Common Ground Brisbane. No API or website implementation is included here.

## Data model

- organisations: charity name, mission, email and phone; 1 sample record.
- categories: unique category name and description; 5 sample records.
- events: event details, ticket price, fundraising goal/progress, status and
  organisation/category foreign keys; 8 sample records.

One organisation has many events; one category has many events. Foreign keys
restrict deletion of referenced organisations and categories. Price, goal and
progress must be nonnegative; latitude/longitude have range checks.

Status stores active or suspended. Past/upcoming is derived from event time.
As of September 2026, the samples contain 5 upcoming active, 2 past active and
1 suspended event. They also include free admission and progress above the goal.
Event DATETIME values represent Brisbane local time (UTC+10).

## Import

Use a fresh MySQL/MariaDB instance with no charityevents_db database. The file
starts with CREATE DATABASE and intentionally does not drop an existing database.
Use a client that stops on the first error; do not use --force or continue-on-error.
Both this assignment and another local project may use the required database
name, so check the host and port before importing. Back up existing data first
if you later choose to migrate an occupied instance.

With a MySQL command-line client, connect interactively to the intended instance:

    mysql --host=127.0.0.1 --port=3307 -u root -p

Port 3307 is the isolated instance used on this computer; adjust it for your setup.
At the mysql prompt, import the SQL using its actual absolute path:

    SOURCE E:/workplace/user1/.runtime/module-delivery/database/charityevents_db.sql;

The SQL includes the required database name, table definitions and sample data.
Do not reimport into an existing database. For a clean isolated test, use a separate
instance instead of dropping the database used by a running application.

## Verification

Run verify.sql after a successful import. It is read-only and reports row counts,
status counts, event/category/organisation associations and foreign keys.
Expected totals are 1 organisation, 5 categories and 8 events (7 active, 1 suspended).
Upcoming/past counts change with the calendar date; the samples are not relative dates.

Module 2 verification also tests constraint rejection in an isolated temporary
schema. API connection setup belongs to Module 3.

Verified on 2026-09-28 using MariaDB 10.4.32. A fresh temporary schema passed
import, row-count and relationship checks. Negative ticket prices, invalid
category references, deletion of a referenced organisation and duplicate category
names were rejected. verify.sql executed successfully. Only the temporary test
schema was removed after verification; the application's database was unchanged.
