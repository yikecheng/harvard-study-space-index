const DATA = [
  {id:'cab-discovery',name:'Cabot L102 — Discovery Bar',library:'Cabot Science Library',level:'Main Level',type:'Meeting & Presentation',quiet:0,accessible:1,reservable:0,charging:0,food:0,private:0,couches:0,display:1,whiteboard:0,tech:1,open24:1},
  {id:'cab-l202',name:'Cabot L202 — Group Study Room',library:'Cabot Science Library',level:'Second Floor',type:'Group Study Room',quiet:0,accessible:0,reservable:0,charging:0,food:1,private:0,couches:0,display:0,whiteboard:0,tech:1,open24:1},
  {id:'cab-chat-c',name:'Cabot Chat Booth C',library:'Cabot Science Library',level:'Lower Level',type:'Independent Study Room',quiet:1,accessible:1,reservable:1,charging:0,food:1,private:1,couches:0,display:0,whiteboard:0,tech:1,open24:1},
  {id:'cab-ll05',name:'Cabot LL05 — Group Study Room',library:'Cabot Science Library',level:'Lower Level',type:'Group Study Room',quiet:0,accessible:0,reservable:1,charging:0,food:1,private:0,couches:0,display:1,whiteboard:1,tech:0,open24:1},
  {id:'cab-main',name:'Cabot Main Level',library:'Cabot Science Library',level:'Main Level',type:'Open Space',quiet:0,accessible:0,reservable:0,charging:0,food:0,private:1,couches:1,display:0,whiteboard:0,tech:1,open24:1},
  {id:'cab-second',name:'Cabot Second Floor',library:'Cabot Science Library',level:'Second Floor',type:'Open Space',quiet:1,accessible:0,reservable:0,charging:0,food:1,private:0,couches:1,display:0,whiteboard:0,tech:1,open24:1},
  {id:'lam-220',name:'Lamont 220 — Small Group Study Room',library:'Lamont Library',level:'Second Floor',type:'Group Study Room',quiet:0,accessible:0,reservable:0,charging:0,food:1,private:0,couches:0,display:1,whiteboard:1,tech:1,open24:1},
  {id:'lam-310',name:'Lamont 310 — Media Lab Annex',library:'Lamont Library',level:'Third Floor',type:'Media Lab / Studio',quiet:0,accessible:0,reservable:0,charging:0,food:1,private:1,couches:0,display:0,whiteboard:0,tech:1,open24:1},
  {id:'lam-b30',name:'Lamont B30 — Collaborative Learning Space',library:'Lamont Library',level:'Lower Level',type:'Meeting & Presentation',quiet:0,accessible:0,reservable:0,charging:0,food:1,private:0,couches:1,display:1,whiteboard:1,tech:0,open24:1},
  {id:'lam-donatelli',name:'Lamont Donatelli Reading Room',library:'Lamont Library',level:'Third Floor',type:'Open Space',quiet:1,accessible:0,reservable:0,charging:1,food:1,private:1,couches:1,display:0,whiteboard:0,tech:1,open24:1},
  {id:'lam-cafe',name:'Lamont Library Café',library:'Lamont Library',level:'Main Level',type:'Open Space',quiet:0,accessible:0,reservable:0,charging:1,food:1,private:0,couches:1,display:0,whiteboard:0,tech:1,open24:1},
  {id:'lam-level-a',name:'Lamont Level A',library:'Lamont Library',level:'Level A',type:'Open Space',quiet:0,accessible:0,reservable:0,charging:0,food:1,private:1,couches:0,display:0,whiteboard:0,tech:1,open24:1},
  {id:'wid-150',name:'Widener 150 — Widener Reading Room',library:'Widener Library',level:'Main Level',type:'Open Space',quiet:0,accessible:1,reservable:0,charging:1,food:0,private:0,couches:1,display:0,whiteboard:0,tech:0,open24:0},
  {id:'wid-160',name:'Widener 160 — Phillips Reading Room',library:'Widener Library',level:'Main Level',type:'Open Space',quiet:1,accessible:1,reservable:0,charging:1,food:0,private:0,couches:0,display:0,whiteboard:0,tech:0,open24:0},
  {id:'wid-210',name:'Widener 210 — Loker Reading Room',library:'Widener Library',level:'Second Floor',type:'Open Space',quiet:1,accessible:1,reservable:0,charging:1,food:0,private:0,couches:1,display:0,whiteboard:0,tech:0,open24:0},
  {id:'wid-240',name:'Widener 240 — Collaborative Learning Space',library:'Widener Library',level:'Second Floor',type:'Open Space',quiet:0,accessible:0,reservable:0,charging:1,food:0,private:0,couches:0,display:1,whiteboard:1,tech:0,open24:0},
  {id:'wid-carrels',name:'Widener & Pusey Study Carrels',library:'Widener Library',level:'Library Stacks',type:'Study Carrel',quiet:1,accessible:0,reservable:1,charging:0,food:0,private:1,couches:0,display:0,whiteboard:0,tech:0,open24:0},
  {id:'wid-cafe',name:'Widener Café',library:'Widener Library',level:'Ground Floor',type:'Open Space',quiet:0,accessible:0,reservable:0,charging:1,food:1,private:0,couches:0,display:0,whiteboard:0,tech:0,open24:0},
  {id:'loe-aldrich',name:'Loeb Aldrich Reading Room',library:'Loeb Music Library',level:'Main Level',type:'Open Space',quiet:0,accessible:1,reservable:0,charging:1,food:0,private:0,couches:1,display:0,whiteboard:0,tech:0,open24:0},
  {id:'loe-listen1',name:'Loeb Group Listening Room 1',library:'Loeb Music Library',level:'Main Level',type:'Group Study Room',quiet:0,accessible:1,reservable:0,charging:0,food:0,private:1,couches:0,display:1,whiteboard:0,tech:0,open24:0},
  {id:'loe-group',name:'Loeb Group Study Room',library:'Loeb Music Library',level:'Main Level',type:'Group Study Room',quiet:0,accessible:1,reservable:1,charging:0,food:0,private:0,couches:0,display:0,whiteboard:0,tech:0,open24:0},
  {id:'loe-spalding',name:'Loeb Spalding Room',library:'Loeb Music Library',level:'Second Floor',type:'Open Space',quiet:0,accessible:1,reservable:0,charging:0,food:0,private:1,couches:1,display:0,whiteboard:0,tech:0,open24:0},
  {id:'fal-reading',name:'Fine Arts Library Reading Room',library:'Fine Arts Library',level:'Main Level',type:'Open Space',quiet:0,accessible:1,reservable:0,charging:1,food:0,private:0,couches:1,display:0,whiteboard:0,tech:0,open24:0},
  {id:'fal-carrels',name:'Fine Arts Library Study Carrels',library:'Fine Arts Library',level:'Library Stacks',type:'Study Carrel',quiet:1,accessible:0,reservable:1,charging:1,food:0,private:1,couches:0,display:0,whiteboard:0,tech:0,open24:0},
  {id:'yen-bib',name:'Harvard-Yenching Bibliography Room',library:'Harvard-Yenching Library',level:'Main Level',type:'Meeting & Presentation',quiet:0,accessible:1,reservable:1,charging:1,food:0,private:0,couches:1,display:1,whiteboard:0,tech:0,open24:0},
  {id:'yen-chinn',name:'Harvard-Yenching Chinn Ho Reading Room',library:'Harvard-Yenching Library',level:'Main Level',type:'Open Space',quiet:0,accessible:1,reservable:0,charging:1,food:0,private:0,couches:1,display:1,whiteboard:0,tech:0,open24:0},
  {id:'yen-group203',name:'Harvard-Yenching Group Study Room 203',library:'Harvard-Yenching Library',level:'Second Floor',type:'Group Study Room',quiet:0,accessible:0,reservable:1,charging:1,food:0,private:0,couches:0,display:1,whiteboard:0,tech:0,open24:0},
  {id:'yen-media202',name:'Harvard-Yenching Multimedia Room 202',library:'Harvard-Yenching Library',level:'Second Floor',type:'Media Lab / Studio',quiet:0,accessible:0,reservable:1,charging:0,food:0,private:0,couches:0,display:1,whiteboard:0,tech:1,open24:0},
  {id:'yen-reference',name:'Harvard-Yenching Reference Area',library:'Harvard-Yenching Library',level:'Lower Level',type:'Open Space',quiet:1,accessible:0,reservable:0,charging:0,food:0,private:0,couches:0,display:0,whiteboard:0,tech:0,open24:0},
  {id:'yen-carrels',name:'Harvard-Yenching Study Carrels',library:'Harvard-Yenching Library',level:'Library Stacks',type:'Study Carrel',quiet:0,accessible:1,reservable:0,charging:1,food:0,private:1,couches:0,display:0,whiteboard:0,tech:0,open24:0}
];

const GOALS = {
  focus: {label:'Deep-focus', weights:{quiet:28,private:24,charging:15,reservable:8,accessible:10,couches:5,study:5,open24:5}},
  group: {label:'Group-work', weights:{group:22,whiteboard:18,display:14,reservable:16,charging:8,accessible:10,food:5,tech:7}},
  make: {label:'Make-and-present', weights:{media:20,display:20,tech:20,whiteboard:10,charging:10,accessible:10,reservable:5,food:5}},
  comfort: {label:'Comfort-break', weights:{couches:25,food:20,charging:15,accessible:15,private:10,open:10,open24:5}}
};

const FEATURE_LABELS = {quiet:'Quiet listed',accessible:'Accessible listed',reservable:'Reservable listed',charging:'Charging listed',food:'Food / café',private:'Private desk',couches:'Soft seating',display:'Display',whiteboard:'Whiteboard',tech:'Tech loan',open24:'24-hour building'};
let state = {goal:'focus',library:'all',type:'all',accessible:false,reservable:false,food:false};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const pct = (n,d) => d ? Math.round(n/d*100) : 0;
const yesNo = (value) => value ? '<span class="yes">Listed</span>' : '<span class="unknown">Not listed</span>';

function valueFor(record,key){
  if(key === 'study') return /Study Carrel|Independent/.test(record.type) ? 1 : 0;
  if(key === 'group') return /Group|Meeting/.test(record.type) ? 1 : 0;
  if(key === 'media') return /Media|Meeting/.test(record.type) ? 1 : 0;
  if(key === 'open') return record.type === 'Open Space' ? 1 : 0;
  return record[key] || 0;
}

function score(record,goal=state.goal){
  return Object.entries(GOALS[goal].weights).reduce((sum,[key,weight]) => sum + valueFor(record,key)*weight,0);
}

function filteredData(){
  return DATA.filter(d =>
    (state.library === 'all' || d.library === state.library) &&
    (state.type === 'all' || d.type === state.type) &&
    (!state.accessible || d.accessible) &&
    (!state.reservable || d.reservable) &&
    (!state.food || d.food)
  );
}

function listedFeatures(record){
  return Object.keys(FEATURE_LABELS).filter(key => record[key]);
}

function reasonFor(record){
  const byGoal = {
    focus:['quiet','private','charging','reservable','open24'],
    group:['whiteboard','display','reservable','charging','accessible'],
    make:['display','tech','whiteboard','charging','reservable'],
    comfort:['couches','food','charging','accessible','private']
  };
  const labels = byGoal[state.goal].filter(k => valueFor(record,k)).slice(0,4).map(k => FEATURE_LABELS[k].toLowerCase());
  if(!labels.length) return 'This space matches through its published space type, but few goal-specific features are listed.';
  return `Its published record includes ${labels.join(', ')}—the strongest combination for this selection.`;
}

function renderBest(records){
  const ranked = records.map(d => ({...d,fit:score(d)})).sort((a,b) => b.fit-a.fit || a.name.localeCompare(b.name));
  $('#match-count').textContent = `${records.length} match${records.length === 1 ? '' : 'es'}`;
  $('#empty-state').hidden = ranked.length > 0;
  $('.result-heading').hidden = ranked.length === 0;
  $('#best-reason').hidden = ranked.length === 0;
  $('#best-features').hidden = ranked.length === 0;
  $('.results-panel .note').hidden = ranked.length === 0;
  $('.runner-section').hidden = ranked.length === 0;
  if(!ranked.length) return;

  const best = ranked[0];
  $('#best-name').textContent = best.name;
  $('#best-meta').textContent = `${best.library} · ${best.level} · ${best.type}`;
  $('#best-score').innerHTML = `${best.fit}<span>/100</span>`;
  $('#best-reason').textContent = reasonFor(best);
  const relevant = listedFeatures(best).slice(0,6);
  $('#best-features').innerHTML = relevant.map(k => `<span>${FEATURE_LABELS[k]}</span>`).join('') || '<span>Few features listed</span>';

  $('#runner-ups').innerHTML = ranked.slice(1,4).map((d,i) => `
    <article class="runner-card">
      <div><span class="rank">0${i+2}</span><strong>${d.fit}</strong></div>
      <h5>${d.name}</h5><p>${d.library}</p>
    </article>`).join('');
}

function renderKPIs(records){
  const libraries = new Set(records.map(d => d.library)).size;
  const featureKeys = ['quiet','accessible','reservable','charging','food','private','couches','display','whiteboard','tech'];
  const density = records.length ? records.reduce((sum,d) => sum + featureKeys.reduce((n,k) => n+d[k],0),0)/records.length : 0;
  $('#kpi-spaces').textContent = records.length;
  $('#kpi-libraries').textContent = libraries;
  $('#kpi-access').textContent = `${pct(records.filter(d => d.accessible).length,records.length)}%`;
  $('#kpi-density').textContent = density.toFixed(1);
}

function renderRank(records){
  const ranked = records.map(d => ({...d,fit:score(d)})).sort((a,b) => b.fit-a.fit).slice(0,8);
  $('#rank-caption').textContent = `${GOALS[state.goal].label} weighting · score out of 100`;
  $('#rank-chart').innerHTML = ranked.length ? ranked.map((d,i) => `
    <div class="bar-row">
      <span class="bar-label"><b>${i+1}</b>${d.name}</span>
      <span class="bar-track"><i style="width:${d.fit}%"></i></span>
      <strong>${d.fit}</strong>
    </div>`).join('') : '<p class="no-chart">No records to chart.</p>';
  $('#rank-chart').setAttribute('aria-label', ranked.map(d => `${d.name}: ${d.fit}`).join('; '));
}

function renderCoverage(records){
  const features = [['accessible','Accessibility'],['charging','Charging'],['quiet','Quiet'],['reservable','Reservable'],['food','Food / café'],['display','Display']];
  $('#coverage-chart').innerHTML = features.map(([key,label]) => {
    const count = records.filter(d => d[key]).length;
    const share = pct(count,records.length);
    return `<div class="coverage-row"><div><span>${label}</span><b>${share}%</b></div><div class="coverage-track"><i style="width:${share}%"></i></div><small>${count} of ${records.length}</small></div>`;
  }).join('');
  $('#coverage-chart').setAttribute('aria-label', features.map(([key,label]) => `${label}: ${pct(records.filter(d => d[key]).length,records.length)} percent`).join('; '));
}

function renderScatter(records){
  const w=620,h=350,pad=44;
  const x = v => pad + (w-pad*2)*(v/100);
  const y = v => h-pad - (h-pad*2)*(v/100);
  const selectedLibrary = state.library;
  const grid = [0,25,50,75,100].map(v => `<line x1="${x(v)}" y1="${pad}" x2="${x(v)}" y2="${h-pad}"/><line x1="${pad}" y1="${y(v)}" x2="${w-pad}" y2="${y(v)}"/><text x="${x(v)}" y="${h-18}" text-anchor="middle">${v}</text><text x="${pad-10}" y="${y(v)+4}" text-anchor="end">${v}</text>`).join('');
  const dots = records.map(d => {
    const focus=score(d,'focus'), group=score(d,'group');
    const active = selectedLibrary !== 'all' && d.library === selectedLibrary;
    return `<circle cx="${x(focus)}" cy="${y(group)}" r="7" class="${active ? 'selected-dot' : ''}" tabindex="0"><title>${d.name}: focus ${focus}, group ${group}</title></circle>`;
  }).join('');
  $('#scatter-chart').innerHTML = `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true"><g class="grid">${grid}</g><line class="axis" x1="${pad}" y1="${h-pad}" x2="${w-pad}" y2="${h-pad}"/><line class="axis" x1="${pad}" y1="${pad}" x2="${pad}" y2="${h-pad}"/><g class="dots">${dots}</g><text class="axis-label" x="${w/2}" y="${h-2}" text-anchor="middle">Focus fit →</text><text class="axis-label" transform="translate(14 ${h/2}) rotate(-90)" text-anchor="middle">Group fit →</text></svg>`;
}

function renderLibraryTable(records){
  const groups = [...new Set(records.map(d => d.library))].map(library => ({library,rows:records.filter(d => d.library === library)})).sort((a,b) => a.library.localeCompare(b.library));
  $('#library-table').innerHTML = groups.length ? groups.map(g => `
    <tr><th>${g.library}</th><td>${g.rows.length}</td><td>${g.rows.filter(d=>d.accessible).length}</td><td>${g.rows.filter(d=>d.quiet).length}</td><td>${g.rows.filter(d=>d.reservable).length}</td><td>${g.rows.filter(d=>d.charging).length}</td><td>${g.rows.filter(d=>d.food).length}</td></tr>`).join('') : '<tr><td colspan="7">No records match the current filters.</td></tr>';
}

function renderRecords(records){
  $('#records-table').innerHTML = records.length ? records.map(d => `<tr><th>${d.name}</th><td>${d.library}</td><td>${d.type}</td><td>${d.level}</td><td>${yesNo(d.quiet)}</td><td>${yesNo(d.accessible)}</td><td>${yesNo(d.reservable)}</td><td>${yesNo(d.charging)}</td></tr>`).join('') : '<tr><td colspan="8">No records match the current filters.</td></tr>';
  $('#records-note').textContent = records.length === DATA.length ? `Showing all ${DATA.length} records.` : `Showing ${records.length} of ${DATA.length} records after filters.`;
}

function render(){
  const records = filteredData();
  renderBest(records); renderKPIs(records); renderRank(records); renderCoverage(records); renderScatter(records); renderLibraryTable(records); renderRecords(records);
}

function setup(){
  const libraries = [...new Set(DATA.map(d=>d.library))].sort();
  const types = [...new Set(DATA.map(d=>d.type))].sort();
  $('#library-filter').insertAdjacentHTML('beforeend', libraries.map(v=>`<option>${v}</option>`).join(''));
  $('#type-filter').insertAdjacentHTML('beforeend', types.map(v=>`<option>${v}</option>`).join(''));
  $$('.goal').forEach(button => button.addEventListener('click', () => {
    state.goal=button.dataset.goal;
    $$('.goal').forEach(item => {item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',item===button)});
    render();
  }));
  $('#library-filter').addEventListener('change',e=>{state.library=e.target.value;render()});
  $('#type-filter').addEventListener('change',e=>{state.type=e.target.value;render()});
  [['accessible-filter','accessible'],['reservable-filter','reservable'],['food-filter','food']].forEach(([id,key]) => $(`#${id}`).addEventListener('change',e=>{state[key]=e.target.checked;render()}));
  $('#clear-filters').addEventListener('click',()=>{
    state={goal:state.goal,library:'all',type:'all',accessible:false,reservable:false,food:false};
    $('#library-filter').value='all'; $('#type-filter').value='all';
    $('#accessible-filter').checked=false; $('#reservable-filter').checked=false; $('#food-filter').checked=false; render();
  });
  $('.menu-button').addEventListener('click',e=>{const open=e.currentTarget.getAttribute('aria-expanded')==='true';e.currentTarget.setAttribute('aria-expanded',String(!open));$('#site-nav').classList.toggle('open',!open)});
  render();
}

setup();
