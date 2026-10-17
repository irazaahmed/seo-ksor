/**
 * The default registration — and the ORIGINAL of the file `ksor init` emits.
 *
 * This is the canonical half of decision 18's mechanism, applied to the agent
 * surface: one rule, two places, asserted rather than trusted. The scaffold's
 * `system/gateways/content.ts` is this file byte-for-byte below the import
 * block, and `default-gateway-drift.test.ts` fails on the line that diverges.
 *
 * Two places rather than one is forced, not chosen. Node refuses to type-strip
 * any `.ts` under `node_modules` — `ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`,
 * with no flag to lift it — so the published package cannot import its own
 * emitted template as a fallback. The compiled twin is how a deleted file still
 * serves, and the drift test is what stops the twins disagreeing.
 *
 * Everything below the import block is what an adopter owns: tool names, titles,
 * what the record says it covers, input schemas, annotations, and which tools
 * exist at all. What it composes — handlers, output schemas, and the FLOOR text
 * — stays in the package, because those are the citation and abstention
 * guarantees and a hand-written handler is the one thing no shape check catches.
 */

import {
  composeInstructions,
  FLOOR,
  MAX_OUTLINE_LIMIT,
  MAX_SEARCH_K,
  McpServer,
  outlineHandler,
  OUTLINE_OUTPUT,
  READ_ONLY,
  READ_OUTPUT,
  readHandler,
  SEARCH_OUTPUT,
  searchHandler,
  TRUST_TIERS,
  z,
  type ServiceContext,
} from "@panaversity/ksor/gateway";

export default function buildGateway(ctx: ServiceContext, version: string): McpServer {
  const server = new McpServer(
    // The MCP server name agents see. Change it to your record's name.
    { name: "askseo", version },
    // instance.md's body is this record's system prompt, preserved beneath the
    // framework floor. Leave this alone unless you mean to replace the prompt.
    { instructions: composeInstructions(ctx.instance.instructions) },
  );

  server.registerTool(
    "search",
    {
      title: "Search the record",
      // WHAT THIS RECORD COVERS goes first — it is how an agent with several
      // records attached decides to ask yours. Say the subject AND the
      // boundary; the second half prevents more wrong calls than the first:
      //
      //   description: `Employee handbook: leave, benefits, conduct, expenses.
      //   Not product documentation and not customer data.\n\n${FLOOR.search}`,
      //
      // FLOOR.search must stay. It tells an agent how to read an abstention and
      // that corpus text is untrusted; the door checks it is still there at boot.
      description:
        "AskSEO: an SEO course record. Covers niche research, keyword research and content " +
        "coverage, content writing, WordPress, on-page and technical SEO, APK websites, " +
        "off-page SEO and backlinks, local SEO, Etsy (Quick Skills) and the AI Agents module. " +
        "Not institute fees, schedules or admissions, and not general web knowledge. " +
        "Questions often arrive in Roman Urdu: search with the English SEO terms they mean.\n\n" +
        FLOOR.search,
      inputSchema: z.object({
        query: z
          .string()
          .min(1)
          .max(2000)
          .describe("A focused question or phrase to search the record for"),
        // `k` is the lever on reply size: 10 costs an agent ~3,500 tokens a
        // call, 5 costs ~2,000. Lower it to what your record actually needs —
        // a caller can always ask for more.
        k: z
          .number()
          .int()
          .min(1)
          .max(MAX_SEARCH_K)
          .default(5)
          .describe(`Maximum passages to return (1–${MAX_SEARCH_K})`),
        // The caller's trust floor. Keep it: dropping the parameter does not
        // weaken the record — the handler still applies `unverified` and this
        // deployment's own floor — but it takes away the only way a caller can
        // ask to be answered ONLY from what a human reviewed, and the door says
        // so at boot instead of failing quietly.
        min_trust_tier: z
          .enum(TRUST_TIERS)
          .optional()
          .describe(
            "Lowest trust tier to answer from (default unverified). This deployment's own " +
              "floor still applies: it can only be raised here, never lowered.",
          ),
      }),
      outputSchema: SEARCH_OUTPUT,
      annotations: READ_ONLY,
    },
    searchHandler(ctx),
  );

  // Delete a tool by deleting its block. Measured: outline and read together
  // cost ~1,643 tokens of context that is resident for an agent's whole
  // session, whether or not it ever calls them.
  server.registerTool(
    "outline",
    {
      title: "Outline the record",
      description: FLOOR.outline,
      inputSchema: z.object({
        node: z
          .string()
          .optional()
          .describe("Slug or '/'-path to drill into; omit to browse the top level"),
        depth: z.number().int().min(0).max(5).optional().describe("Extra levels below the anchor"),
        limit: z
          .number()
          .int()
          .min(1)
          .max(MAX_OUTLINE_LIMIT)
          .default(200)
          .describe("Maximum rows in ONE page"),
        offset: z
          .number()
          .int()
          .min(0)
          .optional()
          .describe("Rows to skip — pass the previous response's next_offset to continue"),
      }),
      outputSchema: OUTLINE_OUTPUT,
      annotations: READ_ONLY,
    },
    outlineHandler(ctx),
  );

  server.registerTool(
    "read",
    {
      title: "Read a document",
      description: FLOOR.read,
      inputSchema: z.object({
        slug: z.string().min(1).describe("The document's slug or '/'-qualified path (see outline)"),
        heading: z
          .string()
          .optional()
          .describe(
            "Restrict to one section subtree: a full heading path, any prefix of one, or a " +
              "section's last segment when it is unique in the document",
          ),
        from_heading: z
          .string()
          .optional()
          .describe("Window cursor from a previous response's next"),
        snapshot_token: z
          .string()
          .optional()
          .describe(
            'The "token" string from a search response\'s "snapshot" object — not the object.',
          ),
        token_budget: z
          .number()
          .int()
          .min(100)
          .max(70000)
          .optional()
          .describe("Response size budget in tokens (default 70000)"),
      }),
      outputSchema: READ_OUTPUT,
      annotations: READ_ONLY,
    },
    readHandler(ctx),
  );

  // Add your own tools here with ordinary registerTool + zod. They are yours;
  // ksor makes no provenance claim about a tool it did not hand you a handler
  // for, and the boot check only inspects the ones it did.

  // What was added to the record lately, newest first: "is hafte kya parhaya
  // gaya". Admission is outline's, so a draft, a withdrawn or a restricted
  // document never appears; the date is each document's own `added:` key (the
  // day its file first entered the record), read from the active generation.
  const outline = outlineHandler(ctx);
  server.registerTool(
    "whats_new",
    {
      title: "What's new in the record",
      description:
        "Lessons added to AskSEO recently, newest first, with the date each was added and " +
        "its page link. Use it when a student asks what was taught or added this week, " +
        "or what is new. Then search or read the lessons for their content.",
      inputSchema: z.object({
        days: z
          .number()
          .int()
          .min(1)
          .max(90)
          .default(14)
          .describe("How many days back to look (default 14)"),
        limit: z.number().int().min(1).max(50).default(15).describe("Maximum lessons to list"),
      }),
      annotations: READ_ONLY,
    },
    async ({ days, limit }, extra) => {
      const listed = (await outline({ depth: 5, limit: MAX_OUTLINE_LIMIT }, extra)) as {
        structuredContent?: { nodes?: { kind: string; title: string; heading_path: string }[] };
      };
      const documents = (listed.structuredContent?.nodes ?? []).filter((n) => n.kind === "document");
      const titles = new Map(documents.map((d) => [`knowledge/${d.heading_path}`, d.title]));
      const { rows } = await ctx.pool.query<{ stable_id: string; added: string }>(
        // The stored frontmatter is the document's own YAML text.
        `SELECT stable_id, added FROM (
           SELECT n.stable_id,
                  (regexp_match(s.frontmatter, '(?:^|\\n)added:\\s*([0-9T:.Z+-]+)'))[1] AS added
             FROM content_nodes n
             JOIN corpora c ON c.corpus_id = n.corpus_id AND c.active_generation = n.generation
             JOIN sources s ON s.node_id = n.node_id AND s.generation = n.generation
            WHERE n.kind = 'document' AND n.stable_id = ANY($1)
         ) d
         WHERE added IS NOT NULL AND added::timestamptz >= now() - make_interval(days => $2)
         ORDER BY added::timestamptz DESC
         LIMIT $3`,
        [[...titles.keys()], days, limit],
      );
      const lessons = rows.map((r) => ({
        title: titles.get(r.stable_id) ?? r.stable_id,
        added: r.added.slice(0, 10),
        stable_id: r.stable_id,
        link: `https://askseo.cybrumsolutions.dev/docs/${r.stable_id.replace(/^knowledge\//, "")}/`,
      }));
      const text =
        lessons.length === 0
          ? `Nothing was added to AskSEO in the last ${days} days.`
          : lessons.map((l) => `${l.added}  ${l.title}\n  ${l.link}`).join("\n");
      return { content: [{ type: "text" as const, text }], structuredContent: { days, lessons } };
    },
  );

  return server;
}
