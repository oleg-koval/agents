# Release pipeline

1. Identify the exact checked commit, target environment, deployment mechanism, and rollback path from the project repo.
2. Confirm local checks, independent review, required CI, migration safety, and release notes against that commit. Unknown gates remain unknown.
3. Use the project's release skill and deployment workflow. Keep publication, infrastructure changes, and spending behind the project's authorization gates.
4. Re-read the deployed artifact and target state. QA checks real user behavior in the destination environment; a successful workflow alone is not acceptance.
5. Report commit, remote head, CI, deployment, live acceptance, rollback readiness, and remaining issues separately.

This pipeline does not replace project-specific release instructions, staging order, or device acceptance requirements.
