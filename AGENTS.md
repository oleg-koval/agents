# Agent instructions

This repository contains public, reusable prompts. Read the target project's current `AGENTS.md` before applying a role. Target-specific instructions win over generic guidance. Never copy private project context into this repository.

Keep roles and pipelines separate: a role describes responsibility and evidence; a pipeline describes phase order and gates. A project skill composes them through explicit reads. Make the smallest focused edit, validate with `node scripts/validate.mjs`, and review the full diff for secrets and private facts before publishing.
