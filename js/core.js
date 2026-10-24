// Pure data and routing functions: no interface, network, or browser dependencies.
export function validateData(locations, graph) {
  const fail = message => { throw new Error(`Route data: ${message}`); };
  if (locations.schemaVersion !== 1 || graph.schemaVersion !== 1) fail('unsupported schema version.');
  if (!Array.isArray(locations.starts) || !locations.starts.length || !Array.isArray(locations.destinations) || !locations.destinations.length) fail('locations are missing.');
  if (!graph.nodes || !Array.isArray(graph.routes)) fail('nodes or routes are missing.');
  const validateImage = (image, label) => {
    if (!image?.src || !image.alt || typeof image.isPlaceholder !== 'boolean') fail(`incomplete image at ${label}.`);
    if (!/^assets\/images\/[a-zA-Z0-9_./-]+\.(svg|jpg|jpeg|webp|png)$/.test(image.src) || image.src.includes('..')) fail(`unsafe image path at ${label}.`);
  };
  if (locations.campusImage) validateImage(locations.campusImage, 'campus reference');
  const unique = (items, label) => { if (new Set(items.map(x => x.id)).size !== items.length) fail(`duplicate ${label} IDs.`); };
  unique(locations.starts, 'start'); unique(locations.destinations, 'destination'); unique(graph.routes, 'route');
  for (const location of [...locations.starts, ...locations.destinations]) {
    if (!location.id || !location.name) fail('a location has no ID or name.');
    if (location.image) validateImage(location.image, location.id);
  }
  for (const start of locations.starts) if (!graph.nodes[start.nodeId]) fail(`unknown start node ${start.nodeId}.`);
  for (const [id, node] of Object.entries(graph.nodes)) {
    if (!node.title || !node.instruction || !node.landmark || !node.image?.src || !node.image?.alt || typeof node.image.isPlaceholder !== 'boolean' || !Array.isArray(node.next)) fail(`incomplete checkpoint ${id}.`);
    if (!/^assets\/images\/[a-zA-Z0-9_./-]+\.(svg|jpg|jpeg|webp|png)$/.test(node.image.src) || node.image.src.includes('..')) fail(`unsafe image path at ${id}.`);
    for (const next of node.next) if (!graph.nodes[next]) fail(`unknown connected node ${next}.`);
  }
  for (const destination of locations.destinations) {
    const route = graph.routes.find(r => r.destinationId === destination.id);
    if (!route) fail(`no route for ${destination.id}.`);
    if (!graph.nodes[route.arrivalNodeId] || !route.allowedNodeIds?.includes(route.arrivalNodeId)) fail(`invalid arrival for ${destination.id}.`);
    for (const id of route.allowedNodeIds) if (!graph.nodes[id]) fail(`unknown allowed node ${id}.`);
    if (typeof route.isSample !== 'boolean') fail(`missing sample status for ${destination.id}.`);
    for (const start of locations.starts) if (!findPath(graph, start.nodeId, route)) fail(`no path from ${start.id} to ${destination.id}.`);
  }
  return true;
}

export function findPath(graph, startNodeId, route) {
  const allowed = new Set(route.allowedNodeIds);
  if (!allowed.has(startNodeId)) return null;
  const queue = [[startNodeId]], visited = new Set([startNodeId]);
  while (queue.length) {
    const path = queue.shift(), id = path.at(-1);
    if (id === route.arrivalNodeId) return path;
    for (const next of graph.nodes[id]?.next ?? []) {
      if (allowed.has(next) && !visited.has(next)) { visited.add(next); queue.push([...path, next]); }
    }
  }
  return null;
}

export function searchDestinations(destinations, query) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return destinations.filter(d => words.every(w => `${d.name} ${d.category} ${(d.keywords ?? []).join(' ')}`.toLocaleLowerCase().includes(w)));
}

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
}
