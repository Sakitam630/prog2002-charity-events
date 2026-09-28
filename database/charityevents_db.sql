-- Fresh isolated instance only. Stop on the first error; never use --force.
-- Event times use Australia/Brisbane local time (UTC+10).
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

CREATE TABLE organisations (
    organisation_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    mission VARCHAR(500) NOT NULL,
    contact_email VARCHAR(254) NOT NULL,
    contact_phone VARCHAR(30) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE categories (
    category_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE events (
    event_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    organisation_id INT UNSIGNED NOT NULL,
    category_id INT UNSIGNED NOT NULL,
    name VARCHAR(150) NOT NULL,
    event_datetime DATETIME NOT NULL,
    location VARCHAR(180) NOT NULL,
    purpose VARCHAR(255) NOT NULL,
    short_description VARCHAR(300) NOT NULL,
    full_description TEXT NOT NULL,
    ticket_price DECIMAL(8,2) NOT NULL DEFAULT 0,
    fundraising_goal DECIMAL(10,2) NOT NULL DEFAULT 0,
    current_progress DECIMAL(10,2) NOT NULL DEFAULT 0,
    status ENUM('active','suspended') NOT NULL DEFAULT 'active',
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_events_organisation FOREIGN KEY (organisation_id)
        REFERENCES organisations(organisation_id) ON DELETE RESTRICT,
    CONSTRAINT fk_events_category FOREIGN KEY (category_id)
        REFERENCES categories(category_id) ON DELETE RESTRICT,
    CONSTRAINT chk_price CHECK (ticket_price >= 0),
    CONSTRAINT chk_goal CHECK (fundraising_goal >= 0),
    CONSTRAINT chk_progress CHECK (current_progress >= 0),
    CONSTRAINT chk_latitude CHECK (latitude BETWEEN -90 AND 90),
    CONSTRAINT chk_longitude CHECK (longitude BETWEEN -180 AND 180),
    INDEX idx_events_status_time (status, event_datetime),
    INDEX idx_events_category_time (category_id, event_datetime)
) ENGINE=InnoDB;

START TRANSACTION;
INSERT INTO organisations (name, mission, contact_email, contact_phone) VALUES
('Common Ground Brisbane',
 'Neighbour-led events supporting food access, learning and a place to belong in Brisbane.',
 'hello@commonground.example', '+61 7 5550 0142');

INSERT INTO categories (name, description) VALUES
('Fun Run', 'Accessible community runs and walks.'),
('Gala Dinner', 'Shared meals that support local services.'),
('Auction', 'Donated art and goods raising funds for community projects.'),
('Concert', 'Live music with a local purpose.'),
('Workshop', 'Practical skills and creative community sessions.');

INSERT INTO events
(organisation_id, category_id, name, event_datetime, location, purpose,
 short_description, full_description, ticket_price, fundraising_goal,
 current_progress, status, latitude, longitude)
VALUES
(1,1,'River Loop for School Meals','2026-11-07 08:00:00',
 'New Farm Park, Brisbane','Provide breakfast supplies for local school clubs.',
 'Walk or run a friendly five-kilometre riverside course.',
 'Meet at New Farm Park for a five-kilometre community run or walk. Volunteer marshals guide the route and water is available at the halfway point. Families can choose the shorter two-kilometre loop. Ticket income supports breakfast supplies for school clubs. Bring a reusable bottle and sun protection.',
 18,6500,2240,'active',-27.4698,153.0528),
(1,2,'A Seat at the Community Table','2026-11-14 18:30:00',
 'West End Community Hall, Brisbane','Support a weekly community pantry.',
 'A shared supper prepared by local cooks and volunteers.',
 'Local cooks prepare a three-course supper with vegetarian options. Meet the volunteers who keep the community pantry open and hear how food donations are distributed. Ticket income funds pantry staples and delivery costs. Contact the organiser before attending to discuss dietary and accessibility needs.',
 65,12000,3860,'active',-27.4804,153.0106),
(1,3,'Made Here: Art for Housing','2026-11-21 14:00:00',
 'Paddington Community Gallery, Brisbane','Provide essential household kits for people entering housing.',
 'Discover donated prints, ceramics and small works by local makers.',
 'Browse donated work by Brisbane artists at an afternoon silent auction. Each piece has a bid sheet and volunteers explain the auction process. Admission supports household starter kits; auction proceeds provide additional funding. The gallery has step-free entry. Successful bidders arrange collection with the organiser.',
 10,8500,1720,'active',-27.4590,153.0020),
(1,4,'Sunday Sounds for Youth','2026-11-29 16:00:00',
 'South Bank Community Stage, Brisbane','Fund creative workshops for young people.',
 'An afternoon of acoustic music from local performers.',
 'Enjoy acoustic sets by emerging Brisbane performers. Funds raised help young people access music and creative workshops. Seating is unreserved and guests may bring a picnic blanket. This outdoor event follows the organiser weather policy; contact the team for accessibility arrangements.',
 25,9000,2980,'active',-27.4785,153.0222),
(1,5,'Repair Together','2026-12-05 10:00:00',
 'Woolloongabba Neighbourhood Centre, Brisbane','Make practical repair skills accessible to residents.',
 'A free introduction to clothing repairs and reuse.',
 'Volunteer makers demonstrate basic hand stitching, button replacement and simple fabric repairs. Bring one clean garment to practise on. Tools and materials are provided. Attendance is free and no donation is required. The session is designed for beginners and supports the community reuse programme.',
 0,2000,450,'active',-27.4890,153.0350),
(1,1,'Winter Morning Walk','2026-08-16 08:30:00',
 'New Farm Park, Brisbane','Supply warm clothing through local outreach.',
 'A completed winter walk supporting outreach volunteers.',
 'Neighbours joined a guided morning walk and collected funds for warm clothing. The event has finished and its fundraising result remains available in the public archive. This record demonstrates that past active events can be searched but do not appear in the upcoming agenda.',
 15,3500,3825,'active',-27.4698,153.0528),
(1,2,'Neighbourhood Supper','2026-09-05 18:00:00',
 'West End Community Hall, Brisbane','Provide transport vouchers for community appointments.',
 'A completed supper funding local transport support.',
 'This community supper brought neighbours together to fund transport vouchers. The event is now complete. Its historical details and fundraising result remain searchable so supporters can see the outcome of the evening.',
 40,5000,4720,'active',-27.4804,153.0106),
(1,3,'Community Collectors Auction','2026-11-28 13:00:00',
 'Brisbane Community Rooms','Support access to refurbished learning devices.',
 'An auction paused while the organiser reviews donated items.',
 'This event is suspended pending an organiser review. It must not be returned by public listing, search or detail endpoints. The record is retained for later administration workflows.',
 8,7000,320,'suspended',-27.4705,153.0260);
COMMIT;
