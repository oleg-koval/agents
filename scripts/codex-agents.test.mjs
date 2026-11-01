import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, readdir, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { generate, install, root } from './codex-agents.mjs';

async function fixture(t) {
  const path = await mkdtemp(join(await realpath(tmpdir()), 'agents-test-'));
  t.after(() => rm(path, { recursive: true, force: true }));
  return path;
}

test('generated TOML parses and bundles all referenced documents without checkout paths', async () => {
  const files = await generate();
  assert.equal(files.size, (await readdir(join(root, 'roles'))).filter((n) => n.endsWith('.md')).length);
  for (const [name, content] of files) {
    const parsed = JSON.parse(execFileSync('python3', ['-c', 'import sys,tomllib,json; print(json.dumps(tomllib.loads(sys.stdin.read())))'], { input: content, encoding: 'utf8' }));
    assert.equal(parsed.name + '.toml', name);
    assert.ok(parsed.description.length > 10);
    assert.match(parsed.developer_instructions, /Target-specific instructions take precedence/);
    assert.equal(parsed.model, undefined);
    assert.doesNotMatch(parsed.developer_instructions, /\]\((?:\.\.\/|roles\/|pipelines\/|olko-)/);
    for (const [, target] of parsed.developer_instructions.matchAll(/\]\(#([^)]*)\)/g)) {
      assert.ok(parsed.developer_instructions.includes(`id="${target}"`), target);
    }
  }
});

test('dry-run is read-only; install is idempotent and preserves unrelated files', async (t) => {
  const base = await fixture(t);
  const destination = join(base, 'agents');
  assert.ok((await install(destination, { dryRun: true })).every((s) => s.startsWith('dry-run create')));
  assert.deepEqual(await readdir(base), []);
  await install(destination);
  await writeFile(join(destination, 'custom.toml'), 'private custom content');
  assert.ok((await install(destination)).every((s) => s.startsWith('unchanged')));
  assert.equal(await readFile(join(destination, 'custom.toml'), 'utf8'), 'private custom content');
});

test('modified and foreign files conflict before any writes', async (t) => {
  const destination = await fixture(t);
  const conflict = join(destination, 'olko-team.toml');
  await writeFile(conflict, 'name = "mine"\n');
  await assert.rejects(install(destination), /Conflict/);
  assert.deepEqual(await readdir(destination), ['olko-team.toml']);
  await rm(conflict);
  await install(destination);
  const content = await readFile(conflict, 'utf8');
  await writeFile(conflict, content + '# local edit\n');
  await assert.rejects(install(destination, { dryRun: true }), /Conflict/);
  assert.equal(await readFile(conflict, 'utf8'), content + '# local edit\n');
});

test('managed output updates when shared source changes', async (t) => {
  const base = await fixture(t);
  const source = join(base, 'source');
  await mkdir(join(source, 'roles'), { recursive: true });
  const role = join(source, 'roles/olko-example.md');
  await writeFile(role, '# olko-example\n\nFirst description.\n');
  const destination = join(base, 'agents');
  await install(destination, { source });
  await writeFile(role, '# olko-example\n\nUpdated description.\n');
  assert.match((await install(destination, { source }))[0], /^update:/);
  assert.match(await readFile(join(destination, 'olko-example.toml'), 'utf8'), /Updated description/);
});

test('reject symlink destinations and symlink agent files', async (t) => {
  const base = await fixture(t);
  const real = join(base, 'real');
  await mkdir(real);
  await symlink(real, join(base, 'alias'));
  await assert.rejects(install(join(base, 'alias/agents')), /Unsafe destination/);
  await writeFile(join(base, 'foreign'), 'preserve');
  await symlink(join(base, 'foreign'), join(real, 'olko-team.toml'));
  await assert.rejects(install(real), /Conflict/);
  assert.equal(await readFile(join(base, 'foreign'), 'utf8'), 'preserve');
});

test('CLI selects global/project/output destinations and rejects invalid options', async (t) => {
  const base = await fixture(t);
  const script = join(root, 'scripts/codex-agents.mjs');
  const run = (args) => execFileSync(process.execPath, [script, ...args], { encoding: 'utf8', env: { ...process.env, CODEX_HOME: join(base, 'home') }, stdio: ['pipe', 'pipe', 'pipe'] });
  run(['--global']);
  run(['--project', join(base, 'project')]);
  run(['--output', join(base, 'output')]);
  for (const destination of ['home/agents', 'project/.codex/agents', 'output']) {
    assert.ok((await readdir(join(base, destination))).includes('olko-devops.toml'));
  }
  for (const args of [[], ['--project'], ['--global', '--project', base], ['--force']]) assert.throws(() => run(args));
});

test('broken and escaping source references fail generation', async (t) => {
  const source = await fixture(t);
  await mkdir(join(source, 'roles'));
  const role = join(source, 'roles/olko-example.md');
  await writeFile(role, '# olko-example\n\nExample. [missing](olko-missing.md)\n');
  await assert.rejects(generate(source), /ENOENT/);
  await writeFile(role, '# olko-example\n\nExample. [escape](../../private.md)\n');
  await assert.rejects(generate(source), /Unsupported shared reference/);
});
