const DATA = window.SPACE_DATA || [];
const META = window.DATA_META || {};

const SIGNAL_LABELS = {
  quiet: 'Quiet', privacy: 'Privacy', collaboration: 'Collaboration', technology: 'Technology',
  reservation: 'Reservability', comfort: 'Comfort', access: 'Accessibility', capacity: 'Capacity'
};

const GOALS = {
  focus: {label:'Deep-focus', weights:{quiet:30, privacy:25, collaboration:0, technology:5, reservation:10, comfort:5, access:15, capacity:10}},
  group: {label:'Group-work', weights:{quiet:5, privacy:0, collaboration:30, technology:20, reservation:20, comfort:5, access:10, capacity:10}},
  make: {label:'Make-and-present', weights:{quiet:0, privacy:0, collaboration:20, technology:35, reservation:15, comfort:10, access:10, capacity:10}},
  comfort: {label:'Comfort-break', weights:{quiet:10, privacy:5, collaboration:0, technology:5, reservation:0, comfort:35, access:25, capacity:20}}
};

const FEATURE_LABELS = {
  accessible:'Accessible', charging:'Charging', cafe:'Café onsite', conversation:'Conversation area',
  couches:'Soft seating', food:'Food / drink allowed', lockers:'Lockers', mediaStudios:'Media studio',
  printers:'Printers / scanners', privateDesks:'Private desks', display:'Display / projector',
  quietAmenity:'Quiet-study area', reservable:'Reservable', singleStallRestrooms:'Single-stall restroom',
  standingDesks:'Standing desks', techLoan:'Tech loan', webcam:'Webcam', whiteboards:'Whiteboard / chalkboard'
};

let state = {
  goal:'focus', weights:{...GOALS.focus.weights}, library:'all', type:'all', noise:'all', minSeats:0,
  accessible:false, reservable:false, food:false, search:'', sort:'fit', compare:['391','61','176']
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const pct = (n, d) => d ? Math.round(n / d * 100) : 0;
const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const yesNo = value => value ? '<span class="yes">Listed</span>' : '<span class="unknown">Not listed</span>';
const clamp = value => Math.max(0, Math.min(100, Math.round(value)));

function signalScores(record) {
  const quiet = record.noiseCode === '0' ? 100 : record.noiseCode === '1' ? 65 : 10;
  const privacy = clamp((record.privateDesks ? 65 : 0) + (/Study Carrel|Independent Study Room/.test(record.type) ? 35 : 0));
  const collaboration = clamp(
    (/Group Study Room|Meeting and Presentation Space/.test(record.type) ? 20 : 0) +
    record.whiteboards * 25 + record.display * 20 + record.webcam * 15 + record.conversation * 10 + ((record.seats || 0) >= 6 ? 10 : 0)
  );
  const technology = clamp(record.display * 30 + record.techLoan * 30 + record.webcam * 20 + record.charging * 15 + (/Media Lab|Meeting and Presentation Space/.test(record.type) ? 5 : 0));
  const comfort = clamp(record.couches * 25 + record.food * 20 + record.cafe * 20 + record.charging * 15 + record.openSpace * 10 + record.standingDesks * 5 + ((record.seats || 0) >= 20 ? 5 : 0));
  const access = record.accessible ? 100 : 0;
  const seats = record.seats || 0;
  const capacity = seats >= 50 ? 100 : seats >= 20 ? 85 : seats >= 10 ? 70 : seats >= 6 ? 55 : seats >= 4 ? 40 : seats >= 1 ? 25 : 0;
  return {quiet:record.quietAmenity ? Math.max(quiet, 90) : quiet, privacy, collaboration, technology, reservation:record.reservable ? 100 : 0, comfort, access, capacity};
}

function score(record, weights = state.weights) {
  const signals = signalScores(record);
  const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
  if (!total) return 0;
  return Math.round(Object.entries(weights).reduce((sum, [key, weight]) => sum + signals[key] * weight, 0) / total);
}

function filteredData() {
  const query = state.search.trim().toLowerCase();
  return DATA.filter(record =>
    (state.library === 'all' || record.library === state.library) &&
    (state.type === 'all' || record.type === state.type) &&
    (state.noise === 'all' || record.noise === state.noise) &&
    (!state.minSeats || (record.seats || 0) >= state.minSeats) &&
    (!state.accessible || record.accessible) &&
    (!state.reservable || record.reservable) &&
    (!state.food || record.food || record.cafe) &&
    (!query || `${record.name} ${record.library} ${record.type} ${record.description} ${record.features.join(' ')}`.toLowerCase().includes(query))
  );
}

function listedFeatures(record) {
  return Object.keys(FEATURE_LABELS).filter(key => record[key]);
}

function modeLabel() {
  return state.goal === 'custom' ? 'Custom priorities' : `${GOALS[state.goal].label} preset`;
}

function reasonFor(record) {
  const signals = signalScores(record);
  const leading = Object.entries(state.weights)
    .filter(([, weight]) => weight > 0)
    .map(([key, weight]) => ({key, impact:signals[key] * weight, value:signals[key]}))
    .filter(item => item.value >= 40)
    .sort((a, b) => b.impact - a.impact)
    .slice(0, 3)
    .map(item => SIGNAL_LABELS[item.key].toLowerCase());
  if (!leading.length) return 'This record has limited evidence for the selected priorities. Try another preset or broaden the filters.';
  return `Its strongest evidence for this ranking is ${leading.join(', ')}. The score reflects published fields and the visible priority weights.`;
}

function renderBest(records) {
  const ranked = records.map(record => ({...record, fit:score(record)})).sort((a, b) => b.fit - a.fit || a.name.localeCompare(b.name));
  $('#match-count').textContent = `${records.length} match${records.length === 1 ? '' : 'es'}`;
  $('#empty-state').hidden = ranked.length > 0;
  ['.result-heading', '#best-reason', '#best-features', '#best-breakdown', '.results-panel .note', '.runner-section', '#best-image-wrap'].forEach(selector => $(selector).hidden = ranked.length === 0);

  if (!ranked.length) {
    $('#hero-best-name').textContent = 'No spaces match every filter';
    $('#hero-best-score').textContent = '—';
    $('#hero-best-meta').textContent = 'Try clearing one requirement';
    return;
  }

  const best = ranked[0];
  const signals = signalScores(best);
  $('#best-name').textContent = best.name;
  $('#best-meta').textContent = `${best.library} · ${best.level} · ${best.type} · ${best.seats ?? 'unknown'} seats`;
  $('#best-score').innerHTML = `${best.fit}<span>/100</span>`;
  $('#best-reason').textContent = reasonFor(best);
  $('#hero-best-name').textContent = best.name;
  $('#hero-best-score').textContent = best.fit;
  $('#hero-best-meta').textContent = `${best.library} · ${best.noise} · ${best.seats ?? 'unknown'} seats`;
  $('#hero-goal-label').textContent = modeLabel();

  const relevant = listedFeatures(best).slice(0, 7);
  $('#best-features').innerHTML = [best.noise !== 'Not listed' ? `<span>${esc(best.noise)} noise</span>` : '', ...relevant.map(key => `<span>${FEATURE_LABELS[key]}</span>`)].join('') || '<span>Few amenities listed</span>';
  $('#best-breakdown').innerHTML = Object.entries(signals).map(([key, value]) => `<div title="${SIGNAL_LABELS[key]} signal ${value} out of 100; current weight ${state.weights[key]} percent"><span>${SIGNAL_LABELS[key]}</span><i><b style="width:${value}%"></b></i><strong>${value}</strong></div>`).join('');

  const image = $('#best-image');
  const fallback = $('#image-fallback');
  if (best.imageUrl) {
    image.src = best.imageUrl;
    image.alt = `${best.name} at ${best.library}`;
    image.hidden = false;
    fallback.hidden = true;
  } else {
    image.removeAttribute('src'); image.alt = ''; image.hidden = true; fallback.hidden = false;
  }

  $('#runner-ups').innerHTML = ranked.slice(1, 4).map((record, index) => `
    <article class="runner-card">
      <div><span class="rank">0${index + 2}</span><strong>${record.fit}</strong></div>
      <h5>${esc(record.name)}</h5><p>${esc(record.library)} · ${record.noise} · ${record.seats ?? 'unknown'} seats</p>
    </article>`).join('');
}

function renderKPIs(records) {
  $('#kpi-spaces').textContent = records.length;
  $('#kpi-libraries').textContent = new Set(records.map(record => record.library)).size;
  $('#kpi-seats').textContent = records.reduce((sum, record) => sum + (record.seats || 0), 0).toLocaleString();
  $('#kpi-access').textContent = `${pct(records.filter(record => record.accessible).length, records.length)}%`;
}

function renderRank(records) {
  const ranked = records.map(record => ({...record, fit:score(record)})).sort((a, b) => b.fit - a.fit || a.name.localeCompare(b.name)).slice(0, 10);
  $('#rank-caption').textContent = `${modeLabel()} · score out of 100`;
  $('#rank-chart').innerHTML = ranked.length ? ranked.map((record, index) => `
    <button class="bar-row" type="button" data-compare-id="${record.id}" title="Add ${esc(record.name)} to comparison">
      <span class="bar-label"><b>${index + 1}</b>${esc(record.name)}</span>
      <span class="bar-track"><i style="width:${record.fit}%"></i></span>
      <strong>${record.fit}</strong>
    </button>`).join('') : '<p class="no-chart">No records to chart.</p>';
  $('#rank-chart').setAttribute('aria-label', ranked.map(record => `${record.name}: ${record.fit}`).join('; '));
}

function renderCoverage(records) {
  const features = [['accessible','Accessibility'], ['charging','Charging'], ['reservable','Reservable'], ['foodOrCafe','Food / café'], ['display','Display'], ['whiteboards','Whiteboard']];
  $('#coverage-chart').innerHTML = features.map(([key, label]) => {
    const count = records.filter(record => key === 'foodOrCafe' ? record.food || record.cafe : record[key]).length;
    const share = pct(count, records.length);
    return `<div class="coverage-row"><div><span>${label}</span><b>${share}%</b></div><div class="coverage-track"><i style="width:${share}%"></i></div><small>${count} of ${records.length}</small></div>`;
  }).join('');
  $('#coverage-chart').setAttribute('aria-label', features.map(([key, label]) => `${label}: ${pct(records.filter(record => key === 'foodOrCafe' ? record.food || record.cafe : record[key]).length, records.length)} percent`).join('; '));
}

function renderScatter(records) {
  const width = 620, height = 350, pad = 44;
  const x = value => pad + (width - pad * 2) * (value / 100);
  const y = value => height - pad - (height - pad * 2) * (value / 100);
  const grid = [0, 25, 50, 75, 100].map(value => `<line x1="${x(value)}" y1="${pad}" x2="${x(value)}" y2="${height - pad}"/><line x1="${pad}" y1="${y(value)}" x2="${width - pad}" y2="${y(value)}"/><text x="${x(value)}" y="${height - 18}" text-anchor="middle">${value}</text><text x="${pad - 10}" y="${y(value) + 4}" text-anchor="end">${value}</text>`).join('');
  const dots = records.map(record => {
    const signals = signalScores(record);
    const active = state.library !== 'all' && record.library === state.library;
    return `<circle cx="${x(signals.quiet)}" cy="${y(signals.collaboration)}" r="6" class="${active ? 'selected-dot' : ''}" tabindex="0"><title>${esc(record.name)}: quiet ${signals.quiet}, collaboration ${signals.collaboration}</title></circle>`;
  }).join('');
  $('#scatter-chart').innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true"><g class="grid">${grid}</g><line class="axis" x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}"/><line class="axis" x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}"/><g class="dots">${dots}</g><text class="axis-label" x="${width / 2}" y="${height - 2}" text-anchor="middle">Quiet signal →</text><text class="axis-label" transform="translate(14 ${height / 2}) rotate(-90)" text-anchor="middle">Collaboration signal →</text></svg>`;
}

function renderLibraryTable(records) {
  const groups = [...new Set(records.map(record => record.library))].map(library => ({library, rows:records.filter(record => record.library === library)})).sort((a, b) => b.rows.length - a.rows.length || a.library.localeCompare(b.library));
  $('#library-table').innerHTML = groups.length ? groups.map(group => {
    const seats = group.rows.reduce((sum, record) => sum + (record.seats || 0), 0);
    const quiet = group.rows.filter(record => ['0','1'].includes(record.noiseCode)).length;
    return `<tr><th><button class="library-link" type="button" data-library="${esc(group.library)}">${esc(group.library)}</button></th><td>${group.rows.length}</td><td>${seats.toLocaleString()}</td><td>${pct(group.rows.filter(record => record.accessible).length, group.rows.length)}%</td><td>${quiet}</td><td>${group.rows.filter(record => record.reservable).length}</td><td>${group.rows.filter(record => record.display).length}</td><td>${group.rows.filter(record => record.whiteboards).length}</td></tr>`;
  }).join('') : '<tr><td colspan="8">No records match the current filters.</td></tr>';
}

function sortedRecords(records) {
  const copy = records.map(record => ({...record, fit:score(record)}));
  if (state.sort === 'seats') return copy.sort((a, b) => (b.seats || 0) - (a.seats || 0) || a.name.localeCompare(b.name));
  if (state.sort === 'name') return copy.sort((a, b) => a.name.localeCompare(b.name));
  if (state.sort === 'library') return copy.sort((a, b) => a.library.localeCompare(b.library) || a.name.localeCompare(b.name));
  return copy.sort((a, b) => b.fit - a.fit || a.name.localeCompare(b.name));
}

function renderRecords(records) {
  const rows = sortedRecords(records);
  $('#records-table').innerHTML = rows.length ? rows.map(record => {
    const selected = state.compare.includes(record.id);
    return `<tr>
      <td><button class="compare-toggle ${selected ? 'selected' : ''}" type="button" data-compare-id="${record.id}" aria-pressed="${selected}">${selected ? 'Added' : 'Add'}</button></td>
      <th><a href="${esc(record.sourceUrl)}" target="_blank" rel="noreferrer">${esc(record.name)} ↗</a><small>${esc(record.level)}</small></th>
      <td><strong class="table-score">${record.fit}</strong></td><td>${esc(record.library)}</td><td>${esc(record.type)}</td><td>${record.seats ?? '—'}</td><td>${esc(record.noise)}</td>
      <td>${yesNo(record.accessible)}</td><td>${yesNo(record.reservable)}</td><td>${record.featureCount}</td>
    </tr>`;
  }).join('') : '<tr><td colspan="10">No records match the current filters.</td></tr>';
  $('#records-note').textContent = records.length === DATA.length ? `Showing all ${DATA.length} official records.` : `Showing ${records.length} of ${DATA.length} official records after filters.`;
}

function comparisonCard(record) {
  const signals = signalScores(record);
  const image = record.imageUrl ? `<img src="${esc(record.imageUrl)}" alt="${esc(record.name)}">` : '<div class="compare-image-fallback">H</div>';
  return `<article class="comparison-card">
    <figure>${image}<figcaption>${esc(record.library)}</figcaption></figure>
    <div class="comparison-head"><div><h3>${esc(record.name)}</h3><p>${esc(record.type)}</p></div><strong>${score(record)}</strong></div>
    <dl><div><dt>Seats</dt><dd>${record.seats ?? 'Unknown'}</dd></div><div><dt>Noise</dt><dd>${record.noise}</dd></div><div><dt>Reservable</dt><dd>${record.reservable ? 'Yes' : 'Not listed'}</dd></div><div><dt>Access</dt><dd>${record.accessible ? 'Listed' : 'Not listed'}</dd></div></dl>
    <div class="signal-list">${Object.entries(signals).map(([key, value]) => `<div><span>${SIGNAL_LABELS[key]}</span><i><b style="width:${value}%"></b></i><strong>${value}</strong></div>`).join('')}</div>
  </article>`;
}

function renderCompare() {
  state.compare = state.compare.filter(id => DATA.some(record => record.id === id)).slice(0, 3);
  const selected = state.compare.map(id => DATA.find(record => record.id === id)).filter(Boolean);
  $('#compare-chips').innerHTML = selected.map(record => `<button type="button" data-remove-compare="${record.id}" title="Remove ${esc(record.name)}">${esc(record.name)} <span>×</span></button>`).join('');
  $('#compare-add').innerHTML = `<option value="">${selected.length >= 3 ? 'Remove a space to add another' : 'Choose from 103 spaces…'}</option>${DATA.filter(record => !state.compare.includes(record.id)).map(record => `<option value="${record.id}">${esc(record.name)} · ${esc(record.library)}</option>`).join('')}`;
  $('#compare-add').disabled = selected.length >= 3;
  $('#comparison-grid').innerHTML = selected.length ? selected.map(comparisonCard).join('') : '<p class="compare-empty">Choose up to three spaces to compare their facility signals.</p>';

  if (!selected.length) { $('#compare-insight').textContent = 'No spaces selected yet.'; return; }
  const fitLeader = [...selected].sort((a, b) => score(b) - score(a))[0];
  const capacityLeader = [...selected].sort((a, b) => (b.seats || 0) - (a.seats || 0))[0];
  $('#compare-insight').textContent = `${fitLeader.name} has the strongest ${modeLabel().toLowerCase()} fit in this set (${score(fitLeader)}/100). ${capacityLeader.name} has the largest listed capacity (${capacityLeader.seats ?? 'unknown'} seats).`;
}

function syncWeights() {
  Object.entries(state.weights).forEach(([key, value]) => {
    $(`#weight-${key}`).value = value;
    $(`#weight-${key}-value`).textContent = `${value}%`;
  });
  $('#weight-total').textContent = `${Object.values(state.weights).reduce((sum, value) => sum + value, 0)}%`;
  $('#weight-mode').textContent = modeLabel();
  $('#hero-goal-label').textContent = modeLabel();
}

function render() {
  const records = filteredData();
  renderBest(records);
  renderKPIs(records);
  renderRank(records);
  renderCoverage(records);
  renderScatter(records);
  renderLibraryTable(records);
  renderRecords(records);
  renderCompare();
}

function setGoal(goal) {
  if (!GOALS[goal]) return;
  state.goal = goal;
  state.weights = {...GOALS[goal].weights};
  $$('[data-goal]').forEach(button => {
    const active = button.dataset.goal === goal;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  syncWeights();
  render();
}

function toggleCompare(id) {
  if (state.compare.includes(id)) state.compare = state.compare.filter(value => value !== id);
  else if (state.compare.length < 3) state.compare.push(id);
  else {
    $('#compare-insight').textContent = 'Comparison is limited to three spaces. Remove one before adding another.';
    return;
  }
  renderCompare();
  renderRecords(filteredData());
}

function setup() {
  const libraries = [...new Set(DATA.map(record => record.library))].sort();
  const types = [...new Set(DATA.map(record => record.type))].sort();
  $('#library-filter').innerHTML = `<option value="all">All ${libraries.length} libraries</option>${libraries.map(value => `<option>${esc(value)}</option>`).join('')}`;
  $('#type-filter').innerHTML = `<option value="all">All ${types.length} space types</option>${types.map(value => `<option>${esc(value)}</option>`).join('')}`;

  $$('[data-goal]').forEach(button => button.addEventListener('click', () => setGoal(button.dataset.goal)));
  $('#library-filter').addEventListener('change', event => { state.library = event.target.value; render(); });
  $('#type-filter').addEventListener('change', event => { state.type = event.target.value; render(); });
  $('#noise-filter').addEventListener('change', event => { state.noise = event.target.value; render(); });
  $('#seats-filter').addEventListener('change', event => { state.minSeats = Number(event.target.value); render(); });
  $('#space-search').addEventListener('input', event => { state.search = event.target.value; render(); });
  $('#records-sort').addEventListener('change', event => { state.sort = event.target.value; renderRecords(filteredData()); });
  [['accessible-filter','accessible'], ['reservable-filter','reservable'], ['food-filter','food']].forEach(([id, key]) => $(`#${id}`).addEventListener('change', event => { state[key] = event.target.checked; render(); }));

  $$('.weight-slider').forEach(slider => slider.addEventListener('input', event => {
    state.goal = 'custom';
    state.weights[event.target.dataset.signal] = Number(event.target.value);
    $$('[data-goal]').forEach(button => { button.classList.remove('active'); button.setAttribute('aria-pressed', 'false'); });
    syncWeights();
    render();
  }));
  $('#reset-weights').addEventListener('click', () => setGoal(state.goal === 'custom' ? 'focus' : state.goal));

  $('#compare-add').addEventListener('change', event => { if (event.target.value) toggleCompare(event.target.value); });
  $('#compare-chips').addEventListener('click', event => { const button = event.target.closest('[data-remove-compare]'); if (button) toggleCompare(button.dataset.removeCompare); });
  $('#records-table').addEventListener('click', event => { const button = event.target.closest('[data-compare-id]'); if (button) toggleCompare(button.dataset.compareId); });
  $('#rank-chart').addEventListener('click', event => { const button = event.target.closest('[data-compare-id]'); if (button) { toggleCompare(button.dataset.compareId); location.hash = 'compare'; } });
  $('#library-table').addEventListener('click', event => {
    const button = event.target.closest('[data-library]');
    if (!button) return;
    state.library = button.dataset.library;
    $('#library-filter').value = state.library;
    render();
    location.hash = 'explore';
  });

  $('#clear-filters').addEventListener('click', () => {
    Object.assign(state, {library:'all', type:'all', noise:'all', minSeats:0, accessible:false, reservable:false, food:false, search:''});
    $('#library-filter').value = 'all'; $('#type-filter').value = 'all'; $('#noise-filter').value = 'all'; $('#seats-filter').value = '0'; $('#space-search').value = '';
    $('#accessible-filter').checked = false; $('#reservable-filter').checked = false; $('#food-filter').checked = false;
    render();
  });

  $('#best-image').addEventListener('error', () => { $('#best-image').hidden = true; $('#image-fallback').hidden = false; });
  $('.menu-button').addEventListener('click', event => {
    const open = event.currentTarget.getAttribute('aria-expanded') === 'true';
    event.currentTarget.setAttribute('aria-expanded', String(!open));
    $('#site-nav').classList.toggle('open', !open);
  });
  $('#site-nav').addEventListener('click', event => { if (event.target.matches('a')) { $('#site-nav').classList.remove('open'); $('.menu-button').setAttribute('aria-expanded', 'false'); } });

  if (!DATA.some(record => state.compare.includes(record.id))) state.compare = DATA.slice(0, 3).map(record => record.id);
  syncWeights();
  render();
}

setup();
