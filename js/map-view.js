import { escapeHTML as e } from './core.js?v=0.4.1';

// Keep the supplied reference intact. Never align invented demo nodes to real buildings.
export function referenceMapMarkup(image) {
  return `<div class="campus-map-reference"><div class="map-reference-loading" role="status"><span class="spinner"></span> Loading campus map…</div><img class="is-loading" data-map-image src="${e(image.src)}" alt="${e(image.alt)}" width="${e(image.width)}" height="${e(image.height)}" decoding="async" draggable="false"><div class="map-reference-error" role="status" hidden><strong>Campus map unavailable</strong><p>You can still choose a destination and try its sample photo walk.</p><button class="secondary-btn" data-action="retry-map">Try map again</button></div></div>`;
}

// Relative drawing positions only. This SVG is not a geographic map or an APB survey.
export function mapMarkup(layout, locations, graph, options = {}) {
  const { startId, destinationId, path = [], activeNodeId, interactive = true } = options;
  const line = ids => ids.map(id => `${layout.nodes[id].x},${layout.nodes[id].y}`).join(' ');
  const connections = Object.entries(graph.nodes).flatMap(([id, node]) => node.next.map(next => [id, next]));
  const start = locations.starts.find(s => s.id === startId) || locations.starts[0];
  const startPoint = layout.nodes[start.nodeId];
  const active = activeNodeId ? layout.nodes[activeNodeId] : null;
  const pins = locations.destinations.map((d, index) => {
    const route = graph.routes.find(r => r.destinationId === d.id);
    const p = layout.nodes[route.arrivalNodeId];
    const selected = d.id === destinationId;
    const labels = layout.labels[d.id] || [d.name];
    const pin = `<g transform="translate(${p.x} ${p.y})"><path class="pin-shape ${selected ? 'is-selected' : ''}" d="M0 0C-7-9-23-22-23-37a23 23 0 1 1 46 0C23-22 7-9 0 0Z"/><text class="pin-number ${selected ? 'is-selected' : ''}" x="0" y="-29" text-anchor="middle">${index+1}</text>${interactive ? `<text class="map-destination-name" x="0" y="37" text-anchor="middle">${labels.map((label,i) => `<tspan x="0" dy="${i ? 34 : 0}">${e(label)}</tspan>`).join('')}</text>` : ''}</g>`;
    return interactive ? `<a class="map-destination-pin" data-destination="${e(d.id)}" href="#route/${e(d.id)}?from=${encodeURIComponent(start.id)}" aria-label="${e(d.name)} on sample map" tabindex="0">${pin}</a>` : pin;
  }).join('');
  return `<svg class="campus-map-svg" viewBox="0 0 ${layout.width} ${layout.height}" xmlns="http://www.w3.org/2000/svg" role="${interactive ? 'group' : 'img'}" aria-label="Illustrative sample campus layout. Positions are not verified APB locations.">
    <rect class="map-ground" width="1000" height="700"/>
    <path class="map-lawn" d="M40 60h245v85H40ZM455 75h105v245H455ZM65 445h170v95H65ZM820 460h120v170H820ZM470 590h140v75H470Z"/>
    <path class="map-street" d="M20 650H970M35 80V650M955 90V650"/>
    ${connections.map(ids => `<polyline class="map-walkway-border" points="${line(ids)}"/>`).join('')}
    ${connections.map(ids => `<polyline class="map-walkway" points="${line(ids)}"/>`).join('')}
    ${layout.buildings.map(b => `<g><rect class="map-building-shadow" x="${b.x+6}" y="${b.y+7}" width="${b.width}" height="${b.height}" rx="8"/><rect class="map-building" x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" rx="8"/><path class="map-building-line" d="M${b.x+15} ${b.y+15}H${b.x+b.width-15}"/></g>`).join('')}
    ${[ [100,130],[250,150],[460,340],[590,330],[900,120],[920,390],[260,505],[820,615],[410,625] ].map(([x,y]) => `<g><circle class="map-tree-shadow" cx="${x+3}" cy="${y+4}" r="16"/><circle class="map-tree" cx="${x}" cy="${y}" r="16"/></g>`).join('')}
    ${path.length ? `<polyline class="map-route-shadow" points="${line(path)}"/><polyline class="map-route" points="${line(path)}"/>` : ''}
    <g class="map-origin-marker" transform="translate(${startPoint.x} ${startPoint.y})"><circle class="map-origin-halo" r="25"/><circle class="map-origin-dot" r="12"/>${interactive ? `<text x="0" y="48" text-anchor="middle">Selected start</text>` : ''}</g>
    ${pins}
    ${active ? `<circle class="map-current-step" cx="${active.x}" cy="${active.y}" r="17"/>` : ''}
  </svg>`;
}
