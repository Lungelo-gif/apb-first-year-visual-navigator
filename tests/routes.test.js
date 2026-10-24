import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { validateData, findPath, searchDestinations, escapeHTML } from '../js/core.js';

const locations = JSON.parse(await readFile(new URL('../data/locations.json', import.meta.url)));
const graph = JSON.parse(await readFile(new URL('../data/routes.json', import.meta.url)));

test('published sample data validates and has exactly the four agreed destinations', () => {
  assert.equal(validateData(locations,graph),true);
  assert.deepEqual(locations.destinations.map(d => d.id).sort(), ['classroom','computer-lab','library','security']);
  assert.ok(graph.routes.every(r => r.isSample && r.verifiedAt === null));
});

for (const start of locations.starts) for (const route of graph.routes) {
  test(`${start.id} → ${route.destinationId}: connected, finite path with correct endpoint`, () => {
    const path = findPath(graph,start.nodeId,route);
    assert.equal(path[0],start.nodeId);
    assert.equal(path.at(-1),route.arrivalNodeId);
    assert.equal(new Set(path).size,path.length);
    path.slice(1).forEach((id,i) => assert.ok(graph.nodes[path[i]].next.includes(id)));
    assert.ok(path.every(id => route.allowedNodeIds.includes(id)));
  });
}

test('shared checkpoints are reused across all four paths', () => {
  const paths = graph.routes.map(r => findPath(graph,'shared-start',r));
  assert.ok(paths.every(path => path.slice(0,3).join(',') === 'shared-start,shared-walkway,shared-junction'));
});
test('every image exists, has alternative text, and is labelled as a placeholder', async () => {
  for (const node of Object.values(graph.nodes)) {
    const file = await stat(new URL(`../${node.image.src}`,import.meta.url));
    assert.ok(file.size > 0 && file.size < 50000);
    assert.ok(node.image.alt.length > 20);
    assert.equal(node.image.isPlaceholder,true);
  }
});
test('unknown and disconnected nodes do not produce an invented path', () => {
  assert.equal(findPath(graph,'missing',graph.routes[0]),null);
  const broken = structuredClone(graph); broken.nodes['shared-start'].next=[];
  assert.equal(findPath(broken,'shared-start',broken.routes[0]),null);
});
test('cycles are handled without getting stuck', () => {
  const cyclic = structuredClone(graph); cyclic.nodes['shared-junction'].next.unshift('shared-start');
  assert.equal(findPath(cyclic,'shared-start',cyclic.routes[0]).at(-1),'library-arrival');
});
test('search handles aliases, case, whitespace, multiword queries and no results', () => {
  assert.equal(searchDestinations(locations.destinations,' SECURITY ')[0].id,'security');
  assert.equal(searchDestinations(locations.destinations,'computer lab')[0].id,'computer-lab');
  assert.equal(searchDestinations(locations.destinations,'  ').length,4);
  assert.equal(searchDestinations(locations.destinations,'unknown place').length,0);
});
test('invalid data gives an actionable error instead of silently breaking routes', () => {
  const broken = structuredClone(graph); broken.nodes['shared-start'].next=['unknown'];
  assert.throws(() => validateData(locations,broken),/unknown connected node/);
});
test('unsafe external and traversal image paths are rejected', () => {
  for (const src of ['https://example.com/track.jpg','assets/images/../secret.jpg']) {
    const broken = structuredClone(graph); broken.nodes['shared-start'].image.src=src;
    assert.throws(() => validateData(locations,broken),/unsafe image path/);
  }
});
test('text interpolation escapes HTML', () => {
  assert.equal(escapeHTML('<img src="x">&'), '&lt;img src=&quot;x&quot;&gt;&amp;');
});
test('Protection Services endpoint is public-facing and terminal', () => {
  const route=graph.routes.find(r => r.destinationId==='security');
  assert.deepEqual(graph.nodes[route.arrivalNodeId].next,[]);
  assert.match(graph.nodes[route.arrivalNodeId].instruction,/public entrance or official sign/);
});
