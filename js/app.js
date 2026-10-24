import { validateData, validateMap, findPath, searchDestinations, escapeHTML as e } from './core.js?v=0.3.0';
import { mapMarkup } from './map-view.js?v=0.3.0';

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
  map:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5ZM9 3v16M15 5v16"/>',
  forward:'<path d="m5 12 7-6 7 6M5 20l7-6 7 6"/>',
  reverse:'<path d="m5 4 7 6 7-6M5 12l7 6 7-6"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.pin}</svg>`;
const main = document.querySelector('main');
const release = '0.3.0';
const announcer = document.querySelector('#announcer');
let locations, graph, layout, startId = 'sample-entrance', query = '', mapZoom = 1, mapPanX = 0, mapPanY = 0, mapDrag, imageTimer, loadController, dockObserver;
const announce = message => { announcer.textContent = message; };
const href = (screen, destination, step) => `#${screen}/${encodeURIComponent(destination)}?from=${encodeURIComponent(startId)}${step !== undefined ? `&step=${step}` : ''}`;
const banner = () => `<div class="demo-banner">${icon('info')}<p><strong>Demo routes · not verified for walking.</strong> Checkpoint illustrations and directions are samples. Confirm the real APB route before using it on campus.</p></div>`;
const backHome = () => `<a class="breadcrumb" href="#home">${icon('back')} Back to destinations</a>`;
const referenceMedia = (photo, classes = '', priority = false) => `<div class="reference-media ${classes}"><img src="${e(photo.src)}" alt="${e(photo.alt)}" width="${e(photo.width || 1400)}" height="${e(photo.height || 800)}" loading="${priority ? 'eager' : 'lazy'}" decoding="async" data-reference-image><span class="reference-fallback" hidden>${icon('image')}<span>Image unavailable · sample route still available</span></span><span class="art-label">${e(photo.label || (photo.isPlaceholder ? 'Illustrative placeholder' : 'Reference image · location unverified'))}</span></div>`;

document.querySelectorAll('[data-icon]').forEach(el => { el.innerHTML = icon(el.dataset.icon); });
// Keep the skip link within the current page; the hash is reserved for app routes.
document.querySelector('.skip-link').addEventListener('click', event => {
  event.preventDefault();
  main.focus({ preventScroll: true });
  main.scrollIntoView({ block: 'start', behavior: 'instant' });
});

async function boot() {
  loadController?.abort();
  const controller = new AbortController(); loadController = controller;
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const fetchJSON = async path => {
      const response = await fetch(`${path}?v=${release}`, {signal:controller.signal, cache:'no-cache'});
      if (!response.ok) throw new Error(`Could not load ${path} (${response.status}).`);
      return response.json();
    };
    [locations, graph, layout] = await Promise.all([fetchJSON('data/locations.json'), fetchJSON('data/routes.json'), fetchJSON('data/map.json')]);
    validateData(locations, graph);
    validateMap(layout, graph);
    startId = locations.starts[0].id;
    render(false);
  } catch (error) {
    main.innerHTML = `<div class="fatal-error">${icon('compass')}<h1>Let’s get you back on track.</h1><p>We couldn’t load the route information. Check your connection, then try again. If you opened a downloaded file, run the local web server described in the README.</p><button class="primary-btn" data-action="retry-data">Try loading again</button><details><summary>Technical detail</summary><p>${e(error.name === 'AbortError' ? 'Loading took too long. Please retry.' : error.message)}</p></details></div>`;
    announce('Route information could not be loaded. A retry button is available.');
  } finally { clearTimeout(timeout); }
}

function mapCanvas(context) {
  const options = { startId, destinationId:context?.destination.id, path:context?.path || [] };
  return `<div class="map-canvas"><div class="map-viewport" id="map-viewport" style="transform:translate(${mapPanX}px,${mapPanY}px) scale(${mapZoom})">${mapMarkup(layout,locations,graph,options)}</div></div><div class="map-layout-notice">${icon('info')}<span>${e(layout.notice)}</span></div><div class="map-tools" aria-label="Sample map zoom"><button data-action="zoom-in" aria-label="Zoom in on sample map">+</button><button data-action="zoom-out" aria-label="Zoom out on sample map">−</button><button data-action="zoom-reset" aria-label="Reset sample map zoom">${icon('compass')}</button></div><div class="map-key"><span class="key-dot"></span> ${context ? 'Sample route' : 'Tap a destination pin'} <span>· No live GPS</span></div>`;
}

function home() {
  const start = locations.starts.find(s => s.id === startId);
  main.innerHTML = `<section class="map-experience" aria-label="Choose a destination on the sample map">${mapCanvas()}<div class="map-planner">
    <header class="planner-header"><div class="planner-kicker">APB VISUAL NAVIGATOR</div><h1>Where to?</h1><p>Choose a place. Then follow the photo arrows.</p></header>
    <div class="origin-field"><div class="origin-symbol">${icon('pin')}</div><div><label for="start-location">Starting from</label><select id="start-location" aria-describedby="origin-note">${locations.starts.map(s => `<option value="${e(s.id)}" ${s.id === startId ? 'selected' : ''}>${e(s.name)}</option>`).join('')}</select></div></div><p class="origin-note" id="origin-note">${e(start.note)}</p>
    <div class="search-field">${icon('search')}<label class="sr-only" for="destination-search">Search destinations</label><input id="destination-search" type="search" placeholder="Search library, security, a classroom…" value="${e(query)}" autocomplete="off" maxlength="100"><button class="clear-search" aria-label="Clear destination search" data-action="clear-search" ${query ? '' : 'hidden'}>×</button></div>
    <div class="planner-list-heading"><h2>Destinations</h2><span>4 sample routes</span></div><div class="map-destination-list" id="destination-results"></div><p class="sr-only" id="search-status" role="status" aria-live="polite" aria-atomic="true"></p>
    <p class="planner-note">Reference photos · locations unverified. The map is an illustrative layout.</p><details class="campus-photo-details"><summary>View campus reference photo</summary>${referenceMedia(locations.campusImage,'map-campus-reference')}</details>
  </div></section>`;
  renderDestinations();
}

function renderDestinations() {
  const results = searchDestinations(locations.destinations, query);
  document.querySelector('#destination-results').innerHTML = results.length ? results.map(d => `<a class="map-result" href="${href('route',d.id)}"><img src="${e(d.image.src)}" alt="${e(d.image.alt)}" width="60" height="60" loading="lazy"><span class="map-result-copy"><strong>${e(d.name)}</strong><span>Sample route${['computer-lab','classroom'].includes(d.id) ? ' · Room TBC' : ' · Unverified'}</span></span><span class="map-result-arrow">${icon('arrow')}</span></a>`).join('') : `<div class="no-results"><strong>No destinations found for “${e(query)}”.</strong><br>Try library, security, computer lab or classroom.<button class="text-btn" data-action="clear-search">Clear search</button></div>`;
  document.querySelector('#search-status').textContent = `${results.length} destination${results.length === 1 ? '' : 's'} found.`;
  document.querySelector('.clear-search').hidden = !query;
  const visible = new Set(results.map(d => d.id));
  main.querySelectorAll('.map-destination-pin').forEach(pin => pin.toggleAttribute('hidden', !visible.has(pin.dataset.destination)));
}

function routeSummary(context) {
  const { destination:d, route, path, start } = context;
  main.innerHTML = `<section class="map-experience route-map" aria-label="Sample route overview">${mapCanvas(context)}<div class="map-planner route-planner">
    <a class="planner-back" href="#home">${icon('back')} Back to destinations</a><div class="route-place-header">${referenceMedia(d.image,'route-place-photo')}<div><span class="planner-kicker">YOUR DESTINATION</span><h1>${e(d.name)}</h1></div></div><p class="reference-caption">${e(d.image.label)}</p>
    <div class="route-start"><span class="origin-symbol">${icon('pin')}</span><div><span class="field-label">Starting from</span><strong>${e(start.name)}</strong></div></div>
    <p class="route-description">${e(route.summary)}</p><div class="route-facts"><div><strong>${path.length} stops</strong><span>Photo checkpoints</span></div><div><strong>Your pace</strong><span>Manual arrows</span></div><div><strong>Demo</strong><span>Unverified route</span></div></div>
    <a class="primary-btn full-width" href="${href('navigate',d.id,1)}">${icon('eye')} Start photo walk ${icon('arrow')}</a><p class="map-route-warning">${icon('info')} Sample layout and directions. Use this to try the interface, not for walking on campus.</p>
    <details class="route-checkpoints"><summary>See the ${path.length} checkpoints</summary><ol class="route-outline">${path.map(id => `<li>${e(graph.nodes[id].title)}<small>${e(graph.nodes[id].instruction)}</small></li>`).join('')}</ol></details><p class="route-access-note">${e(d.accessibility)} Distance and walking time are not verified.</p>
  </div></section>`;
}

function navigate(context, step) {
  const { destination:d, path } = context;
  const node = graph.nodes[path[step-1]], last = step === path.length;
  main.innerHTML = `<section class="immersive-viewer" aria-label="Still-photo navigation demo">
    <div class="checkpoint-photo immersive-photo" aria-busy="true"><div class="image-loading" role="status"><span class="spinner"></span> Loading checkpoint image…</div><img class="is-loading" id="checkpoint-image" alt="${e(node.image.alt)}" width="1400" height="800" decoding="async"></div>
    <header class="viewer-heading"><a class="viewer-exit" href="${href('route',d.id)}" aria-label="Exit navigation">${icon('back')}<span>Route map</span></a><div class="viewer-destination"><h1>${e(d.name)}</h1><span class="step-count" id="step-label">Step ${step} of ${path.length}</span></div></header>
    <div class="viewer-demo-label">STILL-PHOTO DEMO · ${context.route.isSample ? 'UNVERIFIED SAMPLE ROUTE' : 'VISUAL CHECKPOINTS'}</div>
    <div class="viewer-mini-map" aria-hidden="true">${mapMarkup(layout,locations,graph,{startId,destinationId:d.id,path,activeNodeId:path[step-1],interactive:false})}<span>Sample route · sequence position</span></div>
    <div class="ground-arrows" aria-label="Move through checkpoint photographs"><button class="walk-arrow" data-action="previous" aria-label="Move back to previous checkpoint" ${step === 1 ? 'disabled' : ''}>${icon('reverse')}<span>Back</span></button><button class="walk-arrow" data-action="next" aria-label="${last ? 'Finish sample route' : 'Move forward to next checkpoint'}">${icon(last ? 'check' : 'forward')}<span>${last ? 'Finish' : 'Forward'}</span></button></div>
    <div class="viewer-dock"><div class="viewer-dock-heading"><span class="planner-kicker">${context.route.isSample ? 'SAMPLE DIRECTION' : 'NEXT DIRECTION'}</span><span class="viewer-checkpoint-title">${e(node.title)}</span></div><h2 id="checkpoint-instruction">${e(node.instruction)}</h2><div class="landmark">${icon('eye')}<span>${e(node.landmark)}</span></div><div class="viewer-progress"><progress max="${path.length}" value="${step}" aria-labelledby="step-label"></progress><span>${node.image.isPlaceholder ? 'Illustrative checkpoint · not an APB photo' : 'Compare the checkpoint with your surroundings'}</span></div><div class="checkpoint-controls"><button class="secondary-btn" data-action="previous" ${step === 1 ? 'disabled' : ''}>${icon('back')} Previous</button><button class="primary-btn" data-action="next">${last ? 'Finish demo route' : 'Next checkpoint'} ${icon(last ? 'check' : 'arrow')}</button></div></div>
  </section>`;
  const viewer = main.querySelector('.immersive-viewer');
  const dock = main.querySelector('.viewer-dock');
  const positionArrows = () => viewer.style.setProperty('--dock-height', `${dock.getBoundingClientRect().height}px`);
  positionArrows();
  if (typeof ResizeObserver === 'function') { dockObserver = new ResizeObserver(positionArrows); dockObserver.observe(dock); }
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
  main.innerHTML = `${backHome()}${banner()}<section class="arrival"><div class="arrival-check">${icon('check')}</div><div class="eyebrow">Sample route complete</div><h1>You’ve reached the final checkpoint.</h1><p class="destination-name">${e(d.name)}</p>${referenceMedia(d.image, 'arrival-image')}<p class="info-text">Nice work exploring the demo. This confirms the end of the sample sequence, not your physical location.</p><div class="panel arrival-info"><span class="field-label">Your destination</span><h2>${e(d.name)}</h2><p>${e(d.info)}</p><div class="access-note"><strong>Arrival point:</strong> ${e(d.endpoint)}<br><strong>Accessibility:</strong> ${e(d.accessibility)}</div></div><div class="arrival-actions"><a class="primary-btn" href="#home">Choose another destination ${icon('arrow')}</a><a class="secondary-btn" href="#feedback">${icon('message')} Share feedback</a><a class="text-btn" href="${href('navigate',d.id,context.path.length)}">${icon('back')} Back to last checkpoint</a></div></section>`;
}

function help() {
  main.innerHTML = `<div class="content-page">${backHome()}<div class="eyebrow">A little help along the way</div><h1>Your campus companion,<br>explained.</h1><p class="lead">APB First-Year Visual Navigator combines destination search, written instructions and visual checkpoints in a simple student experiment.</p><section class="panel content-section"><h2>About this prototype</h2><p><strong>Student proof of concept — not an official University of Johannesburg service.</strong></p><p>This project grew from a student idea connected to an FYO Marshal application. It demonstrates a first-year navigation experience that complements UJ’s existing Wayfinder application and separate virtual campus tours.</p><p>The campus, library, Protection Services sign and lecture-room photos are user-supplied reference images. Their APB locations are unverified. The computer lab image and every walking checkpoint remain illustrative placeholders. Every route, both starting points, and the selected lab and classroom are unverified. Do not use the demo directions for walking on campus.</p></section><section class="panel content-section"><h2>How to try it</h2><ol><li>Choose a sample starting point, then tap a destination pin on the map or choose it from the list.</li><li>Review the sample route on the map and select “Start photo walk”.</li><li>Use the large Forward and Back arrows on the photograph, or the Previous and Next buttons. Read the short direction at each checkpoint.</li><li>Finish the sample route, then choose another destination or share feedback.</li></ol><p>You can use a keyboard: <kbd>Tab</kbd> moves between controls, <kbd>Enter</kbd> activates links and buttons, arrow keys change checkpoints, and <kbd>Esc</kbd> exits navigation.</p></section><section class="panel content-section"><h2>Photos, not 360° views</h2><p>The planned real version uses wide checkpoint photographs taken with an iPhone 13 Pro Max. You move through a sequence with the on-screen arrows. The interface demonstrates a map-to-photo-walk experience for a future authorised 360° campus tour. The current viewer uses still images; it cannot look around a panorama. The map is a schematic sample, not an APB survey, and there is no live GPS. A 360° camera would provide the real panoramas for the next phase.</p></section><section class="panel content-section"><h2>Privacy and data</h2><p>No account, database, analytics, payments or location permission is used. Your choices stay in this browser tab and its URL. The static hosting provider handles normal web requests. Feedback is downloaded to your device; the app sends no feedback online.</p><p>Only the current checkpoint image loads during navigation. Destination reference photos load when their cards or summary are viewed, using compressed local files. The building-only campus crop excludes people and entrance controls; the Protection Services reference shows the public sign only. The app needs a connection to load its files and does not promise offline access.</p></section><section class="panel content-section"><h2>If something doesn’t look right</h2><p>A missing image leaves the written direction available and offers a retry. If a future photo does not match your surroundings, pause and ask campus staff for help. Access, opening hours, distances and step-free routes still need to be checked.</p><p>The Protection Services route must end at the public entrance or official sign. Never photograph security equipment, access controls or restricted areas. Don’t include recognisable faces without permission, student cards, personal information, screens with information or vehicle registrations.</p><a class="secondary-btn" href="#feedback">${icon('message')} Share prototype feedback</a></section></div>`;
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
  dockObserver?.disconnect();
  mapDrag = null;
  const {parts, params} = currentScreen();
  const screen = parts[0];
  document.body.dataset.screen = screen;
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
    document.body.dataset.screen = 'error';
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

// Pan the illustrative layout without requesting GPS or map tiles.
main.addEventListener('pointerdown', event => {
  const canvas = event.target.closest('.map-canvas');
  if (!canvas || event.button !== 0 || event.target.closest('a,button')) return;
  mapDrag = { id:event.pointerId, x:event.clientX, y:event.clientY, panX:mapPanX, panY:mapPanY, canvas };
  canvas.setPointerCapture(event.pointerId);
  canvas.classList.add('is-dragging');
});
main.addEventListener('pointermove', event => {
  if (!mapDrag || event.pointerId !== mapDrag.id) return;
  const limitX = mapDrag.canvas.clientWidth * .7, limitY = mapDrag.canvas.clientHeight * .7;
  mapPanX = Math.max(-limitX, Math.min(limitX, mapDrag.panX + event.clientX - mapDrag.x));
  mapPanY = Math.max(-limitY, Math.min(limitY, mapDrag.panY + event.clientY - mapDrag.y));
  const viewport = main.querySelector('#map-viewport');
  if (viewport) viewport.style.transform = `translate(${mapPanX}px,${mapPanY}px) scale(${mapZoom})`;
});
const stopMapDrag = () => {
  if (mapDrag) mapDrag.canvas.classList.remove('is-dragging');
  mapDrag = null;
};
main.addEventListener('pointerup', stopMapDrag);
main.addEventListener('pointercancel', stopMapDrag);

main.addEventListener('input', event => {
  if (event.target.id === 'destination-search') { query = event.target.value; renderDestinations(); }
});
main.addEventListener('error', event => {
  if (!event.target.matches?.('[data-reference-image]')) return;
  event.target.hidden = true;
  const fallback = event.target.parentElement.querySelector('.reference-fallback');
  if (fallback) fallback.hidden = false;
}, true);
main.addEventListener('change', event => {
  if (event.target.id === 'start-location') {
    startId = event.target.value;
    const start = locations.starts.find(s => s.id === startId);
    document.querySelector('#origin-note').textContent = start.note;
    document.querySelector('#map-viewport').innerHTML = mapMarkup(layout,locations,graph,{startId});
    renderDestinations();
    announce(`Starting from ${start.name}. All current routes are unverified samples.`);
  }
});
main.addEventListener('click', event => {
  const action = event.target.closest('[data-action]')?.dataset.action;
  if (!action) return;
  if (action === 'clear-search') { query=''; document.querySelector('#destination-search').value=''; renderDestinations(); document.querySelector('#destination-search').focus(); }
  if (action.startsWith('zoom-')) {
    mapZoom = action === 'zoom-reset' ? 1 : Math.max(.8, Math.min(1.8, mapZoom + (action === 'zoom-in' ? .2 : -.2)));
    const viewport = main.querySelector('#map-viewport');
    if (action === 'zoom-reset') { mapPanX = 0; mapPanY = 0; }
    if (viewport) viewport.style.transform = `translate(${mapPanX}px,${mapPanY}px) scale(${mapZoom})`;
    announce(`Sample map zoom ${Math.round(mapZoom*100)} percent.`);
  }
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
  if (['ArrowRight','ArrowLeft','ArrowUp','ArrowDown'].includes(event.key)) { event.preventDefault(); moveStep(['ArrowRight','ArrowUp'].includes(event.key) ? 1 : -1); }
  if (event.key === 'Escape') { event.preventDefault(); location.hash=href('route',parts[1]); announce('Navigation exited. Route summary shown.'); }
});
boot();
