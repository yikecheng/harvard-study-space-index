const DATA = window.SPACE_DATA || [];
const META = window.DATA_META || {};

const GOALS = {
  focus: {label:'Deep-focus', weights:{silent:20,quietOrLess:10,privateDesks:20,charging:12,reservable:8,accessible:10,independent:10,standingDesks:5,quietAmenity:5}},
  group: {label:'Group-work', weights:{groupType:22,whiteboards:18,display:15,reservable:15,charging:10,accessible:10,seats6:5,webcam:5}},
  make: {label:'Make-and-present', weights:{mediaType:20,display:20,techLoan:20,webcam:10,whiteboards:10,charging:5,accessible:5,reservable:5,standingDesks:5}},
  comfort: {label:'Comfort-break', weights:{couches:20,food:15,cafe:10,charging:15,accessible:15,openType:10,conversation:10,seats20:5}}
};

const FEATURE_LABELS = {
  accessible:'Accessible', charging:'Charging', cafe:'Café onsite', conversation:'Conversation area',
  couches:'Soft seating', food:'Food / drink allowed', lockers:'Lockers', mediaStudios:'Media studio',
  printers:'Printers / scanners', privateDesks:'Private desks', display:'Display / projector',
  quietAmenity:'Quiet-study area', reservable:'Reservable', singleStallRestrooms:'Single-stall restroom',
  standingDesks:'Standing desks', techLoan:'Tech loan', webcam:'Webcam', whiteboards:'Whiteboard / chalkboard'
};

let state = {goal:'focus', library:'all', type:'all', noise:'all', minSeats:0, accessible:false, reservable:false, food:false, search:''};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const pct = (n, d) => d ? Math.round(n / d * 100) : 0;
const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const yesNo = value => value ? '<span class="yes">Listed</span>' : '<span class="unknown">Not listed</span>';

function valueFor(record, key) {
  if (key === 'silent') return record.noiseCode === '0' ? 1 : 0;
  if (key === 'quietOrLess') return ['0', '1'].includes(record.noiseCode) ? 1 : 0;
  if (key === 'independent') return /Independent Study Room|Study Carrel/.test(record.type) ? 1 : 0;
  if (key === 'groupType') return /Group Study Room|Meeting and Presentation Space/.test(record.type) ? 1 : 0;
  if (key === 'mediaType') return /Media Lab|Meeting and Presentation Space/.test(record.type) ? 1 : 0;
  if (key === 'openType') return record.openSpace ? 1 : 0;
  if (key === 'seats6') return (record.seats || 0) >= 6 ? 1 : 0;
  if (key === 'seats20') return (record.seats || 0) >= 20 ? 1 : 0;
  return record[key] || 0;
}

function score(record, goal = state.goal) {
  return Object.entries(GOALS[goal].weights).reduce((sum, [key, weight]) => sum + valueFor(record, key) * weight, 0);
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

function reasonFor(record) {
  const byGoal = {
    focus:['silent','privateDesks','charging','reservable','accessible','standingDesks'],
    group:['groupType','whiteboards','display','reservable','charging','webcam'],
    make:['mediaType','display','techLoan','webcam','whiteboards','standingDesks'],
    comfort:['couches','food','cafe','charging','accessible','conversation']
  };
  const special = {silent:'silent noise level', groupType:'collaborative room type', mediaType:'media/presentation room type'};
  const labels = byGoal[state.goal].filter(key => valueFor(record, key)).slice(0, 4).map(key => special[key] || FEATURE_LABELS[key]?.toLowerCase());
  if (!labels.length) return 'This space matches mainly through its published space type; few goal-specific amenities are listed.';
  return `Its official record includes ${labels.join(', ')}—the strongest published combination under this task weighting.`;
}

function renderBest(records) {
  const ranked = records.map(record => ({...record, fit:score(record)})).sort((a, b) => b.fit - a.fit || a.name.localeCompare(b.name));
  $('#match-count').textContent = `${records.length} match${records.length === 1 ? '' : 'es'}`;
  $('#empty-state').hidden = ranked.length > 0;
  ['.result-heading', '#best-reason', '#best-features', '.results-panel .note', '.runner-section'].forEach(selector => $(selector).hidden = ranked.length === 0);
  if (!ranked.length) return;

  const best = ranked[0];
  $('#best-name').textContent = best.name;
  $('#best-meta').textContent = `${best.library} · ${best.level} · ${best.type} · ${best.seats ?? 'unknown'} seats`;
  $('#best-score').innerHTML = `${best.fit}<span>/100</span>`;
  $('#best-reason').textContent = reasonFor(best);
  const relevant = listedFeatures(best).slice(0, 7);
  $('#best-features').innerHTML = [best.noise !== 'Not listed' ? `<span>${esc(best.noise)} noise</span>` : '', ...relevant.map(key => `<span>${FEATURE_LABELS[key]}</span>`)].join('') || '<span>Few amenities listed</span>';
  $('#runner-ups').innerHTML = ranked.slice(1, 4).map((record, index) => `
    <article class="runner-card">
      <div><span class="rank">0${index + 2}</span><strong>${record.fit}</strong></div>
      <h5>${esc(record.name)}</h5><p>${esc(record.library)} · ${record.seats ?? 'unknown'} seats</p>
    </article>`).join('');
}

function renderKPIs(records) {
  $('#kpi-spaces').textContent = records.length;
  $('#kpi-libraries').textContent = new Set(records.map(record => record.library)).size;
  $('#kpi-seats').textContent = records.reduce((sum, record) => sum + (record.seats || 0), 0).toLocaleString();
  $('#kpi-access').textContent = `${pct(records.filter(record => record.accessible).length, records.length)}%`;
}

function renderRank(records) {
  const ranked = records.map(record => ({...record, fit:score(record)})).sort((a, b) => b.fit - a.fit).slice(0, 10);
  $('#rank-caption').textContent = `${GOALS[state.goal].label} weighting · score out of 100`;
  $('#rank-chart').innerHTML = ranked.length ? ranked.map((record, index) => `
    <div class="bar-row">
      <span class="bar-label" title="${esc(record.name)}"><b>${index + 1}</b>${esc(record.name)}</span>
      <span class="bar-track"><i style="width:${record.fit}%"></i></span>
      <strong>${record.fit}</strong>
    </div>`).join('') : '<p class="no-chart">No records to chart.</p>';
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
    const focus = score(record, 'focus'), group = score(record, 'group');
    const active = state.library !== 'all' && record.library === state.library;
    return `<circle cx="${x(focus)}" cy="${y(group)}" r="6" class="${active ? 'selected-dot' : ''}" tabindex="0"><title>${esc(record.name)}: focus ${focus}, group ${group}</title></circle>`;
  }).join('');
  $('#scatter-chart').innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true"><g class="grid">${grid}</g><line class="axis" x1="${pad}" y1="${height - pad}" x2="${width - pad}" y2="${height - pad}"/><line class="axis" x1="${pad}" y1="${pad}" x2="${pad}" y2="${height - pad}"/><g class="dots">${dots}</g><text class="axis-label" x="${width / 2}" y="${height - 2}" text-anchor="middle">Focus fit →</text><text class="axis-label" transform="translate(14 ${height / 2}) rotate(-90)" text-anchor="middle">Group fit →</text></svg>`;
}

function renderLibraryTable(records) {
  const groups = [...new Set(records.map(record => record.library))].map(library => ({library, rows:records.filter(record => record.library === library)})).sort((a, b) => b.rows.length - a.rows.length || a.library.localeCompare(b.library));
  $('#library-table').innerHTML = groups.length ? groups.map(group => {
    const seats = group.rows.reduce((sum, record) => sum + (record.seats || 0), 0);
    const quiet = group.rows.filter(record => ['0','1'].includes(record.noiseCode)).length;
    return `<tr><th>${esc(group.library)}</th><td>${group.rows.length}</td><td>${seats.toLocaleString()}</td><td>${pct(group.rows.filter(record => record.accessible).length, group.rows.length)}%</td><td>${quiet}</td><td>${group.rows.filter(record => record.reservable).length}</td><td>${group.rows.filter(record => record.charging).length}</td><td>${group.rows.filter(record => record.food || record.cafe).length}</td></tr>`;
  }).join('') : '<tr><td colspan="8">No records match the current filters.</td></tr>';
}

function renderRecords(records) {
  $('#records-table').innerHTML = records.length ? records.map(record => `<tr>
    <th><a href="${esc(record.sourceUrl)}" target="_blank" rel="noreferrer">${esc(record.name)} ↗</a><small>${esc(record.level)}</small></th>
    <td>${esc(record.library)}</td><td>${esc(record.type)}</td><td>${record.seats ?? '—'}</td><td>${esc(record.noise)}</td>
    <td>${yesNo(record.accessible)}</td><td>${yesNo(record.reservable)}</td><td>${yesNo(record.charging)}</td><td>${record.featureCount}</td>
  </tr>`).join('') : '<tr><td colspan="9">No records match the current filters.</td></tr>';
  $('#records-note').textContent = records.length === DATA.length ? `Showing all ${DATA.length} official records.` : `Showing ${records.length} of ${DATA.length} official records after filters.`;
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
}

function setup() {
  const libraries = [...new Set(DATA.map(record => record.library))].sort();
  const types = [...new Set(DATA.map(record => record.type))].sort();
  $('#library-filter').innerHTML = `<option value="all">All ${libraries.length} libraries</option>${libraries.map(value => `<option>${esc(value)}</option>`).join('')}`;
  $('#type-filter').innerHTML = `<option value="all">All ${types.length} space types</option>${types.map(value => `<option>${esc(value)}</option>`).join('')}`;

  $$('.goal').forEach(button => button.addEventListener('click', () => {
    state.goal = button.dataset.goal;
    $$('.goal').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', item === button); });
    render();
  }));
  $('#library-filter').addEventListener('change', event => { state.library = event.target.value; render(); });
  $('#type-filter').addEventListener('change', event => { state.type = event.target.value; render(); });
  $('#noise-filter').addEventListener('change', event => { state.noise = event.target.value; render(); });
  $('#seats-filter').addEventListener('change', event => { state.minSeats = Number(event.target.value); render(); });
  $('#space-search').addEventListener('input', event => { state.search = event.target.value; render(); });
  [['accessible-filter','accessible'], ['reservable-filter','reservable'], ['food-filter','food']].forEach(([id, key]) => $(`#${id}`).addEventListener('change', event => { state[key] = event.target.checked; render(); }));
  $('#clear-filters').addEventListener('click', () => {
    state = {goal:state.goal, library:'all', type:'all', noise:'all', minSeats:0, accessible:false, reservable:false, food:false, search:''};
    $('#library-filter').value = 'all'; $('#type-filter').value = 'all'; $('#noise-filter').value = 'all'; $('#seats-filter').value = '0'; $('#space-search').value = '';
    $('#accessible-filter').checked = false; $('#reservable-filter').checked = false; $('#food-filter').checked = false;
    render();
  });
  $('.menu-button').addEventListener('click', event => {
    const open = event.currentTarget.getAttribute('aria-expanded') === 'true';
    event.currentTarget.setAttribute('aria-expanded', String(!open));
    $('#site-nav').classList.toggle('open', !open);
  });
  $('#dataset-stamp').textContent = `${META.totalRecords || DATA.length} records · ${META.totalLibraries || libraries.length} libraries · ${(META.totalListedSeats || 0).toLocaleString()} listed seats`;
  render();
}

setup();
