import fs from "node:fs";
import path from "node:path";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";
import * as cheerio from "cheerio";

// Inputs/Outputs
const FEED_XML = path.resolve(process.cwd(), "blog-feed.xml");
const OUT_DIR = path.resolve(process.cwd(), "content", "post");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function stripCdata(s) {
  return (s || "").replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim();
}

function toISODate(pubDate) {
  const d = new Date(pubDate);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = String(d.getFullYear());
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function extractSlugFromLink(link) {
  try {
    const u = new URL(link);
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.indexOf("post");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    return parts[parts.length - 1] || "";
  } catch {
    return "";
  }
}

// --- Wix post extraction heuristics ---
// We try a few likely containers and fall back to grabbing the main <article>.
function extractPostHtml($) {
  // Try common candidates (Wix can vary by template/version)
  const selectors = [
    "article",
    '[data-hook="post-content"]',
    '[data-hook="post-body"]',
    '[data-testid="post-content"]',
    'div[data-testid="rich-content"]',
    ".blog-post-content",
    ".post-content",
    ".post-body",
  ];

  for (const sel of selectors) {
    const el = $(sel).first();
    if (el && el.length) {
      const html = el.html()?.trim() || "";
      const textLen = el.text().replace(/\s+/g, " ").trim().length;
      if (html && textLen > 200) return html;
    }
  }

  // Fallback: choose the largest text block among main-ish containers
  const candidates = ["main", "#SITE_CONTAINER", "body"];
  let bestHtml = "";
  let bestLen = 0;

  for (const sel of candidates) {
    const el = $(sel).first();
    if (!el || !el.length) continue;
    const textLen = el.text().replace(/\s+/g, " ").trim().length;
    if (textLen > bestLen) {
      bestLen = textLen;
      bestHtml = el.html()?.trim() || "";
    }
  }

  return bestHtml;
}

function buildFrontmatter({ title, description, date, slug, sourceUrl }) {
  const esc = (s) => (s || "").replace(/"/g, '\\"');
  return [
    "---",
    `title: "${esc(title || slug)}"`,
    `description: "${esc(description || "")}"`,
    `date: "${esc(date || "")}"`,
    `slug: "${esc(slug)}"`,
    `sourceUrl: "${esc(sourceUrl || "")}"`,
    "---",
    "",
  ].join("\n");
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; AI-Coaching-Solutions-Migration/1.0; +https://www.aicoachingsolutions.net)",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!res.ok) {
    throw new Error(`Fetch failed (${res.status}) ${url}`);
  }
  return await res.text();
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// --- Main ---
if (!fs.existsSync(FEED_XML)) {
  console.error(`ERROR: blog-feed.xml not found at project root.`);
  process.exit(1);
}

ensureDir(OUT_DIR);

const xml = fs.readFileSync(FEED_XML, "utf-8");
const parser = new XMLParser({
  ignoreAttributes: false,
  removeNSPrefix: false,
  trimValues: true,
});
const parsed = parser.parse(xml);
const channel = parsed?.rss?.channel;
let items = channel?.item ?? [];
if (!Array.isArray(items)) items = [items];

// Turndown: HTML -> Markdown
const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

turndown.addRule("removeScriptStyle", {
  filter: ["script", "style", "noscript"],
  replacement: () => "",
});

let ok = 0;
let fail = 0;

for (let i = 0; i < items.length; i++) {
  const item = items[i];

  const title = (item?.title || "").toString().trim();
  const sourceUrl = (item?.link || "").toString().trim();
  const slug = extractSlugFromLink(sourceUrl);
  const date = toISODate((item?.pubDate || "").toString().trim());

  const rawDesc = stripCdata((item?.description || "").toString());
  const description = rawDesc
    ? turndown.turndown(rawDesc).replace(/\s+/g, " ").trim().slice(0, 220)
    : "";

  if (!sourceUrl || !slug) {
    console.log(`- Skipping item missing url/slug: ${title}`);
    continue;
  }

  const outPath = path.join(OUT_DIR, `${slug}.md`);

  try {
    console.log(`[${i + 1}/${items.length}] Fetching ${sourceUrl}`);
    const html = await fetchHtml(sourceUrl);
    const $ = cheerio.load(html);

    // Extract content
    const postHtml = extractPostHtml($);
    const postTextLen = cheerio
      .load(`<div>${postHtml}</div>`)("div")
      .text()
      .replace(/\s+/g, " ")
      .trim().length;

    if (!postHtml || postTextLen < 200) {
      throw new Error(`Could not locate post body (too short).`);
    }

    const markdownBody = turndown.turndown(postHtml).trim();

    const fm = buildFrontmatter({ title, description, date, slug, sourceUrl });
    fs.writeFileSync(outPath, `${fm}${markdownBody}\n`, "utf-8");

    ok++;
  } catch (e) {
    fail++;
    console.log(`  ❌ Failed: ${slug} — ${e?.message || e}`);
  }

  // Polite throttle so Wix doesn't rate-limit you
  await sleep(400);
}

console.log(`\n✅ Done. Success: ${ok}, Failed: ${fail}`);
console.log(`Output dir: ${path.relative(process.cwd(), OUT_DIR)}`);
console.log(`If any failed, paste ONE failed URL here and I’ll tune the extractor selector.`);
