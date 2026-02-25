/**
 * Atom 1.0 (RFC 4287) feed builder.
 * Escapes text for XML and outputs a single feed document.
 */

export interface AtomFeedMeta {
  title: string;
  id: string;
  selfUrl: string;
  updated: string; // RFC 3339
  author?: { name: string; uri?: string; email?: string };
}

export interface AtomEntryLink {
  href: string;
  hreflang?: string;
}

export interface AtomEntry {
  id: string;
  title: string;
  updated: string; // RFC 3339
  summary: string;
  links: AtomEntryLink[];
  published?: string; // RFC 3339, optional
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

const ATOM_NS = "http://www.w3.org/2005/Atom";

export function buildAtomFeed(feedMeta: AtomFeedMeta, entries: AtomEntry[]): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="utf-8"?>',
    `<feed xmlns="${ATOM_NS}">`,
    `  <title>${escapeXml(feedMeta.title)}</title>`,
    `  <id>${escapeXml(feedMeta.id)}</id>`,
    `  <updated>${escapeXml(feedMeta.updated)}</updated>`,
    `  <link rel="self" href="${escapeXml(feedMeta.selfUrl)}" />`,
  ];

  if (feedMeta.author) {
    lines.push("  <author>", `    <name>${escapeXml(feedMeta.author.name)}</name>`);
    if (feedMeta.author.uri) lines.push(`    <uri>${escapeXml(feedMeta.author.uri)}</uri>`);
    if (feedMeta.author.email) lines.push(`    <email>${escapeXml(feedMeta.author.email)}</email>`);
    lines.push("  </author>");
  }

  for (const e of entries) {
    lines.push("  <entry>");
    lines.push(`    <id>${escapeXml(e.id)}</id>`);
    lines.push(`    <title>${escapeXml(e.title)}</title>`);
    lines.push(`    <updated>${escapeXml(e.updated)}</updated>`);
    if (e.published) lines.push(`    <published>${escapeXml(e.published)}</published>`);
    lines.push(`    <summary>${escapeXml(e.summary)}</summary>`);
    for (const link of e.links) {
      const attrs = [
        `href="${escapeXml(link.href)}"`,
        "rel=\"alternate\"",
        "type=\"text/html\"",
      ];
      if (link.hreflang) attrs.push(`hreflang="${escapeXml(link.hreflang)}"`);
      lines.push(`    <link ${attrs.join(" ")} />`);
    }
    lines.push("  </entry>");
  }

  lines.push("</feed>");
  return lines.join("\n");
}
