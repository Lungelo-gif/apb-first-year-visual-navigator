import { validateData, findPath, searchDestinations, escapeHTML as e } from './core.js';

const icons = {
  compass:'<circle cx="12" cy="12" r="9"/><path d="m16 8-2.6 5.4L8 16l2.6-5.4L16 8Z"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4M12 16h.01"/>',
  message:'<path d="M20 11.5a8.5 8.5 0 0 1-12.2 7.6L3 21l1.9-4.8A8.5 8.5 0 1 1 20 11.5Z"/><path d="M8 10h7M8 14h4"/>',
  book:'<path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1ZM12 5v15"/>',
  shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9S4 17 4 12V6l8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/>',
  classroom:'<path d="M3 10 12 4l9 6M5 9v11h14V9M10 20v-6h4v6M8 10h.01M16 10h.01"/>',
  pin:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  back:'<path d="M19 12H5m6-6-6 6 6 6"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  leaf:'<path d="M20 3c-9 0-16 3-16 10a7 7 0 0 0 7 7c7 0 9-8 9-17ZM4 21 15 10"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8" cy="8" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.pin}</svg>`;
const main = document.querySelector('main');
const announcer = document.querySelector('#announcer');
let locations, graph, startId = 'sample-entrance', query = '', imageTimer, loadController;
const announce = message => { announcer.textContent = message; };
const href = (screen, destination, step) => `#${screen}/${encodeURIComponent(destination)}?from=${encodeURIComponent(startId)}${step !== undefined ? `&step=${step}` : ''}`;
const banner = () => `<div class="demo-banner">${icon('info')}<p><strong>Demo routes · not verified for walking.</strong> These illustrations and directions are samples. Confirm the real APB route before using it on campus.</p></div>`;
const backHome = () => `<a class="breadcrumb" href="#home">${icon('back')} Back to destinations</a>`;

document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });

async function boot() {
  loadController?.abort();
  const controller = new AbortController(); loadController = controller;
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const fetchJSON = async path => {
      const response = await fetch(path, {signal:controller.signal});
      if (!response.ok) throw new Error(`Could not load ${path} (${response.status}).`);
      return response.json();
    };
    [locations, graph] = await Promise.all([fetchJSON('data/locations.json'), fetchJSON('data/routes.json')]);
    validateData(locations, graph);
    startId = locations.starts[0].id;
    render(false);
  } catch (error) {
    main.innerHTML = `<div class="fatal-error">${icon('compass')}<h1>Let’s get you back on track.</h1><p>We couldn’t load the route information. Check your connection, then try again. If you opened a downloaded file, run the local web server described in the README.</p><button class="primary-btn" data-action="retry-data">Try loading again</button><details><summary>Technical detail</summary><p>${e(error.name === 'AbortError' ? 'Loading took too long. Please retry.' : error.message)}</p></details></div>`;
    announce('Route information could not be loaded. A retry button is available.');
  } finally { clearTimeout(timeout); }
}

function home() {
  const start = locations.starts.find(s => s.id === startId);
  main.innerHTML = `
    <section class="welcome" aria-labelledby="welcome-heading">
      <div class="welcome-copy"><div class="eyebrow">First year. New places. You’ve got this.</div><h1 id="welcome-heading">Find your way.<br><em>Find your feet.</em></h1><p>A little less “where am I?”<br>A little more confidence on your APB journey.</p></div>
      <div class="welcome-art"><img src="assets/images/placeholders/hero.svg" alt="Illustrative campus buildings, trees and a path; not a depiction of APB." width="1000" height="760"><span class="art-label">ILLUSTRATIVE PLACEHOLDER · NOT APB</span></div>
    </section>
    <div class="intro-strip"><p>${icon('info')} You’re exploring a student prototype. All routes are unverified samples.</p><span>NO GPS NEEDED · AT YOUR OWN PACE</span></div>
    <div class="home-grid"><section aria-labelledby="destinations-heading">
      <div class="section-heading"><h2 id="destinations-heading">Where are we headed?</h2><span>4 destinations to explore</span></div><p class="section-lead">Choose where you’re starting, then pick your next stop.</p>
      <div class="origin-field"><div class="origin-symbol">${icon('pin')}</div><div><label for="start-location">I’m starting from</label><select id="start-location" aria-describedby="origin-note">${locations.starts.map(s => `<option value="${e(s.id)}" ${s.id === startId ? 'selected' : ''}>${e(s.name)}</option>`).join('')}</select></div></div>
      <p class="origin-note" id="origin-note">${e(start.note)}</p>
      <div class="search-field">${icon('search')}<label class="sr-only" for="destination-search">Search destinations</label><input id="destination-search" type="search" placeholder="Search a place, like library or computer lab…" value="${e(query)}" autocomplete="off" maxlength="100"><button class="clear-search" aria-label="Clear destination search" data-action="clear-search" ${query ? '' : 'hidden'}>×</button></div>
      <div class="destination-grid" id="destination-results"></div><p class="sr-only" id="search-status" role="status" aria-live="polite" aria-atomic="true"></p>
    </section><aside class="home-aside" aria-label="How visual navigation works">
      <div class="preview-card"><div class="preview-photo"><img src="assets/images/placeholders/walkway.svg" alt="Sample illustration of a walkway used to demonstrate visual checkpoints." width="1400" height="800" loading="lazy"><span class="photo-step">A GLIMPSE OF YOUR JOURNEY</span><span class="art-label">PLACEHOLDER IMAGE</span></div><div class="preview-copy"><div class="eyebrow">One checkpoint at a time</div><h3>Look. Follow.<br>You’re on your way.</h3><p>Simple directions and recognisable views help you take the next step.</p><ol class="mini-steps"><li><span>1</span> Choose your destination</li><li><span>2</span> Follow the visual checkpoints</li><li><span>3</span> Arrive with a little more confidence</li></ol></div></div>
      <div class="small-note">${icon('leaf')}<p><strong>Small steps. Less data.</strong><br>No live maps, no sign-in. Just one lightweight checkpoint image at a time.</p></div>
    </aside></div>`;
  renderDestinations();
}

function renderDestinations() {
  const results = searchDestinations(locations.destinations, query);
  document.querySelector('#destination-results').innerHTML = results.length ? results.map(d => `<a class="destination-card" href="${href('route', d.id)}"><span class="card-icon ${e(d.color)}">${icon(d.icon)}</span><span class="card-arrow">${icon('arrow')}</span><div class="card-category">${e(d.category)}</div><h3>${e(d.name)}</h3><div class="card-meta"><span></span> Sample route${['computer-lab','classroom'].includes(d.id) ? ' · Room TBC' : ' · Unverified'}</div></a>`).join('') : `<div class="no-results"><strong>No destinations found for “${e(query)}”.</strong><br>Try “library”, “security”, “computer lab” or “classroom”.<br><button class="text-btn" data-action="clear-search">Clear search ${icon('arrow')}</button></div>`;
  document.querySelector('#search-status').textContent = `${results.length} destination${results.length === 1 ? '' : 's'} found.`;
  document.querySelector('.clear-search').hidden = !query;
}

function routeSummary(context) {
  const { destination:d, route, path, start } = context;
  main.innerHTML = `${backHome()}<header class="page-heading"><div class="eyebrow">Your journey, at a glance</div><h1>${e(d.name)}</h1><p>Take a look at the route before your first step.</p></header>${banner()}
    <div class="summary-grid"><section class="panel" aria-label="Route summary"><div class="summary-image"><img src="${e(graph.nodes[path.at(-1)].image.src)}" alt="${e(graph.nodes[path.at(-1)].image.alt)}" width="1400" height="800" data-summary-image><span class="art-label">${graph.nodes[path.at(-1)].image.isPlaceholder ? 'ILLUSTRATIVE PLACEHOLDER' : 'DESTINATION CHECKPOINT'}</span></div><div class="journey-endpoints"><div class="journey-point"><span class="field-label">Starting from</span><strong>${e(start.name)}</strong><p>${e(start.note)}</p></div><div class="journey-point"><span class="field-label">Going to</span><strong>${e(d.name)}</strong><p>${e(d.endpoint)}</p></div></div><div class="route-facts"><div><strong>${path.length} stops</strong><span>Visual checkpoints</span></div><div><strong>Your pace</strong><span>Manual navigation</span></div><div><strong>Sample</strong><span>Not a verified route</span></div></div><p class="info-text">${e(route.summary)}</p><a class="primary-btn full-width" href="${href('navigate',d.id,1)}">Try visual navigation ${icon('arrow')}</a><p class="access-note">${icon('info')} <strong>Access details still needed.</strong> ${e(d.accessibility)} No distance or walking time has been verified.</p></section><section class="panel" aria-labelledby="checkpoints-heading"><h2 id="checkpoints-heading">Along the way</h2><p class="info-text">A quick preview of your sample checkpoints.</p><ol class="route-outline">${path.map(id => `<li>${e(graph.nodes[id].title)}<small>${e(graph.nodes[id].instruction)}</small></li>`).join('')}</ol><div class="access-note"><strong>Before using a real route</strong><br>Match the photo to your surroundings. If it doesn’t match, pause and ask campus staff for help.</div></section></div>`;
  const summaryImage = main.querySelector('[data-summary-image]');
  summaryImage.onerror = () => { summaryImage.hidden = true; summaryImage.parentElement.insertAdjacentHTML('afterbegin','<p class="image-error">Preview image unavailable. The checkpoint list is below.</p>'); };
}

function navigate(context, step) {
  const { destination:d, path } = context;
  const node = graph.nodes[path[step - 1]];
  main.innerHTML = `<div class="navigation-top"><div><h1>${e(d.name)}</h1><p>From ${e(context.start.name)}</p></div><a class="text-btn" href="${href('route',d.id)}">${icon('close')}<span>Exit navigation</span></a></div>${banner()}
    <div class="step-progress"><span class="step-count" id="step-label">Step ${step} of ${path.length}</span><progress max="${path.length}" value="${step}" aria-labelledby="step-label"></progress></div>
    <section class="checkpoint-view" aria-labelledby="checkpoint-instruction"><div class="checkpoint-photo" aria-busy="true"><div class="image-loading" role="status"><span class="spinner"></span> Loading checkpoint image…</div><img class="is-loading" id="checkpoint-image" alt="${e(node.image.alt)}" width="1400" height="800" decoding="async"><span class="checkpoint-badge">${e(node.title)}</span><div class="photo-arrows"><button class="photo-arrow" data-action="previous" aria-label="Previous checkpoint photograph" ${step === 1 ? 'disabled' : ''}>${icon('back')}</button><button class="photo-arrow" data-action="next" aria-label="${step === path.length ? 'Finish demo route' : 'Next checkpoint photograph'}">${icon(step === path.length ? 'check' : 'arrow')}</button></div><div class="photo-caption"><span class="placeholder-tag">${node.image.isPlaceholder ? 'Placeholder image · not an APB photograph' : 'Checkpoint photograph · compare with your surroundings'}</span><span class="sample-mark">${context.route.isSample ? 'SAMPLE ROUTE' : 'VISUAL CHECKPOINT'}</span></div></div><div class="checkpoint-content"><div class="eyebrow">${context.route.isSample ? 'Sample instruction' : 'Your next direction'}</div><h2 id="checkpoint-instruction">${e(node.instruction)}</h2><div class="landmark">${icon('eye')}<span>${e(node.landmark)}</span></div></div><div class="checkpoint-controls"><button class="secondary-btn" data-action="previous" ${step === 1 ? 'disabled' : ''}>${icon('back')} Previous</button><button class="primary-btn" data-action="next">${step === path.length ? 'Finish demo route' : 'Next checkpoint'} ${icon(step === path.length ? 'check' : 'arrow')}</button></div></section><p class="navigation-tip">Move at your own pace. Desktop: use <kbd>←</kbd> and <kbd>→</kbd> for checkpoints, <kbd>Esc</kbd> to exit.</p>`;
  loadCheckpointImage(node);
}

function loadCheckpointImage(node) {
  clearTimeout(imageTimer);
  const image = main.querySelector('#checkpoint-image');
  const photo = main.querySelector('.checkpoint-photo');
  const showError = () => {
    if (!photo.isConnected || photo.querySelector('.image-error')) return;
    clearTimeout(imageTimer); image.classList.add('is-loading');
    photo.querySelector('.image-loading').hidden = true;
    photo.setAttribute('aria-busy','false');
    photo.insertAdjacentHTML('beforeend',`<div class="image-error" role="status">${icon('image')}<strong>Checkpoint image unavailable</strong><p>Your written direction is below. Pause if you can’t identify the checkpoint.</p><button class="text-btn" data-action="retry-image">Try image again</button></div>`);
  };
  image.onload = () => {
    if (!photo.isConnected) return;
    clearTimeout(imageTimer); image.classList.remove('is-loading');
    photo.querySelector('.image-loading').hidden = true;
    photo.querySelector('.image-error')?.remove();
    photo.setAttribute('aria-busy','false');
  };
  image.onerror = showError;
  imageTimer = setTimeout(showError, 10000);
  image.src = node.image.src;
}

function arrival(context) {
  const d = context.destination;
  main.innerHTML = `${backHome()}${banner()}<section class="arrival"><div class="arrival-check">${icon('check')}</div><div class="eyebrow">Sample route complete</div><h1>You’ve reached the final checkpoint.</h1><p class="destination-name">${e(d.name)}</p><p class="info-text">Nice work exploring the demo. This confirms the end of the sample sequence, not your physical location.</p><div class="panel arrival-info"><span class="field-label">Your destination</span><h2>${e(d.name)}</h2><p>${e(d.info)}</p><div class="access-note"><strong>Arrival point:</strong> ${e(d.endpoint)}<br><strong>Accessibility:</strong> ${e(d.accessibility)}</div></div><div class="arrival-actions"><a class="primary-btn" href="#home">Choose another destination ${icon('arrow')}</a><a class="secondary-btn" href="#feedback">${icon('message')} Share feedback</a><a class="text-btn" href="${href('navigate',d.id,context.path.length)}">${icon('back')} Back to last checkpoint</a></div></section>`;
}

function help() {
  main.innerHTML = `<div class="content-page">${backHome()}<div class="eyebrow">A little help along the way</div><h1>Your campus companion,<br>explained.</h1><p class="lead">APB First-Year Visual Navigator combines destination search, written instructions and visual checkpoints in a simple student experiment.</p><section class="panel content-section"><h2>About this prototype</h2><p><strong>Student proof of concept — not an official University of Johannesburg service.</strong></p><p>This project grew from a student idea connected to an FYO Marshal application. It demonstrates a first-year navigation experience that complements UJ’s existing Wayfinder application and separate virtual campus tours.</p><p>All current images are illustrative placeholders. Every route, both starting points, and the selected lab and classroom are unverified. Do not use the demo directions for walking on campus.</p></section><section class="panel content-section"><h2>How to try it</h2><ol><li>Choose a sample starting point and destination on the home screen.</li><li>Review the route summary and select “Try visual navigation”.</li><li>Read each direction and use Previous and Next to move through the photos.</li><li>Finish the sample route, then choose another destination or share feedback.</li></ol><p>You can use a keyboard: <kbd>Tab</kbd> moves between controls, <kbd>Enter</kbd> activates links and buttons, arrow keys change checkpoints, and <kbd>Esc</kbd> exits navigation.</p></section><section class="panel content-section"><h2>Photos, not 360° views</h2><p>The planned real version uses wide checkpoint photographs taken with an iPhone 13 Pro Max. You move through a sequence with the on-screen arrows. This is not live GPS navigation or a true 360° tour. An authorised 360° version may be explored in future.</p></section><section class="panel content-section"><h2>Privacy and data</h2><p>No account, database, analytics, payments or location permission is used. Your choices stay in this browser tab and its URL. The static hosting provider handles normal web requests. Feedback is downloaded to your device; the app sends no feedback online.</p><p>Only the current navigation image loads. Real photos should be compressed before upload. The app needs a connection to load its files and does not promise offline access.</p></section><section class="panel content-section"><h2>If something doesn’t look right</h2><p>A missing image leaves the written direction available and offers a retry. If a future photo does not match your surroundings, pause and ask campus staff for help. Access, opening hours, distances and step-free routes still need to be checked.</p><p>The Protection Services route must end at the public entrance or official sign. Never photograph security equipment, access controls or restricted areas. Don’t include recognisable faces without permission, student cards, personal information, screens with information or vehicle registrations.</p><a class="secondary-btn" href="#feedback">${icon('message')} Share prototype feedback</a></section></div>`;
}

function feedback() {
  main.innerHTML = `<div class="content-page">${backHome()}<div class="eyebrow">Built with students in mind</div><h1>Help shape the next step.</h1><p class="lead">What made sense? What could be clearer? Your feedback can improve this student prototype.</p><div class="demo-banner">${icon('info')}<p><strong>Feedback stays with you.</strong> This form prepares a text file for you to download and share yourself. It does not submit anything online. Please leave out names, student numbers and other personal information.</p></div><form id="feedback-form" class="panel feedback-form"><div class="form-field"><label for="feedback-destination">Which part did you try?</label><select id="feedback-destination" name="destination"><option value="Whole prototype">The whole prototype</option>${locations.destinations.map(d => `<option value="${e(d.name)}">${e(d.name)}</option>`).join('')}</select></div><fieldset><legend>How easy was it to follow?</legend><div class="rating-options">${['Easy','Mostly clear','Needs work'].map((label,i) => `<label><input type="radio" name="rating" value="${e(label)}" ${i===0?'required':''}> ${e(label)}</label>`).join('')}</div></fieldset><div class="form-field"><label for="feedback-comment">What should we improve?</label><textarea name="comment" id="feedback-comment" minlength="10" maxlength="1500" required placeholder="For example: I’d like a clearer sign at the turning point…" aria-describedby="comment-help"></textarea><small id="comment-help">10–1,500 characters. Describe the experience without including personal information.</small></div><button class="primary-btn" type="submit">${icon('download')} Download my feedback</button><div class="feedback-success" id="feedback-result" role="status" hidden></div></form></div>`;
}

function getContext(parts, params) {
  const destinationId = decodeURIComponent(parts[1] || '');
  const requestedStart = params.get('from') || startId;
  const destination = locations.destinations.find(d => d.id === destinationId);
  const start = locations.starts.find(s => s.id === requestedStart);
  const route = graph.routes.find(r => r.destinationId === destinationId);
  if (!destination || !start || !route) throw new Error('This destination or starting point is not available. Choose one from the home screen.');
  const path = findPath(graph,start.nodeId,route);
  if (!path) throw new Error('No route connects these locations yet. Try a different starting point.');
  startId = start.id;
  return { destination, start, route, path };
}

function currentScreen() {
  const [rawPath, rawParams] = location.hash.slice(1).split('?');
  return { parts: (rawPath || 'home').split('/'), params:new URLSearchParams(rawParams || '') };
}

function render(shouldFocus = true) {
  if (!locations || !graph) return;
  clearTimeout(imageTimer);
  const {parts, params} = currentScreen();
  const screen = parts[0];
  try {
    if (screen === 'home') home();
    else if (screen === 'help') help();
    else if (screen === 'feedback') feedback();
    else if (['route','navigate','arrived'].includes(screen)) {
      const context = getContext(parts,params);
      if (screen === 'route') routeSummary(context);
      else if (screen === 'arrived') arrival(context);
      else {
        const step = Number(params.get('step') || 1);
        if (!Number.isInteger(step) || step < 1 || step > context.path.length) throw new Error('This checkpoint is not available. Start the route again from the home screen.');
        navigate(context,step);
      }
    } else throw new Error('That page isn’t part of this prototype. Choose a destination to get started.');
    document.title = `${main.querySelector('h1')?.textContent || 'Home'} | APB First-Year Visual Navigator`;
  } catch (error) {
    main.innerHTML = `<div class="fatal-error">${icon('pin')}<h1>A small detour.</h1><p>${e(error.message)}</p><a class="primary-btn" href="#home">Back to destinations ${icon('arrow')}</a></div>`;
    document.title = 'Route unavailable | APB First-Year Visual Navigator';
  }
  document.querySelectorAll('[data-nav]').forEach(link => {
    if (link.dataset.nav === (['route','navigate','arrived'].includes(screen) ? 'home' : screen)) link.setAttribute('aria-current','page');
    else link.removeAttribute('aria-current');
  });
  if (shouldFocus) { main.focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
}

function moveStep(delta) {
  const {parts,params} = currentScreen();
  if (parts[0] !== 'navigate') return;
  try {
    const context = getContext(parts,params), step = Number(params.get('step') || 1);
    if (delta < 0 && step <= 1) return;
    location.hash = step + delta > context.path.length ? href('arrived',context.destination.id) : href('navigate',context.destination.id,step+delta);
  } catch { render(); }
}

main.addEventListener('input', event => {
  if (event.target.id === 'destination-search') { query = event.target.value; renderDestinations(); }
});
main.addEventListener('change', event => {
  if (event.target.id === 'start-location') {
    startId = event.target.value;
    const start = locations.starts.find(s => s.id === startId);
    document.querySelector('#origin-note').textContent = start.note;
    renderDestinations();
    announce(`Starting from ${start.name}. All current routes are unverified samples.`);
  }
});
main.addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'clear-search') { query=''; document.querySelector('#destination-search').value=''; renderDestinations(); document.querySelector('#destination-search').focus(); }
  if (action === 'previous') moveStep(-1);
  if (action === 'next') moveStep(1);
  if (action === 'retry-data') { main.innerHTML='<div class="initial-loading" role="status"><span class="spinner"></span> Loading route information…</div>'; boot(); }
  if (action === 'retry-image') render();
});
main.addEventListener('submit', event => {
  if (event.target.id !== 'feedback-form') return;
  event.preventDefault();
  const data = new FormData(event.target);
  const content = `APB First-Year Visual Navigator — prototype feedback\n\nArea: ${data.get('destination')}\nEase of use: ${data.get('rating')}\n\nFeedback:\n${data.get('comment').trim()}\n\nGenerated locally. This form did not send feedback online.\n`;
  const url = URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));
  const download = document.createElement('a'); download.href=url; download.download='apb-prototype-feedback.txt'; document.body.append(download); download.click(); download.remove();
  setTimeout(() => URL.revokeObjectURL(url),1000);
  const result = main.querySelector('#feedback-result'); result.hidden=false; result.textContent='Your feedback file is ready to download. Your browser may ask where to save it. Share the saved file with the project creator when you’re ready; nothing was submitted online.';
});
window.addEventListener('hashchange',() => render());
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.repeat || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) || event.target.isContentEditable) return;
  const {parts,params} = currentScreen();
  if (parts[0] !== 'navigate') return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); moveStep(event.key === 'ArrowRight' ? 1 : -1); }
  if (event.key === 'Escape') { event.preventDefault(); location.hash=href('route',parts[1]); announce('Navigation exited. Route summary shown.'); }
});
boot();
