# PROG2002 A2 module delivery plan

Updated: 2026-10-04. Current scope: A2 only.
Requirements source: E:/workplace/1/PROG2002-A2-A3-需求翻译与坑点.md (local only).
A2 deadline: before 2026-10-11; target submission 2026-10-10.
A3 deadline: before 2026-10-25; target submission 2026-10-24, outside this run.
Confirm the exact submission time and school timezone in the learning portal.

## Agreed modules

| Module | Scope | Acceptance |
| --- | --- | --- |
| 1. Initialization | Directories, README, ignore rules, example configuration | Clear structure; secrets excluded; no later-module code |
| 2. Database | Organisations, categories, events, keys, eight samples, SQL | Fresh database import and sample queries succeed |
| 3. Server and connection | Node/Express, event_db.js, environment, health endpoint | Server connects to MySQL |
| 4. Homepage | Shared navigation and new layout, upcoming API, dynamic agenda | Only active upcoming events appear |
| 5. Search | Categories API, search API, filters, DOM clear and errors | Single and combined filters work |
| 6. Detail | Detail API, complete information, fundraising, Register placeholder | Valid details; invalid/suspended access handled |
| 7. Integration and tests | API validation, browser interaction, responsive and error checks | Checks pass and evidence is recorded |
| 8. Delivery preparation | Startup guide, SQL attachment, packaging checks, report/video outlines | Marker can run the project; deliverables are listed |

## Workflow

Prepare one module, verify it, create one meaningful commit, and upload it only
when the user confirms that module. Later fixes receive explicit fix commits.
Do not upload all prepared modules together or invent past development dates.
Modules 1 and 2 were uploaded separately. Module 3 adds only the Express server,
MySQL connection, health endpoint and related configuration/documentation.
Module 4 adds the homepage, shared navigation, responsive agenda and upcoming API.
Module 5 adds the search page, category/search APIs, filter validation and styles.
Module 6 adds the detail page/API, fundraising display and Register placeholder.
Module 7 adds API/validation tests, browser workflow checks and verification evidence.
Module 8 remains pending upload.
Existing complete local code is retained separately as reference/backup.

## Technical constraints

- Plain HTML, CSS, JavaScript DOM, Promises, Node/Express and MySQL; no A2 AngularJS.
- Database name charityevents_db; Node connection file event_db.js.
- Activities come from the project's API, not hard-coded browser arrays.
- Home excludes past and suspended events; search excludes suspended events.
- Registration in A2 only alerts: This feature is currently under construction.
- Never overwrite another project's database during setup.
- Keep the repository private and invite the marker before final submission.
- Follow assessment GenAI restrictions and accurately declare assistance.

## Visual direction

Common Ground Brisbane: a community charity events website.
Homepage: date-led agenda with activity photography and compact navigation.
Search: filter sidebar beside results. Detail: broad image, clear facts,
fundraising information and horizontal registration area.
Stack columns at narrow browser widths without text collisions or horizontal overflow.
