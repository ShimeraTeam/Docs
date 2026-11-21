# AGENTS.md

Sources of the official Shimera documentation site: user and contributor
guides, in English and French, built with VitePress. This file is the map of the
repo and the invariants every change keeps, whatever the task. Its goal is that
any agent, on any task, produces pages that look written by the same hand.

Read before writing:

- [README.md](README.md): what the repo is, how to run it, licensing summary.
- [CONTRIBUTING.md](CONTRIBUTING.md): writing guidelines, image policy,
  licensing of contributions.
- [docs/contributor/git_workflow.md](docs/contributor/git_workflow.md): branch
  and commit conventions, for when you suggest a commit message to the user.
- The Shimera library, [ShimeraTeam/Shimera](https://github.com/ShimeraTeam/Shimera):
  the source of truth for every class, header, signature, default and range you
  write. When a local checkout of it is available, read its headers there.

## Repo map

| Path | Role |
|------|------|
| `docs/` | English pages (canonical). `user/` for library users, `contributor/` for library developers. |
| `docs/fr/` | French mirror of `docs/`, same tree, same file names. |
| `docs/res/` | Images and GIFs, shared by both languages. |
| `docs/.vitepress/config.mts` | Site config: `base: '/Docs/'`, locales, nav, and the **hand-written sidebars of both locales**. |
| `docs/.vitepress/theme/index.ts` | Theme: Mermaid renderer and the license footer on every page. |
| `.github/workflows/vitepress.yml` | Builds and deploys to `gh-pages` on every push to `main`. |

Pages are Markdown with VitePress extensions: `::: tip`, `::: info`,
`::: warning` boxes for caveats, `::: code-group` for per-backend variants,
Mermaid blocks for diagrams, and Vue components where a page needs one
(`user/performance/BenchmarkCharts.vue`).

## Ask, then default

Some actions need the user's word. For each one, ask, then **default**: if the
user gives no answer, or you run without anyone to ask, take the default below
and say at the end which default you took.

| Situation | Ask | Default |
|-----------|-----|---------|
| Deleting or renaming a page (it breaks public URLs) | Before doing it | Leave the page as it is |
| Splitting a long page into several | Before doing it, with the proposed split | Keep one page |
| Adding a new dependency (editing `package.json`) | Before doing it, with the package and why the page needs it | Leave `package.json` as it is, do without the dependency |
| A page would benefit from an image | Whether to create placeholder images | Image comment placeholder (see [Images](#images)) |
| **Drift** you notice outside your task | Whether to fix it now | Report it at the end, leave it unfixed |
| Your change makes this AGENTS.md wrong | Whether to update it | Report it at the end, leave it unchanged |

**Drift** is any place where the repo disagrees with itself or with this file: a
page off its skeleton, an EN/FR mismatch, an image name off convention, a sidebar
entry out of order. Name the file and the mismatch when you report it.

## Hard limits

- **Git is read-only.** Use `git status`, `git diff`, `git log`, `git show` to
  understand the state of the repo. The user does every write: commit, push,
  branch, checkout, switch, merge, rebase, stash, reset, tag, `git mv`, `git rm`.
  Edit and delete files with your file tools.
- **`LICENSE` changes only on the user's explicit request**, and so do the
  license sections of `README.md` and `CONTRIBUTING.md` and the license footer
  in `theme/index.ts`.
- **Stack upgrades are suggest-only.** VitePress, Node, Mermaid, the versions
  in `package.json` and `package-lock.json`, the workflow: propose an upgrade
  or a change with its reason, and leave the files as they are. Adding a brand
  new dependency is an ask (see [Ask, then default](#ask-then-default)).
- **Images are the user's.** Create no image, GIF or diagram file unless the
  user asked for placeholders (see [Images](#images)). Add no third-party image.

## Done

A change is done when:

1. Every touched EN page has its FR **mirror** updated in the same change, and
   the reverse.
2. Every new or moved page is in the sidebar of **both** locales in
   `config.mts`, and listed on its section's index page when it is an effect or
   a material.
3. Every API fact is checked against the library, or flagged as **unverified**.
4. `npm run build` passes. It fails on dead links and on missing local images.
   If `node_modules` is missing, run `npm ci` first: it installs from the
   lockfile and changes no tracked file. Use `npm ci`, not `npm install`,
   which can rewrite `package-lock.json`.

End with a short report: what changed, which defaults you took, what is
unverified, and any drift you noticed.

## API accuracy

Every class name, header path, constructor signature, setter/getter, type,
default and range on a page matches the library's current headers. Code samples
compile against the current API: real includes, real types, real method names.

When you cannot check a fact, warn the user **before** writing it, name each
**unverified** fact, and still mark it in your final report. Write only API you
have seen in the library or that the user gave you.

## Writing style

### Length

Pages are mid-short: as long as the content needs, no more. Each paragraph
carries information the reader needs to use the feature. A page that grows long
can be split into several, when the split follows a real boundary in the
content and the user agreed to it.

### English

- Second person ("you"), present tense, short sentences.
- Plain, factual words. Describe what the feature does, then let the parameter
  tables and examples carry the detail.
- American spelling everywhere, code comments included (`color`, `center`,
  `normalize`), matching the API.
- No emojis.
- Code: C++, with comments on the lines a reader would otherwise question.
  Effects are configured through the chained `with...()` setters.

### French

French pages are a faithful **mirror** of the English: same sections, same
order, same facts, same code. Translate, adding and dropping nothing.

- *Vous*.
- Class, effect and API names stay in English: "l'effet Bloom",
  "Effet Atmospheric Scattering", `withThreshold()`.
- Common graphics terms stay in English (*shader*, *depth buffer*, *pipeline*,
  *framebuffer*, *tone mapping*), with a French gloss in parentheses on first
  use when it helps: "Atmospheric Scattering (diffusion atmosphérique)".
- French typography: a space before `:`, `;`, `?`, `!`, including in the
  metadata labels (`**Classe :**`).
- Code is identical to the English page; only the comments are translated.
- Image alt text is translated; image paths gain one `../` for the extra `fr/`
  level.

Heading translations already in use: Description, Constructeur, Paramètres,
Valeurs des paramètres, Utilisation, Utilisation de base, Compatibilité des
Backends, Voir Aussi, Démarrage rapide. Metadata labels: Classe, En-tête,
Profils, Implémentation, Shader(s).

### Characters and code layout

Both languages, in prose, tables, diagrams and code alike, use plain keyboard
characters. French accented letters (é, è, à, ç, ...) and the underscore `_`
are plain characters.

- Dashes: the simple hyphen `-`, for every dash (asides, ranges, list
  separators). Em dashes, en dashes and other dash variants are replaced by it.
- Arrows: `->` or `-->`, never box-drawing or Unicode arrows (`─►`, `→`).
- Other symbols the same way: `...` for an ellipsis, straight quotes `"` and
  `'`, `x` for "times".

Inline code comments sit one space after the code, never aligned into a column:

```cpp
myFunc(4.0f); // 4.0 is a float
fx.add<shimera::Vignette>(); // default parameters
```

These two rules win over any existing page, the reference pages included.

## Page skeletons

Every page of a type follows its skeleton. It is a baseline: a complex page
adds sections where its content needs them (see `atmospheric_scattering.md`),
and keeps the baseline sections in the baseline order. Simple effects take their
structure from `bloom.md`-sized pages; `atmospheric_scattering.md` is the
reference for voice and for complex effects. When the library changes, an
existing page changes with it, simpler or richer.

### Effect page (`docs/user/shaders/<name>.md`)

```markdown
# <Name> Effect

**Class:** `shimera::<Name>`  
**Header:** `effects/<Name>.hpp`  
**Implementation:** `src/effects/<Name>.cpp`  
**Shader:** `res/shader/postprocessing/<name>.slang`

## Description
What it does, how it works in a few sentences or a short numbered list of passes,
then any caveat as a ::: tip / info / warning box.

## Constructor
The constructor signature in a cpp block, with its defaults.

## Parameters
| Parameter | Setter / Getter | Type | Range | Default | Effect |

### Parameter Values
One bullet per parameter, listing typical values and what each looks like,
with "(default)" on the default.

## Usage
The capture of the effect, a minimal snippet using the chained setters, then
one ### section per named scenario (Damage Feedback, Transition, ...).
```

The metadata lines end with two trailing spaces (Markdown line break). Add
`**Profiles:**` when the effect has profile headers, and use `**Shaders:**`
with the directory when it has several shader files.

### Material page (`docs/user/materials/<name>.md`)

Same metadata block and sections as an effect page, plus:

- a `::: tip` box in Description stating it is a material, not a post-process;
- `## Usage` with one `###` section per backend (`### Basic Usage (Raylib)`,
  `### OpenGL`, ...);
- `## Backend Compatibility` and `## See Also` at the end.

`## Constructor` is present when the material takes constructor parameters.

### Index and guide pages

Section indexes (`shaders/index.md`, `materials/material_shaders.md`) and guides
(`installation.md`, `effect_pipeline_builder.md`) open with `# <Title>` and a
short paragraph on what the page covers. Step-by-step usage goes in numbered
`###` headings (`### 1. Create the Context and a host target`). Section indexes
end with the list of everything the section provides, grouped by category, one
line each: `- [**Name**](./file.md) - one-line description`, and the count in
the sentence above it ("Shimera provides **11 effects**").

Contributor pages document the library for its developers; they follow the
same voice rules.

## Placement and naming

- **Pages**: `snake_case.md`, named after the feature (`chromatic_aberration.md`).
  EN and FR share the file name.
- **Sidebar**: in each sidebar group, `Index` first, then the other entries
  alphabetically. The sidebar text is the feature name; FR keeps English
  feature names and translates the group names.
- **Index pages**: a new effect or material also goes in the list of its
  section's index page, in the right category, with the count updated.
- **Links** between pages are relative Markdown links to the `.md` file
  (`./bloom.md`, `../index.md#host-targets`).

## Images

- Files live in `docs/res/<section>/` (`docs/res/shaders/` for effects).
- New files are `snake_case`, named after their page: `<page>.gif` for the main
  capture, `<page>_<variant>.png` for extra views
  (`atmospheric_scattering_sky.png`).
- Pages reference them by relative path: `../../res/shaders/<page>.gif` from
  `docs/user/shaders/`, `../../../res/shaders/<page>.gif` from the French page.
- What images may enter the repo at all is set by
  [CONTRIBUTING.md](CONTRIBUTING.md).

When a page needs an image that does not exist, write an image comment
placeholder where the image goes, giving its future path and what it shows:

```markdown
<!-- IMAGE: ../../res/shaders/<page>.gif - <what the capture shows, with which settings> -->
```

The comment keeps `npm run build` passing (a Markdown image to a missing file
fails it) and stays invisible on the site. List every placeholder in your final
report. If the user asked for placeholder images instead, create the file at
that path and reference it with a normal Markdown image.
