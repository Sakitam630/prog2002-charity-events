async function loadDetail() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id || !/^[1-9]\d*$/.test(id)) {
    showStatus('Choose an event from the event list to view its details.', true);
    return;
  }
  try {
    const event = await get(`/events/${encodeURIComponent(id)}`);
    document.title = `${event.name} | Common Ground Brisbane`;
    $('event-name').textContent = event.name;
    $('category-name').textContent = event.category_name;
    $('time-status').textContent = event.time_status === 'past' ? 'Past event' : 'Upcoming';
    Object.assign($('event-photo'), photo(event.category_name, 1400));
    $('when').textContent = `${dateFormat({ dateStyle: 'full', timeStyle: 'short' }).format(new Date(event.event_datetime))} AEST`;
    $('where').textContent = event.location;
    $('purpose').textContent = event.purpose;
    $('description').textContent = event.full_description;
    $('organisation').textContent = event.organisation_name;
    $('contact').textContent = event.contact_email;
    $('contact').href = `mailto:${event.contact_email}`;
    $('raised').textContent = `${money(event.current_progress)} raised`;
    const goal = Number(event.fundraising_goal);
    const percent = goal > 0 ? Number(event.current_progress) / goal * 100 : 0;
    $('progress').value = Math.min(100, percent);
    $('goal').textContent = goal > 0 ? `of a ${money(goal)} goal (${Math.round(percent)}%)` : 'No fundraising target set.';
    $('ticket-price').textContent = Number(event.ticket_price) === 0 ? 'Free admission' : `${money(event.ticket_price)} per ticket`;
    $('registration-note').textContent = event.time_status === 'past' ? 'This event has finished.' : 'Ticket income supports this event\'s community cause.';
    $('registration').addEventListener('submit', submit => {
      submit.preventDefault();
      alert('This feature is currently under construction.');
    });
    $('detail').hidden = false;
    showStatus('');
  } catch (error) {
    showStatus(error.message, true);
  }
}

loadDetail();
