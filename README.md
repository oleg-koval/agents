# agents

Reusable agent roles and delivery pipelines for repositories owned by Oleg Koval.

`agent-skills` remains the task-skill catalog. This repository defines how a role works across tasks. Fleet may copy selected files from here into opted-in repositories through reviewable PRs. A project owns its local role entry point, domain rules, commands, and acceptance criteria.

## Roles

| Role | Responsibility |
| --- | --- |
| [olko-team](roles/olko-team.md) | Route a task through the minimum useful roles |
| [olko-product](roles/olko-product.md) | Establish an evidence-backed outcome and acceptance gate |
| [olko-architect](roles/olko-architect.md) | Resolve boundaries, ownership, failure, and migration |
| [olko-engineer](roles/olko-engineer.md) | Build the smallest complete change and prove it locally |
| [olko-devops](roles/olko-devops.md) | Own CI/CD, infrastructure, deployment verification, rollback and observability |
| [olko-apple-review](roles/olko-apple-review.md) | Gate Apple features before allocation and after implementation; require cleanup and approve submission readiness |
| [olko-qa](roles/olko-qa.md) | Verify behavior independently |
| [olko-security](roles/olko-security.md) | Assess exploitable risks and privacy boundaries |
| [olko-growth](roles/olko-growth.md) | Test a measurable path to adoption |
| [olko-chief-of-staff](roles/olko-chief-of-staff.md) | Turn current evidence into one ranked next action while preserving founder control |

## Pipelines

| Pipeline | When to use |
| --- | --- |
| [Delivery](pipelines/delivery.md) | Scoped feature or repair from brief to evidence |
| [Charter](pipelines/charter.md) | A target repo has `.charter/rules.toml` and `.charter/checks.toml` |
| [Review](pipelines/review.md) | Independent diff review and finding resolution |
| [Release](pipelines/release.md) | Handoff from checked code to deployed acceptance |

These pipelines are guidance, not copied CI configuration. The target repository's `AGENTS.md`, Charter data, workflows, and specialist skills remain authoritative. `agent-skills` provides task-specific automation such as PR and release skills; this repository references those workflows without vendoring them.

Fleet distributes these instructions; it does not enforce CI, reviewer satisfaction, or merge state. Verify those gates in the target repository.

Keep reusable coordination and evidence rules here, executable task skills in `oleg-koval/agent-skills`, and portable host hooks/configuration in `oleg-koval/ai-dotfiles`. Projects own their QA scripts, fixtures and acceptance criteria. Convert retrospectives into the smallest rule or regression at its owning layer; keep raw private run reports out of this public repository.

## Composition in a target repo

### Native Codex agents

Generate standalone TOML from the shared Markdown sources with Node.js 22+. No Claude runtime or skillshare conversion is required. Codex discovers personal agents in `~/.codex/agents/` and project agents in `.codex/agents/`, using `name`, `description`, and `developer_instructions` ([official configuration reference](https://learn.chatgpt.com/docs/agent-configuration/subagents)). Model settings are omitted so the parent session's Codex-compatible model is inherited.

From this checkout, choose one destination:

```sh
# Preview personal installation, then install (respects CODEX_HOME).
node scripts/codex-agents.mjs --global --dry-run
node scripts/codex-agents.mjs --global

# Or install into an explicitly selected target project.
node scripts/codex-agents.mjs --project /path/to/project --dry-run
node scripts/codex-agents.mjs --project /path/to/project

# Generate a reviewable artifact without installing it into Codex.
node scripts/codex-agents.mjs --output ./generated-agents
```

Start a fresh Codex session in the target project after installation. Request a role by name, for example “Use olko-devops to inspect CI failures.” Native discovery exposes role names and descriptions; it does not automatically authorize delegation or require every role to run. No per-task shared-file read instruction or `config.toml` registration is needed.

Each agent bundles its primary role and the transitive closure of linked roles and pipelines. Links become internal section references, so moving the files or removing this checkout does not break them. The target project's current `AGENTS.md` and nested instructions take precedence. Project-specific workflows and specialist skills must still be available in the target environment.

Rerun the same command after updating shared sources. Unchanged files are left alone; intact installer-owned files update using a content digest. Foreign files, edited generated files, symlinked files and symlinked destination directories cause a conflict before writes begin. Preserve or relocate the conflicting file yourself and rerun; there is no force-overwrite mode. Unrelated and stale files are never removed. Avoid concurrent installers or editors during installation. Dry-run performs the same generation and conflict checks without creating directories or files. Generated TOML is an artifact; edit Markdown sources rather than maintaining parallel prompts. Do not commit personal installation directories.

Validate with `node scripts/validate.mjs` and `node --test scripts/codex-agents.test.mjs` (tests require Python 3.11+ for an independent standard-library TOML parser). Installation and valid TOML are separate from actual discovery: on compatible CLIs, `codex debug prompt-input` can inspect the fresh model-visible input without launching a model task. Verify the role names in that input; `codex agents` lists sessions, not the custom-role catalog. The adapter was checked against Codex CLI 0.166.0; older hosts may need an update.

See [role coverage](docs/role-coverage.md) for the concise installed-collection comparison and why only DevOps was added.

### Project skill composition

Keep a discoverable project-owned `SKILL.md` (for example `.agents/skills/example-architect/SKILL.md`). It should read `AGENTS.md`, the installed `roles/olko-architect.md`, and the project's current architecture sources before acting. It adds project rules and a project-specific description. Explicit file reads make the composition work in hosts that do not merge skill prompts automatically.

Fleet must select paths per repository and preserve project-owned files. A shared role update should reach the target as a reviewable PR with its source commit recorded. Missing shared content is a blocker, not a reason to invent the base role from memory.

## Public-content policy

Only portable methods and public-safe examples belong here. Do not add credentials, account identifiers, personal paths, customer data, unpublished plans, operational endpoints, or project-specific domain assertions. Each project keeps those in its own repository. Review the diff and run `node scripts/validate.mjs` before publishing.
