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

## Composition in a target repo

Keep a discoverable project-owned `SKILL.md` (for example `.agents/skills/example-architect/SKILL.md`). It should read `AGENTS.md`, the installed `roles/olko-architect.md`, and the project's current architecture sources before acting. It adds project rules and a project-specific description. Explicit file reads make the composition work in hosts that do not merge skill prompts automatically.

Fleet must select paths per repository and preserve project-owned files. A shared role update should reach the target as a reviewable PR with its source commit recorded. Missing shared content is a blocker, not a reason to invent the base role from memory.

## Public-content policy

Only portable methods and public-safe examples belong here. Do not add credentials, account identifiers, personal paths, customer data, unpublished plans, operational endpoints, or project-specific domain assertions. Each project keeps those in its own repository. Review the diff and run `node scripts/validate.mjs` before publishing.
