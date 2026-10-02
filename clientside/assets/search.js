async function setupSearch() {
  const form = $('filters');
  form.addEventListener('submit', event => {
    event.preventDefault();
    $('form-error').textContent = '';
    if (!form.checkValidity()) {
      $('form-error').textContent = 'Check the date and location, then search again.';
      form.querySelector(':invalid')?.focus();
      return;
    }
    const params = new URLSearchParams();
    for (const [key, value] of new FormData(form)) if (value.trim()) params.set(key, value.trim());
    history.replaceState(null, '', `search.html${params.size ? `?${params}` : ''}`);
    loadEvents(`/events/search?${params}`);
  });
  $('clear').addEventListener('click', () => {
    form.reset();
    $('form-error').textContent = '';
    history.replaceState(null, '', 'search.html');
    loadEvents('/events/search');
    $('date').focus();
  });
  const params = new URLSearchParams(location.search);
  $('date').value = params.get('date') || '';
  $('location').value = params.get('location') || '';
  try {
    for (const category of await get('/categories')) {
      const option = element('option', category.name);
      option.value = category.category_id;
      $('category').append(option);
    }
    $('category').value = params.get('category_id') || '';
  } catch (error) {
    $('category-status').textContent = 'Categories unavailable. You can still search by date or location.';
    $('category').disabled = true;
  }
  loadEvents(`/events/search?${params}`);
}

setupSearch();
