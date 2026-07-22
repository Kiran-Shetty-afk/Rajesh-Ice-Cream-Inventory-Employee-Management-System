# Brain Index

Project knowledge base for humans and AI agents.

| Path | Purpose |
| --- | --- |
| [rules/standards.md](rules/standards.md) | Lean universal rules (read every session) |
| [rules/stack.md](rules/stack.md) | Stack-specific conventions |
| [rules/workflow.md](rules/workflow.md) | Coding flow, scope, git branch policy |
| [rules/testing.md](rules/testing.md) | Testing policy |
| [rules/ui.md](rules/ui.md) | UI / design guidance |
| [rules/deployment.md](rules/deployment.md) | Deployment notes |
| [kb/00-project-overview.md](kb/00-project-overview.md) | Project summary, purpose, users, major modules |
| [kb/01-architecture.md](kb/01-architecture.md) | App architecture, boundaries, folders, data flow |
| [kb/02-stack-and-dependencies.md](kb/02-stack-and-dependencies.md) | Frameworks, packages, runtime, tooling |
| [kb/03-data-model.md](kb/03-data-model.md) | DB models, schemas, migrations, persistence |
| [kb/04-auth-and-permissions.md](kb/04-auth-and-permissions.md) | Auth, roles, sessions, access control |
| [kb/05-api-and-integrations.md](kb/05-api-and-integrations.md) | APIs, webhooks, third-party integrations |
| [kb/06-ui-and-routes.md](kb/06-ui-and-routes.md) | Pages, routes, layouts, components |
| [kb/07-features.md](kb/07-features.md) | Feature index linking to `kb/features/` |
| [kb/08-flows-and-workflows.md](kb/08-flows-and-workflows.md) | User journeys and business workflows |
| [kb/09-infra-and-deployment.md](kb/09-infra-and-deployment.md) | Packaging, env vars, deployment notes |
| [kb/10-testing-and-quality.md](kb/10-testing-and-quality.md) | Test strategy and quality gates |
| [kb/11-known-risks-and-decisions.md](kb/11-known-risks-and-decisions.md) | Risks, tradeoffs, architecture decisions |
| [CHANGELOG.md](CHANGELOG.md) | Versioned log of brain, KB, and standards changes |
| [issues/INDEX.md](issues/INDEX.md) | Active/completed issue tracker |
| [plans/INDEX.md](plans/INDEX.md) | Active/completed plan tracker |

## Maintenance

- Code and KB move together: update `brain/kb/` after meaningful feature, schema, UI, workflow, deploy, or test-strategy changes.
- Edit rules under `brain/rules/`; keep `standards.md` lean.
- Never delete the `brain/` folder.
