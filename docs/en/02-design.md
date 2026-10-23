# 02 — Plan Content and Visual Identity

[← FolioForge README](../../README.md) · [فارسی](../fa/02-design.md)

A professional website begins with good decisions, not decoration. Choose a visual identity from the user's field, audience, seniority, and actual evidence of work.

## Plan the page

A strong starting order is:
1. Introduction: name, accurate role, one-sentence value statement, and contact action.
2. Summary: the few facts that best explain the person's professional direction.
3. Experience: relevant roles, organizations, dates, and real responsibilities.
4. Selected projects: problem, contribution, technologies, and a real destination link.
5. Skills: grouped into meaningful areas, not fake percentage bars.
6. Education and certifications: only verified qualifications.
7. Contact: links that the user explicitly wants public.
8. Footer: minimal closing information and optional credit.

Do not add empty sections just because the template contains them. The agent may remove or hide irrelevant sections.

## Choose a visual direction

Ask:
- Is the audience a recruiter, client, research group, or professional community?
- Is the field engineering, healthcare, finance, education, design, public service, or something else?
- Should the site feel formal, creative, technical, calm, or editorial?
- What two or three real projects or accomplishments should be remembered?

For a scientific profile, readability and publications may matter more than animations. For a creative portfolio, carefully selected visuals may matter. For a technical résumé, clean structure and credible project evidence can be the best visual language.

## Use a design system

FolioForge defines a compact set of CSS variables in styles.css and a matching theme object in portfolio-data.js:
- Background and surface colors
- Primary and muted text
- Accent and secondary accent
- Border color
- Spacing, typography, card shape, and focus states

Change theme values in portfolio-data.js first. The rendering script accepts valid hexadecimal color values for theme variables. Keep contrast readable and test both dark and light preferences if you add a second theme.

## Content quality

A strong project card answers:
- What was the problem or purpose?
- What did I personally build or contribute?
- Which tools and technologies were used?
- Is there a real demo, repository, paper, or other destination?

If an outcome cannot be measured, describe what was actually delivered. Never add fake percentage improvements or claim a project is production-ready if it is not.

## Accessibility and responsive behavior

- Use real headings in a logical order.
- Make every control keyboard accessible.
- Keep focus indicators visible.
- Give meaningful images alternate text.
- Test mobile widths around 320–430 pixels and desktop widths around 1280 pixels.
- Avoid horizontal overflow and clipped content.
- Respect reduced-motion settings.
- Do not rely on color alone to communicate status.

## Exercise

Create two possible visual directions in plain language, one formal and one creative. Select the direction that best fits the intended audience. For each color, card style, and animation, explain the job it performs. Remove decorative elements without a clear purpose.
