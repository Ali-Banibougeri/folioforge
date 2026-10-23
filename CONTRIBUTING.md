# Contributing to FolioForge

Contributions should make the project clearer, safer, more accessible, or easier for beginners to use.

## Before opening a change

- Search existing guides to avoid duplicating a lesson.
- Keep English and Persian guides aligned when changing user-facing instructions.
- Do not include real résumés, private contact details, screenshots with secrets, or production API keys.
- Keep documentation accurate to code in this repository.
- Prefer small, understandable changes over new dependencies without a clear benefit.

## Quality checks

Run the command below from the repository root:

    node scripts/check.mjs

For arcade changes, play the affected game and ensure browser rules and server replay rules match. For translation changes, inspect both languages and the RTL layout.

## Documentation style

Explain unfamiliar terms when first used. Present steps in the order a beginner performs them. Separate required actions from optional features. Never claim deployment or testing occurred unless it actually did.
