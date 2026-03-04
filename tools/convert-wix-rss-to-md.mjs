import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";
import slugify from "slugify";

const INPUT_XML = path.resolve(process.cwd(), "blog-feed.xml");
const OUT_DIR = path.resolve(process.cwd(), "content", "post");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function toISODate(pubDate) {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return "";
  // YYYY-MM-DD
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function normalizeSlug(slug) {
  return slugify(slug, { lower: true, strict: true, trim: true });
}

function extractSlugFromLink(link) {
  // Wix RSS link often looks like:
  // https://www.aicoachingsolutions.net/post/<slug>
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("post");
    if (idx >= 0 && parts[idx + 1]) return normalizeSlug(parts[idx + 1]);
    // fallback: last segment
    return normalizeSlug(parts[parts.length - 1] || "");
  } catch {
    return "";
  }
}

function stripCdata(s) {
  return (s || "").replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function firstNonEmpty(...vals) {
  for (const v of vals) {
    const t = extractText(v).trim();
    if (t) return t;
  }
  return "";
}

function extractText(node) {
  if (!node) return "";
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);

  // common fast-xml-parser shapes
  if (typeof node === "object") {
    if (Array.isArray(node)) {
      for (const part of node) {
        const txt = extractText(part);
        if (txt) return txt;
      }
      return "";
    }

    const candidates = [node.__cdata, node["#text"], node.text, node.value];
    for (const candidate of candidates) {
      const txt = extractText(candidate);
      if (txt) return txt;
    }
    return "";
  }

  return "";
}

function safeFilename(slug) {
  return `${slug}.md`;
}

function stripHtmlTags(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractArticleBodyFromJsonLd(pageHtml) {
  const re =
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  const matches = pageHtml.matchAll(re);

  for (const m of matches) {
    const jsonText = (m[1] || "").trim();
    if (!jsonText) continue;
    try {
      const parsed = JSON.parse(jsonText);
      const nodes = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.["@graph"])
          ? parsed["@graph"]
          : [parsed];

      for (const node of nodes) {
        const type = Array.isArray(node?.["@type"])
          ? node["@type"].join(",")
          : node?.["@type"] || "";
        const looksLikeArticle = /article|blogposting/i.test(String(type));
        if (!looksLikeArticle) continue;

        const body = firstNonEmpty(node?.articleBody, node?.description);
        if (body) return body;
      }
    } catch {
      // ignore invalid JSON-LD blocks
    }
  }

  return "";
}

function extractLikelyArticleHtml(pageHtml) {
  const cleaned = pageHtml
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ");

  const candidates = [
    cleaned.match(/<article[\s\S]*?<\/article>/i)?.[0] || "",
    cleaned.match(/<main[\s\S]*?<\/main>/i)?.[0] || "",
  ];

  return candidates.find((c) => c.trim()) || "";
}

async function fetchFallbackMarkdown(link, turndown) {
  if (!link) return "";
  try {
    const res = await fetch(link, {
      headers: { "User-Agent": "AI-Coaching-RSS-Converter/1.0" },
    });
    if (!res.ok) return "";

    const pageHtml = await res.text();

    const jsonLdBody = extractArticleBodyFromJsonLd(pageHtml);
    if (jsonLdBody) {
      return jsonLdBody.trim();
    }

    const articleHtml = extractLikelyArticleHtml(pageHtml);
    if (!articleHtml) return "";

    const md = turndown.turndown(articleHtml).trim();
    return md;
  } catch {
    return "";
  }
}

async function main() {
  // --- Main ---
  if (!fs.existsSync(INPUT_XML)) {
    console.error(`ERROR: Cannot find ${INPUT_XML}`);
    console.error(`Place your RSS file at project root as: blog-feed.xml`);
    process.exit(1);
  }

  ensureDir(OUT_DIR);

  const xml = fs.readFileSync(INPUT_XML, "utf-8");

  // fast-xml-parser config: preserve tags + decode common entities
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    parseTagValue: false,
    trimValues: true,
    // do not drop namespaces like content:encoded
    removeNSPrefix: false,
    // keep CDATA and text nodes accessible
    cdataPropName: "__cdata",
    textNodeName: "#text",
    alwaysCreateTextNode: true,
  });

  const parsed = parser.parse(xml);

  // RSS shape: rss.channel.item
  const channel = parsed?.rss?.channel;
  let items = channel?.item ?? [];

  if (!Array.isArray(items)) items = [items];

  const turndown = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    emDelimiter: "_",
  });

  // Keep links clean
  turndown.addRule("removeEmptyParagraphs", {
    filter: (node) => node.nodeName === "P" && !node.textContent.trim(),
    replacement: () => "",
  });

  const results = [];
  const seen = new Set();

  for (const item of items) {
    const title = firstNonEmpty(item?.title);
    const link = firstNonEmpty(item?.link);
    const pubDate = firstNonEmpty(item?.pubDate);
    const isoDate = toISODate(pubDate);

    // description in RSS is often an excerpt, may include HTML
    const rawDesc = stripCdata(firstNonEmpty(item?.description));
    const descMd = rawDesc ? turndown.turndown(rawDesc) : "";
    const description = descMd.replace(/\s+/g, " ").trim().slice(0, 220);

    // Full HTML usually lives here:
    // content:encoded
    const encodedNode =
      item?.["content:encoded"] ??
      item?.encoded ??
      item?.content ??
      item?.["content"] ??
      "";

    const rawContent = stripCdata(extractText(encodedNode));
    let contentMd = rawContent ? turndown.turndown(rawContent).trim() : "";

    // Fallback: fetch source URL page and extract article body if RSS has no full content
    if (!contentMd) {
      contentMd = await fetchFallbackMarkdown(link, turndown);
    }

    // Slug handling
    let slug = extractSlugFromLink(link);
    if (!slug && title) slug = normalizeSlug(title);
    if (!slug) continue;

    // De-dupe
    let finalSlug = slug;
    let i = 2;
    while (seen.has(finalSlug)) {
      finalSlug = `${slug}-${i++}`;
    }
    seen.add(finalSlug);

    const frontmatter = [
      "---",
      `title: "${(title || finalSlug).replace(/"/g, '\\"')}"`,
      `description: "${(description || "").replace(/"/g, '\\"')}"`,
      `date: "${isoDate || ""}"`,
      `slug: "${finalSlug}"`,
      `sourceUrl: "${(link || "").replace(/"/g, '\\"')}"`,
      "---",
      "",
    ].join("\n");

    const body =
      contentMd || stripHtmlTags(rawDesc) || "_(No content found in RSS item.)_";

    const out = `${frontmatter}${body}\n`;
    const outPath = path.join(OUT_DIR, safeFilename(finalSlug));
    fs.writeFileSync(outPath, out, "utf-8");

    results.push({ slug: finalSlug, file: path.relative(process.cwd(), outPath) });
  }

  console.log(
    `✅ Converted ${results.length} posts to Markdown in: ${path.relative(process.cwd(), OUT_DIR)}`
  );
  console.log(`Sample:`);
  for (const r of results.slice(0, 5)) console.log(`- ${r.slug} -> ${r.file}`);
}

main().catch((err) => {
  console.error("ERROR:", err?.message || err);
  process.exit(1);
});
