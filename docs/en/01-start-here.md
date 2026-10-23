# 01 — Start Here, Even If You Have Never Coded

[← FolioForge README](../../README.md) · [فارسی](../fa/01-start-here.md)

This guide explains how to go from a résumé file to a public website. You do not need to understand every line of code before you begin.

## Choose your path

**Path A — AI coding workspace (recommended):** clone or download FolioForge, open the folder in a coding agent that can edit local files, attach your résumé, and use the one-sentence instruction in README.md. The agent should make the changes and run the checks.

**Path B — ChatGPT without a connected code workspace:** download the repository as a ZIP. Upload the ZIP and your résumé to a ChatGPT session that supports file editing, then paste the prompt from prompts/portfolio-en.md. Ask for a complete updated project ZIP, not just code snippets. You will still need to upload the result to GitHub to publish it.

**Path C — Manual editing:** edit starter/site/assets/portfolio-data.js in a text editor. This is mainly for people comfortable editing structured JavaScript data.

## Step 1: Prepare your résumé

Use a résumé you are comfortable sharing with an AI tool. Remove information that should not be public: home address, identity numbers, private phone numbers, or references' contact details.

Your résumé should contain only facts you want to publish. If a fact is uncertain, the website should omit it or mark it as a placeholder.

## Step 2: Make one clear promise

Complete this sentence:

    I help [audience] achieve [real outcome] by using [verified strengths].

For example, a software engineer may focus on reliable systems, while a researcher may focus on publications, methods, and research areas. The sentence should be true and specific.

## Step 3: Understand the starter

The website is intentionally static. HTML describes the content structure, CSS gives it visual form, and JavaScript renders your résumé. Static hosting is enough for the main résumé page.

The main content file is starter/site/assets/portfolio-data.js. It contains English and Persian versions of your profile. The agent should replace example values from your résumé rather than paste your whole CV into a single paragraph.

The visitor counter is optional. Your résumé works without Supabase; enable the counter only after creating your own Supabase project and following the connection guide.

## Step 4: Run it locally

Install a current Node.js LTS release only if you want to run local checks. To preview the website, open a terminal in the project folder and run:

    python -m http.server 8000

Visit http://localhost:8000/starter/site/ when serving the repository root. The actual publishing workflow exports starter/site as the website root, so relative paths then work at the published address.

Stop the server with Ctrl+C. If Python is not installed, a local static-server extension in your editor is another option.

## Step 5: Check the result

- Read every section in both languages.
- Open every contact and project link.
- Remove sample text and placeholder links.
- Check the layout on a phone-sized screen and a desktop.
- Use Print → Save as PDF and inspect the output.
- If the visitor counter is enabled, verify that the Edge Function returns a count.
- Run node scripts/check.mjs.

## Step 6: Publish

The included GitHub Actions workflow deploys starter/site. Once per repository, open Settings → Pages and set the source to GitHub Actions. The workflow then publishes the page after a push to main.

A coding agent can write and test the project files, but publishing still depends on repository permissions and GitHub account settings.

## Words explained

- **Repository:** the project folder stored on GitHub, including history.
- **Clone:** make a local copy that stays connected to the GitHub repository.
- **Commit:** a named checkpoint of changes.
- **Deploy/publish:** upload the website output to a host so people can visit it.
- **Responsive:** the layout adapts to phones, tablets, and desktops.
- **RTL/LTR:** right-to-left layout for languages such as Persian, and left-to-right layout for English.

## Common mistakes

- Publishing the template without replacing its sample content.
- Inventing achievement numbers to make a résumé look stronger.
- Leaving a placeholder link to a fake employer or project.
- Publishing an API secret in browser code.
- Assuming that a successful code syntax check guarantees a perfect website.

The goal is not to make the longest résumé. It is to make the most useful, truthful, readable first impression.
