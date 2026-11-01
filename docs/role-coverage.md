# Role coverage

Comparison of the installed Claude Markdown collection and shared roles, reviewed 2026-11-01. This is a capability comparison, not an import or a Claude runtime dependency. Provider-specific models, tools, examples and local configuration are excluded.

| Installed capability | Shared coverage and decision |
| --- | --- |
| Backend architect, frontend developer, AI engineer | Architect + Engineer cover design and implementation. Framework, mobile and AI constraints belong in target-project skills; no separate shared roles warranted. |
| Pragmatic engineer, refactoring specialist | Engineer already favors scoped changes and evidence. Add behavior-preserving regression proof to project acceptance when refactoring; no persona duplicates. |
| Test writer/fixer, gradual boundary testing, API tester | Engineer owns regression proof; QA owns independent behavior verification. Boundary cases, denial paths and API contracts fit those mandates. |
| Performance benchmarker | Engineer + QA can establish a representative baseline, load conditions and measured regression. A dedicated role is unwarranted until repeated work requires a narrower mandate. |
| Codebase investigator | Architect + Engineer cover tracing and root-cause work. Useful technique: map claims to call/data flow and source locations, explicitly naming untraced dependencies. No theatrical persona needed. |
| DevOps automator | The release pipeline orders phases but did not own operational engineering. Add olko-devops for CI/CD, infrastructure, deployment provenance, rollback and observability, with explicit authority limits. |

The shared catalog additionally covers Product, Security, Growth, Chief of Staff, Apple Review and team routing. Keep responsibilities in roles and sequencing in pipelines. Native Codex discovery is an adapter gap: generate standalone TOML from these shared sources rather than relying on a Claude Markdown synchronizer or maintaining another prompt collection.
