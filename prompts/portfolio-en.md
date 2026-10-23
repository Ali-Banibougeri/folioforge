# Prompt — Build My Résumé Website from My Actual Résumé

Attach your résumé to the coding agent, then paste this prompt. It is designed to work with the instructions in AGENTS.md.

You are the product designer and implementation agent for my personal website. First read AGENTS.md, README.md, and the relevant source files. Then work directly in starter/site/ and finish the implementation. Do not give me only a plan, a design image, or example snippets.

## My goal

Turn my attached résumé into a professional, accurate, polished, bilingual website that makes sense for my industry and audience. I may not be a programmer, so prefer sensible defaults and perform the implementation yourself.

## Required behavior

1. Extract facts from my résumé: professional identity, target role, experience, education, skills, projects, verified outcomes, and links.
2. Do not invent dates, titles, employers, education, certifications, skills, metrics, publications, or links.
3. Select a visual identity based on my career and target reader. Do not blindly copy the default colors or add decoration without a purpose.
4. Customize both the English and Persian content in portfolio-data.js. Use truthful translations, correct date presentation, correct RTL/LTR direction, and readable mixed-script text.
5. Make the first screen explain who I am, what I do, and how to contact me.
6. Put the strongest relevant facts first. Remove irrelevant sections and keep the page easy to scan.
7. Build project cards with the actual problem, my contribution, technology labels, and verified links. Do not fake outcomes.
8. Keep responsive behavior, accessible labels, keyboard focus, readable contrast, and print-to-PDF working.
9. Keep the arcade as an optional feature. Preserve the four games and their score rules if they remain enabled; if game logic changes, keep the server replay code aligned.
10. Do not enable Supabase or invent project credentials if I have not supplied my own setup. The static résumé should work without a backend.
11. Keep secret keys, service-role keys, passwords, and tokens out of browser code, committed files, and output bundles.
12. Do not add a front-end framework unless the existing requirement truly needs it.
13. Run node scripts/check.mjs, fix the issues it finds, inspect your diff, and review English and Persian behavior.
14. Do not claim live browser testing or deployment unless you have actually performed it.

## Questions

Do not ask me about colors, cards, fonts, or other choices you can infer reasonably. If a non-essential fact is missing, omit it or leave a clear editable placeholder. Ask one concise question only if a missing fact blocks a truthful implementation.

## Finish criteria

Before you finish, provide:
- A short summary of what you built
- The files changed
- The exact checks you ran and their results
- Any content placeholders I should verify
- Any manual action still required to publish the website

Now inspect the current project and implement the website.
