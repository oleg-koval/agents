import { readFile, readdir } from 'node:fs/promises';

const roles = (await readdir(new URL('../roles/', import.meta.url))).filter((name) => name.endsWith('.md'));
const docs = (await readdir(new URL('../docs/', import.meta.url))).filter((name) => name.endsWith('.md'));
const pipelines = ['delivery', 'charter', 'review', 'release'];
const files = [
  'README.md',
  'AGENTS.md',
  ...docs.map((name) => `docs/${name}`),
  ...roles.map((name) => `roles/${name}`),
  ...pipelines.map((name) => `pipelines/${name}.md`),
];

const contents = await Promise.all(files.map(async (path) => [path, await readFile(new URL(`../${path}`, import.meta.url), 'utf8')]));
const failures = contents.flatMap(([path, body]) => [
  ...(body.trim() ? [] : [`${path}: empty`]),
  ...(path.startsWith('roles/') && !body.startsWith(`# ${path.slice(6, -3)}`) ? [`${path}: wrong heading`] : []),
  ...(body.match(/\b(?:sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16})\b/g) ?? []).map(() => `${path}: credential-shaped string`),
  ...(body.match(/\/Users\/|\/home\/|\.internal\b/g) ?? []).map(() => `${path}: private path or endpoint`),
]);
// Generation also validates that every local role/pipeline reference resolves.
const { generate } = await import('./codex-agents.mjs');
const agents = await generate();
for (const [path, body] of agents) {
  if (!body.includes('developer_instructions = ') || /\bmodel\s*=/.test(body)) failures.push(`${path}: invalid native fields`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`validated ${files.length} public documents`);
}
