---
type: Document
title: WordPress setup — cleanup, theme, plugins, and page design
description: Post-installation WordPress setup — removing default content, configuring settings, installing the Kadence theme and plugins, and building header, footer, menu, and page layouts.
status: stable
order: 17
generated: { by: human:ahmedraza, at: 2026-09-20T12:00:00Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-20T12:00:00Z }
sources:
  - id: iskills-course-notes
    title: iSkills — course notes
    resource: "iSkills SEO course notes, compiled 2026"
verified: [{ by: human:ahmedraza, at: 2026-09-20T12:00:00Z }]
---

## Step 1: clean up default content

- Delete dummy posts (Posts).
- Delete dummy pages (Pages).
- Delete pre-installed plugins (Plugins).[^iskills-course-notes]

## Step 2: configure settings

- **General settings** — set the site language for your target audience
  (e.g. Arabic, Spanish).
- **Writing settings** — no change needed.
- **Reading settings** — check "Discourage search engines from indexing this
  site" while the site is still in development.
- **Permalink settings** — select "Post name", then save.

## Step 3: theme and plugin installation

**Kadence theme** — Appearance → Themes → Add New → search "Kadence" →
Install → Activate; delete unused themes afterward to save space.

**Kadence Pro plugin** — Plugins → Add New → Upload Plugin → upload the
Kadence Pro file → Install → Activate → enter the license key → activate all
Pro add-ons.

**Kadence Blocks** and **Kadence Blocks Pro** — install the same way (search
the plugin directory for Blocks; upload-and-license for Blocks Pro). Keep
plugins updated when a new version is available.

## Colors and fonts

- Colors can be skipped for now, or left at the theme default.
- Fonts: Typography Settings — recommended options are Poppins, Montserrat,
  Lato, or Roboto.

## Header setup

1. Open the Customizer (top black bar → Customize).
2. In the Header section, edit the logo: upload the logo file, adjust size,
   remove the title/tagline if not needed, set the site title and tagline
   (this matters for SEO), and set the site icon (shown in the browser tab
   and in the SERP).
3. To change the header background: General Settings → Design → Main Row
   Background, and use the Global Palette to keep the theme's colors
   consistent.

Keep good contrast between the logo and the header background for
visibility.

## Footer setup

In the Customizer's Footer section, edit the copyright area's text, and
remove the theme credit line ("Powered by Kadence").

## Color palette and contrast

- Use a contrast checker (e.g. Coolors) to confirm your color pairing meets
  accessibility standards.
- Use a color-picker extension (ColorZilla, Eye Dropper) to lift a color
  code from any site you like.
- Browse brand color palettes (e.g. brandcolor.net) for inspiration.

**Avoid:** light background with light text, or dark background with dark
text. **Prefer:** light background with dark text, or dark background with
light text.

**In WordPress:** Appearance → Customize → Colors & Fonts → Colors — define
up to three palettes, though only one is active at a time. Dark mode is a
separate toggle (Appearance → Customize → General → Color Switch) with its
own assigned palette, and a dark-mode toggle can be added to the header or
footer via the Header/Footer Builder.

## Pages, menu, and header layout

### Essential pages

Dashboard → Pages → Add New, and create at minimum: About Us, Contact Us,
Privacy Policy, Terms & Conditions.

### Menu

1. Appearance → Menus → Create a New Menu, name it "Header", and create it.
2. Add the pages created above to this menu, then save.
3. Assign it: Appearance → Customize → Header → Primary Navigation → select
   the "Header" menu.

### Header layout

- Choose a layout type: Standard, Full Width, or Contained.
- Adjust header height with the height slider.
- Set navigation colors for Normal, Hover, and Active states (Design →
  Navigation Colors).
- Add a button or a search bar via the "+" icon in the Header Builder.

### Footer layout

Appearance → Customize → Footer: choose the number of rows (Top, Main,
Bottom), add widgets per row ("+" icon: Navigation Menu, Social Icons, Text,
Image), and set footer colors per row (Design → Footer Colors).

## Post and page layouts

- **Row Block → Detail** structure suits detailed content presentation.
- Light background with dark text gives the best readability for most
  content; dark background with light text suits sections needing emphasis.
- Use categories to group related posts, and tags to flag specific topics
  within them.
- Build static pages (Home, About Us, Contact Us) for the site's core
  information, mixing text, images, and video for engagement.

## Additional tips

- Keep one global color palette consistent across every page.
- Check and adjust every layout for mobile using the Customizer's device
  preview.
- Fold SEO optimization into layout decisions from the start, rather than
  retrofitting it later.

[^iskills-course-notes]: iSkills SEO course notes, compiled 2026.
