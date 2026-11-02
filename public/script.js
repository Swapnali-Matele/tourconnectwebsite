const form = document.getElementById('tourForm');
const fetchToursBtn = document.getElementById('fetchToursBtn');
const updateTourBtn = document.getElementById('updateTourBtn');
const deleteTourBtn = document.getElementById('deleteTourBtn');
const output = document.getElementById('output');
const toast = document.getElementById('toast');
const loadingIndicator = document.getElementById('loadingIndicator');

const formFields = {
  tour_id: document.getElementById('tour_id'),
  title: document.getElementById('title'),
  description: document.getElementById('description'),
  pick_up: document.getElementById('pick_up'),
  meeting_point: document.getElementById('meeting_point'),
  drop_off: document.getElementById('drop_off'),
  duration: document.getElementById('duration'),
  duration_unit: document.getElementById('duration_unit')
};

const showToast = (message) => {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
};

const setLoadingState = (isLoading) => {
  loadingIndicator.hidden = !isLoading;
};

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#039;'
}[char]));

const renderJsonOutput = (data) => {
  output.textContent = JSON.stringify(data, null, 2);
};

const renderTourTable = (data) => {
  const tours = data?.data?.tour_options;

  if (!Array.isArray(tours) || tours.length === 0) {
    output.innerHTML = '<p>No tours found</p>';
    return;
  }

  const rows = tours
    .map(
      (tour) => `
        <tr>
          <td>${escapeHtml(tour.tour_id ?? '')}</td>
          <td>${escapeHtml(tour.title ?? '')}</td>
          <td>${escapeHtml(tour.description ?? '')}</td>
          <td>${escapeHtml(tour.pick_up ?? '')}</td>
          <td>${escapeHtml(tour.meeting_point ?? '')}</td>
          <td>${escapeHtml(tour.drop_off ?? '')}</td>
          <td>${escapeHtml(tour.duration ?? '')}</td>
          <td>${escapeHtml(tour.duration_unit ?? '')}</td>
        </tr>
      `
    )
    .join('');

  output.innerHTML = `
    <table class="tour-table">
      <thead>
        <tr>
          <th>tour_id</th>
          <th>title</th>
          <th>description</th>
          <th>pick_up</th>
          <th>meeting_point</th>
          <th>drop_off</th>
          <th>duration</th>
          <th>duration_unit</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
};

const fetchTours = async () => {
  setLoadingState(true);

  try {
    const response = await fetch('/tour');
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch tours');
    }

    renderTourTable(data);
  } catch (error) {
    renderJsonOutput({ error: error.message });
  } finally {
    setLoadingState(false);
  }
};

const getFormPayload = () => ({
  tour_id: Number(formFields.tour_id.value),
  title: formFields.title.value,
  description: formFields.description.value,
  pick_up: formFields.pick_up.value,
  meeting_point: formFields.meeting_point.value,
  drop_off: formFields.drop_off.value,
  duration: Number(formFields.duration.value),
  duration_unit: formFields.duration_unit.value
});

const clearForm = () => {
  form.reset();
  formFields.duration_unit.value = 'days';
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const payload = getFormPayload();

  try {
    const response = await fetch('/tour', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    renderJsonOutput(result);

    if (!response.ok) {
      throw new Error(result.message || 'Tour creation failed');
    }

    showToast(result.message || 'Tour Created Successfully');
    clearForm();
    fetchTours();
  } catch (error) {
    renderJsonOutput({ error: error.message });
    showToast(error.message);
  }
});

updateTourBtn.addEventListener('click', async () => {
  const id = formFields.tour_id.value;

  if (!id) {
    showToast('Please enter a valid tour_id to update');
    return;
  }

  const payload = {
    title: formFields.title.value || undefined,
    description: formFields.description.value || undefined,
    pick_up: formFields.pick_up.value || undefined,
    meeting_point: formFields.meeting_point.value || undefined,
    drop_off: formFields.drop_off.value || undefined,
    duration: formFields.duration.value ? Number(formFields.duration.value) : undefined,
    duration_unit: formFields.duration_unit.value || undefined
  };

  try {
    const response = await fetch(`/tour/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    renderJsonOutput(result);

    if (!response.ok) {
      throw new Error(result.message || 'Tour update failed');
    }

    showToast(result.message || 'Tour updated successfully');
    fetchTours();
  } catch (error) {
    renderJsonOutput({ error: error.message });
    showToast(error.message);
  }
});

deleteTourBtn.addEventListener('click', async () => {
  const id = formFields.tour_id.value;

  if (!id) {
    showToast('Please enter a valid tour_id to delete');
    return;
  }

  try {
    const response = await fetch(`/tour/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    renderJsonOutput(result);

    if (!response.ok) {
      throw new Error(result.message || 'Tour deletion failed');
    }

    showToast(result.message || 'Tour deleted successfully');
    clearForm();
    fetchTours();
  } catch (error) {
    renderJsonOutput({ error: error.message });
    showToast(error.message);
  }
});

fetchToursBtn.addEventListener('click', fetchTours);
fetchTours();
