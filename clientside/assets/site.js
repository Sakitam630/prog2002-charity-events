const $ = id => document.getElementById(id);
const money = value => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(value);
const dateFormat = options => new Intl.DateTimeFormat('en-AU', { timeZone: 'Australia/Brisbane', ...options });
const photos = {
  'Fun Run': ['photo-1552674605-db6ffd4facb5', 'Runners taking part in an outdoor run'],
  'Gala Dinner': ['photo-1511795409834-ef04bbd61622', 'Tables set for a shared community dinner'],
  'Auction': ['photo-1579783902614-a3fb3927b6a5', 'Art displayed in a gallery'],
  'Concert': ['photo-1501386761578-eac5c94b800a', 'An audience at an outdoor concert'],
  'Workshop': ['photo-1452860606245-08befc0ff44b', 'People working together on a creative project']
};
function photo(category, width = 500) {
  const [id, alt] = photos[category] || photos.Workshop;
  return { src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`, alt };
}
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
async function get(path, signal) {
  const response = await fetch(`/api${path}`, { signal });
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || 'Event data is unavailable. Please try again.');
  return body;
}
function showStatus(text, error = false) {
  $('status').textContent = text;
  $('status').classList.toggle('error', error);
}
function renderEvents(events) {
  $('events').replaceChildren();
  if (!events.length) {
    $('events').append(element('p', 'No events found. Try another date, location or category.', 'empty'));
    return;
  }
  for (const event of events) {
    const date = new Date(event.event_datetime);
    const row = element('article', undefined, 'event-row');
    const tile = element('div', undefined, 'date-tile');
    tile.append(element('strong', dateFormat({ day: '2-digit' }).format(date)),
      element('span', dateFormat({ month: 'short', year: 'numeric' }).format(date)));
    const image = element('img', undefined, 'event-image');
    Object.assign(image, photo(event.category_name));
    image.loading = 'lazy'; image.width = 148; image.height = 111;
    const copy = element('div', undefined, 'event-copy');
    const meta = element('div');
    meta.append(element('span', event.category_name, 'category'),
      element('span', event.time_status === 'past' ? 'Past' : 'Upcoming', `badge ${event.time_status}`));
    const heading = element('h3');
    const link = element('a', event.name);
    link.href = `detail.html?id=${encodeURIComponent(event.event_id)}`;
    heading.append(link);
    copy.append(meta, heading, element('p', event.location),
      element('p', `${dateFormat({ hour: 'numeric', minute: '2-digit' }).format(date)} AEST`),
      element('p', event.short_description));
    const actions = element('div', undefined, 'event-actions');
    const details = element('a', 'Details');
    details.href = link.href;
    details.setAttribute('aria-label', `View ${event.name}`);
    actions.append(element('strong', Number(event.ticket_price) === 0 ? 'Free' : money(event.ticket_price)), details);
    row.append(tile, image, copy, actions);
    $('events').append(row);
  }
}

let activeRequest;
async function loadEvents(path) {
  activeRequest?.abort();
  const controller = new AbortController();
  activeRequest = controller;
  $('events').replaceChildren();
  showStatus('Loading events...');
  try {
    const events = await get(path, controller.signal);
    renderEvents(events);
    showStatus(`${events.length} ${events.length === 1 ? 'event' : 'events'}`);
  } catch (error) {
    if (error.name !== 'AbortError') showStatus(error.message, true);
  }
}
