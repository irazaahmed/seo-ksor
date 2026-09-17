---
type: Document
title: Schema markup (structured data)
description: What schema markup is, why it earns rich results, and how to add JSON-LD schema to WordPress with the ACF plugin.
status: stable
order: 22
generated: { by: human:ahmedraza, at: 2026-09-15T11:37:20Z }
ksor:
  audience: [public]
  owner: human:ahmedraza
  approval: { by: human:ahmedraza, at: 2026-09-15T11:37:20Z }
sources:
  - id: iskills-course-notes
    title: iSkills — course notes
    resource: "iSkills SEO course notes, compiled 2025"
verified: [{ by: human:ahmedraza, at: 2026-09-17T13:00:00Z }]
---

## What is schema markup?

Schema markup (structured data) is code added to a page that helps Google
understand its content more precisely. When Google reads it, it can display
rich results — star ratings, FAQs, event info — directly in search results,
improving visibility and click-through rate (CTR).[^iskills-course-notes]

## Why add structured data

- Helps Google understand content more clearly.
- Improves how pages appear in results (featured snippets, knowledge
  panels).
- Increases the chance of rich snippets.
- Strengthens SEO and site credibility.

## How it works

With a format like JSON-LD, Google extracts and displays enhanced
information instead of reading only plain text. Example: an "Article" schema
can surface the author name, published date, headline, thumbnail image, and
ratings directly in the result.

**Supported format:** JSON-LD (JavaScript Object Notation for Linked Data) —
Google's recommended format, and the one to always use.

## Adding schema in WordPress with ACF

1. **Install ACF (Advanced Custom Fields)** — Plugins → Add New → search "ACF
   — Advanced Custom Fields" → Install → Activate.
2. **Create a custom field for schema** — Custom Fields → Add New, name it
   "Schema Markup", add a field of type Text Area named `schema`, set
   location rules to Post Type = Post and Post Type = Page, and publish the
   field group.
3. **Generate the schema code** — ask an AI tool for JSON-LD (Article, FAQ,
   Product, etc.) and copy the result.
4. **Paste it into `functions.php`** — Appearance → Theme File Editor →
   `functions.php`, and add:

```php
function add_custom_schema_to_head() {
  if (is_single() || is_page()) {
    $schema = get_field('schema');
    if (!empty($schema)) {
      echo '<script type="application/ld+json">' . $schema . '</script>';
    }
  }
}
add_action('wp_head', 'add_custom_schema_to_head');
```

This pulls the schema from the ACF field and outputs it in the page's
`<head>`.

**Optional:** online schema generators can auto-generate schema (Video,
Article, Product) from a pasted link — paste the resulting code into the ACF
field on the post/page.

## Testing schema

Use Google's Rich Results Test (or the Structured Data Testing Tool). A green
tick means the schema is valid — always test before publishing.

## Important notes

- The schema must match the actual visible content on the page.
- Never use fake or misleading structured data — it risks a manual penalty.
- Visible content (title, author, date) should match what the schema claims.
- Use an AI tool to help generate or validate clean JSON-LD for your case.

## Rank Math SEO plugin

A separate lecture covers setting up Rank Math for schema support, canonical
tags, and meta settings — follow that lecture for the plugin-specific setup.

## Summary

- Schema markup improves SEO and helps content stand out visually in search.
- The ACF + `functions.php` method adds custom schema manually.
- Generate schema from trusted tools or AI, and always test before shipping.
- Article, Video, Product, and FAQ schema can each boost ranking and
  visibility.

[^iskills-course-notes]: iSkills SEO course notes, compiled 2025.
