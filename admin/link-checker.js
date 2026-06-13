import fs from "node:fs";
import path from "node:path";

let reportCache = null;
let cacheKey = null;
const GENERIC_BASENAMES = new Set(["index", "home", "default"]);

function walkSync(dir) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkSync(full));
    else files.push(full);
  }
  return files;
}

function readSiteUrl(sourceDir) {
  const candidates = [
    path.join(sourceDir, "variables.yml"),
    path.join(sourceDir, "variables.yaml"),
  ];

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, "utf8");
    for (const rawLine of source.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^site-url:\s*(.*)$/);
      if (!match) continue;
      let value = match[1].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      return value;
    }
  }

  return "";
}

function isPageSource(relPath) {
  const ext = path.extname(relPath).toLowerCase();
  const base = path.basename(relPath, ext).toLowerCase();
  const topDir = relPath.split("/")[0];
  if (topDir === "components" || topDir === "templates") return false;
  if (ext !== ".md" && ext !== ".markdown") return false;
  if (base === "variables" || base.startsWith("variables.")) return false;
  return true;
}

function toHtmlOutputPath(relPath) {
  return relPath.replace(/\.(md|markdown)$/i, ".html");
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeTargetPath(rawPath) {
  return safeDecode(rawPath.split("#")[0].split("?")[0]).replace(/^\/+/, "");
}

function normalizeFilename(value) {
  return safeDecode(String(value || ""))
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pathKeywordSet(rawPath) {
  const cleaned = normalizeTargetPath(rawPath).replace(/\.[A-Za-z0-9]+$/, "");
  const segments = cleaned
    .split("/")
    .flatMap(segment => normalizeFilename(segment).split(" "))
    .filter(Boolean);
  return new Set(segments);
}

function buildValidTargets(sourceDir, outputDir) {
  const targets = new Map();

  for (const file of walkSync(sourceDir)) {
    const rel = path.relative(sourceDir, file).replace(/\\/g, "/");
    if (!isPageSource(rel)) continue;
    const target = toHtmlOutputPath(rel);
    targets.set(target.toLowerCase(), target);
  }

  for (const file of walkSync(outputDir)) {
    const rel = path.relative(outputDir, file).replace(/\\/g, "/");
    const key = rel.toLowerCase();
    if (!targets.has(key)) {
      targets.set(key, rel);
    }
  }

  return new Set(targets.values());
}

function candidateTargetPaths(rawPath, sourceHtmlPath) {
  const target = normalizeTargetPath(rawPath);
  const sourceDir = path.posix.dirname(sourceHtmlPath);
  const resolved = rawPath.startsWith("/")
    ? target
    : path.posix.normalize(path.posix.join(sourceDir, target));

  const variants = new Set([resolved]);
  if (resolved.endsWith("/")) variants.add(`${resolved}index.html`);
  if (!/\.[A-Za-z0-9]+$/.test(resolved)) {
    variants.add(`${resolved}.html`);
    variants.add(path.posix.join(resolved, "index.html"));
  }

  return [...variants];
}

function findResolvedTarget(href, sourceHtmlPath, validTargets) {
  for (const candidate of candidateTargetPaths(href, sourceHtmlPath)) {
    if (validTargets.has(candidate)) return candidate;
  }
  return null;
}

function classifyHref(href, siteUrl) {
  if (!href) return { type: "empty" };
  if (/^#/i.test(href)) return { type: "anchor" };
  if (/^mailto:/i.test(href)) return { type: "mailto" };
  if (/^tel:/i.test(href)) return { type: "tel" };
  if (/^\/\//.test(href)) return { type: "external" };

  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
    try {
      const linkUrl = new URL(href);
      const site = siteUrl ? new URL(siteUrl) : null;
      if (site && linkUrl.origin === site.origin) {
        return { type: "internal-absolute", path: linkUrl.pathname + linkUrl.search + linkUrl.hash };
      }
      return { type: "external" };
    } catch {
      return { type: "external" };
    }
  }

  if (href.startsWith("/")) return { type: "root-relative", path: href };
  return { type: "relative", path: href };
}

function encodeHrefPath(pathname) {
  return encodeURI(pathname).replace(/#/g, "%23");
}

function toRelativeHref(sourceRelPath, targetRelPath) {
  const fromDir = path.posix.dirname(sourceRelPath);
  let relative = path.posix.relative(fromDir, targetRelPath);
  if (!relative) relative = path.posix.basename(targetRelPath);
  return encodeHrefPath(relative);
}

function rankCandidate(sourceHtmlPath, brokenHref, targetPath) {
  const sourceDir = path.posix.dirname(sourceHtmlPath);
  const brokenPath = normalizeTargetPath(brokenHref);
  const brokenBase = normalizeFilename(path.posix.basename(brokenPath));
  const targetBase = normalizeFilename(path.posix.basename(targetPath));
  const brokenDir = path.posix.dirname(brokenPath).toLowerCase();
  const targetDir = path.posix.dirname(targetPath).toLowerCase();
  const brokenTokens = pathKeywordSet(brokenHref);
  const targetTokens = pathKeywordSet(targetPath);
  let score = 0;
  if (brokenBase && brokenBase === targetBase) score += 100;
  if (brokenDir && brokenDir === targetDir) score += 40;
  if (targetPath.toLowerCase().includes(brokenDir) && brokenDir !== ".") score += 10;
  for (const token of brokenTokens) {
    if (targetTokens.has(token)) score += 8;
  }
  const sourceDistance = toRelativeHref(sourceHtmlPath, targetPath).split("/").length;
  score -= sourceDistance;
  return score;
}

function suggestCandidates(href, sourceHtmlPath, validTargets) {
  const brokenPath = normalizeTargetPath(href);
  const brokenBase = normalizeFilename(path.posix.basename(brokenPath));
  if (!brokenBase) return [];
  const brokenBaseStem = brokenBase.replace(/\.[A-Za-z0-9]+$/, "");
  const brokenTokens = pathKeywordSet(href);

  const matches = [];
  for (const targetPath of validTargets) {
    if (normalizeFilename(path.posix.basename(targetPath)) !== brokenBase) continue;
    const targetTokens = pathKeywordSet(targetPath);
    const overlap = [...brokenTokens].filter(
      token => token !== brokenBaseStem && targetTokens.has(token),
    ).length;
    if (GENERIC_BASENAMES.has(brokenBaseStem) && overlap === 0) continue;
    matches.push({
      sitePath: `/${targetPath}`,
      replacementHref: toRelativeHref(sourceHtmlPath, targetPath),
      score: rankCandidate(sourceHtmlPath, href, targetPath),
    });
  }

  matches.sort((a, b) => b.score - a.score || a.sitePath.localeCompare(b.sitePath));
  return matches.slice(0, 100).map(({ sitePath, replacementHref }) => ({ sitePath, replacementHref }));
}

function extractHrefMatches(source) {
  const matches = [];
  let occurrence = 0;

  const markdownPattern = /(^|[^!])\[(?<label>[^\]]+)\]\((?<url>[^)\s]+)(?<title>\s+"[^"]*")?\)/gm;
  let match;
  while ((match = markdownPattern.exec(source))) {
    const url = match.groups?.url || "";
    const urlOffset = match[0].indexOf(url);
    const urlStart = match.index + urlOffset;
    const urlEnd = urlStart + url.length;
    matches.push({
      id: `markdown:${occurrence++}`,
      kind: "markdown",
      href: url,
      line: lineNumber(source, match.index),
      start: urlStart,
      end: urlEnd,
    });
  }

  const htmlPattern = /<a\b[^>]*href=(["'])(.*?)\1[^>]*>/gi;
  while ((match = htmlPattern.exec(source))) {
    const url = match[2];
    const urlOffset = match[0].indexOf(url);
    const urlStart = match.index + urlOffset;
    const urlEnd = urlStart + url.length;
    matches.push({
      id: `html:${occurrence++}`,
      kind: "html",
      href: url,
      line: lineNumber(source, match.index),
      start: urlStart,
      end: urlEnd,
    });
  }

  return matches;
}

function scanSourceFile(sourceDir, outputDir, siteUrl, validTargets, relPath) {
  const absPath = path.join(sourceDir, relPath);
  const source = fs.readFileSync(absPath, "utf8");
  const outputRel = toHtmlOutputPath(relPath);
  const brokenLinks = [];

  for (const match of extractHrefMatches(source)) {
    const classification = classifyHref(match.href, siteUrl);
    if (classification.type === "external" || classification.type === "anchor" || classification.type === "mailto" || classification.type === "tel" || classification.type === "empty") {
      continue;
    }

    const targetHref = classification.path || match.href;
    const resolved = findResolvedTarget(targetHref, outputRel, validTargets);
    if (resolved) continue;

    brokenLinks.push({
      id: match.id,
      source: relPath,
      kind: match.kind,
      line: match.line,
      href: match.href,
      candidates: suggestCandidates(targetHref, outputRel, validTargets),
    });
  }

  return {
    source: relPath,
    outputPath: outputRel,
    brokenCount: brokenLinks.length,
    brokenLinks,
  };
}

function buildReport(sourceDir, outputDir) {
  const siteUrl = readSiteUrl(sourceDir);
  const validTargets = buildValidTargets(sourceDir, outputDir);
  const files = walkSync(sourceDir)
    .map(file => path.relative(sourceDir, file).replace(/\\/g, "/"))
    .filter(isPageSource)
    .sort((a, b) => a.localeCompare(b));

  const pages = files.map(relPath => scanSourceFile(sourceDir, outputDir, siteUrl, validTargets, relPath));
  return {
    generatedAt: new Date().toISOString(),
    siteUrl,
    pages,
  };
}

export function invalidateLinkReportCache() {
  reportCache = null;
  cacheKey = null;
}

export function getLinkReport(sourceDir, outputDir, options = {}) {
  const key = `${sourceDir}::${outputDir}`;
  if (!options.force && reportCache && cacheKey === key) return reportCache;
  const report = buildReport(sourceDir, outputDir);
  reportCache = report;
  cacheKey = key;
  return report;
}

export function applyLinkFix(sourceDir, outputDir, payload) {
  const { source, findingId, replacementHref, originalHref } = payload || {};
  if (!source || !findingId || !replacementHref) {
    throw new Error("Missing required link-fix payload.");
  }

  const relPath = String(source).replace(/\\/g, "/");
  const absPath = path.join(sourceDir, relPath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Source file not found: ${relPath}`);
  }

  const fileSource = fs.readFileSync(absPath, "utf8");
  const matches = extractHrefMatches(fileSource);
  const finding = matches.find(match => match.id === findingId);
  if (!finding) {
    throw new Error("Broken link entry is out of date. Reload the link report and try again.");
  }
  if (originalHref && finding.href !== originalHref) {
    throw new Error("Broken link entry changed before update. Reload the link report and try again.");
  }

  const updated = fileSource.slice(0, finding.start) + replacementHref + fileSource.slice(finding.end);
  fs.writeFileSync(absPath, updated, "utf8");
  invalidateLinkReportCache();

  const report = getLinkReport(sourceDir, outputDir, { force: true });
  const page = report.pages.find(entry => entry.source === relPath) || {
    source: relPath,
    brokenCount: 0,
    brokenLinks: [],
  };

  return {
    ok: true,
    page,
  };
}
