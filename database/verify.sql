USE charityevents_db;
SELECT 'organisations' AS entity, COUNT(*) AS total FROM organisations
UNION ALL SELECT 'categories', COUNT(*) FROM categories
UNION ALL SELECT 'events', COUNT(*) FROM events;

SELECT status, COUNT(*) AS total FROM events GROUP BY status;
SELECT CASE WHEN event_datetime < UTC_TIMESTAMP() + INTERVAL 10 HOUR
            THEN 'past' ELSE 'upcoming' END AS time_status,
       COUNT(*) AS total
FROM events WHERE status = 'active' GROUP BY time_status;

SELECT e.event_id, e.name, c.name AS category, o.name AS organisation,
       e.event_datetime, e.ticket_price, e.status
FROM events e
JOIN categories c ON c.category_id = e.category_id
JOIN organisations o ON o.organisation_id = e.organisation_id
ORDER BY e.event_id;

SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'events'
  AND REFERENCED_TABLE_NAME IS NOT NULL;
