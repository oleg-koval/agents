import { readFile } from 'node:fs/promises';

const roles = ['team', 'product', 'architect', 'engineer', 'qa', 'security', 'growth'];
const pipelines = ['delivery', 'charter', 'review', 'release'];
const files = [
  'README.md',
  'AGENTS.md',
  ...roles.map((name) => `roles/olko-${name}.md`),
  ...pipelines.map((name) => `pipelines/${name}.md`),
];

const contents = await Promise.all(files.map(async (path) => [path, await readFile(new URL(`../${path}`, import.meta.url), 'utf8')]));
const failures = contents.flatMap(([path, body]) => [
  ...(body.trim() ? [] : [`${path}: empty`]),
  ...(path.startsWith('roles/') && !body.startsWith(`# ${path.slice(6, -3)}`) ? [`${path}: wrong heading`] : []),
  ...(body.match(/\b(?:sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[A-Z0-9]{16})\b/g) ?? []).map(() => `${path}: credential-shaped string`),
  ...(body.match(/\/Users\/|\/home\/|\.internal\b/g) ?? []).map(() => `${path}: private path or endpoint`),
]);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`validated ${files.length} public documents`);
}
