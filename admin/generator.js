import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SETTINGS_PATH = path.join(__dirname, "settings.json");
const BUILD_STATE_PATH = path.join(__dirname, "build-state.json");

function readSettings() {
  return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf8"));
}

function resolveRoot(relativePath) {
  return path.resolve(ROOT, relativePath);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function parseVariablesYaml(source) {
  const values = {};
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z0-9_.-]+):\s*(.*)$/);
    if (!match) continue;
    let value = match[2].trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    values[match[1]] = value;
  }
  return values;
}

function loadVariables(sourceDir) {
  const values = {};
  const candidates = [
    path.join(sourceDir, "variables.yml"),
    path.join(sourceDir, "variables.yaml"),
    path.join(sourceDir, "variables.md"),
  ];
  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;
    Object.assign(values, parseVariablesYaml(readText(file)));
  }
  return values;
}

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

function registerAliases(map, entry, ...aliases) {
  for (const alias of aliases) {
    if (!alias) continue;
    map.set(String(alias), entry);
  }
}

function normalizeTemplateAliases(filePath, data) {
  const base = path.basename(filePath, ".md");
  const normalized = base.replace(/^template\./, "");
  const explicit = data["template-name"];
  return [explicit, base, normalized];
}

function normalizeComponentAliases(filePath, data) {
  const base = path.basename(filePath, ".md");
  const normalized = base.replace(/^component\./, "");
  const explicit = data["component-name"] || data["module-name"];
  return [explicit, base, normalized];
}

function guessMarkdownKind(filePath, data = {}) {
  const ext = path.extname(filePath).toLowerCase();
  const base = path.basename(filePath, ext);
  const dir = path.basename(path.dirname(filePath));
  if (
    data["variables"] === true ||
    data["variables"] === "true" ||
    ((ext === ".md" || ext === ".yml" || ext === ".yaml") &&
      (base === "variables" || base.startsWith("variables.")))
  ) {
    return "variables";
  }
  if (data["template"] === true || data["template"] === "true" || dir === "templates" || base.startsWith("template.")) {
    return "template";
  }
  if (
    data["component"] === true ||
    data["component"] === "true" ||
    data["template-module"] === true ||
    data["template-module"] === "true" ||
    dir === "components" ||
    base.startsWith("component.")
  ) {
    return "component";
  }
  return "content";
}

function findPlaceholderNames(markdownSource) {
  const names = new Set();
  const pattern = /<([A-Za-z][A-Za-z0-9_.-]*)\s*\/\s*>/g;
  let match;
  while ((match = pattern.exec(markdownSource))) {
    names.add(match[1]);
  }
  return names;
}

function findWrapperComponentNames(markdownSource, componentsByName) {
  const names = new Set();
  const pattern = /<(?!\/)([A-Za-z][A-Za-z0-9_.-]*)([^>]*)>/g;
  let match;
  while ((match = pattern.exec(markdownSource))) {
    const componentEntry = componentsByName.get(match[1]);
    if (componentEntry?.data.wrapper === true) {
      names.add(match[1]);
    }
  }
  return names;
}

function findIncludePageRefs(markdownSource, currentRel, pageEntriesByRel) {
  const refs = new Set();
  const pattern = /<include([^>]*?)\s*\/>/g;
  let match;
  while ((match = pattern.exec(markdownSource))) {
    const attrs = parseShortcodeAttrs(match[1] || "");
    const pageRef = typeof attrs.page === "string" ? attrs.page.trim() : "";
    if (!pageRef) continue;
    const target = resolveIncludedPageEntry(pageRef, currentRel, pageEntriesByRel);
    if (target) refs.add(target.rel);
  }
  return refs;
}

function normalizeIncludePageRef(pageRef) {
  return String(pageRef || "")
    .trim()
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
}

function candidateIncludeRelPaths(pageRef, currentRel) {
  const normalized = normalizeIncludePageRef(pageRef);
  if (!normalized) return [];

  const candidates = [];
  const seen = new Set();
  const push = rel => {
    const cleaned = path.posix.normalize(rel).replace(/^\.\//, "");
    if (!cleaned || seen.has(cleaned)) return;
    seen.add(cleaned);
    candidates.push(cleaned);
  };

  const currentDir = currentRel ? path.posix.dirname(currentRel) : "";
  if (currentDir) {
    push(path.posix.join(currentDir, normalized));
    if (!path.posix.extname(normalized)) {
      push(path.posix.join(currentDir, `${normalized}.md`));
      push(path.posix.join(currentDir, `${normalized}.markdown`));
    }
  }

  push(normalized);
  if (!path.posix.extname(normalized)) {
    push(`${normalized}.md`);
    push(`${normalized}.markdown`);
  }

  return candidates;
}

function resolveIncludedPageEntry(pageRef, currentRel, pageEntriesByRel) {
  for (const rel of candidateIncludeRelPaths(pageRef, currentRel)) {
    const entry = pageEntriesByRel.get(rel);
    if (entry) return entry;
  }
  return null;
}

function wrapComponentHtml(html, data = {}) {
  const attrs = [];
  if (data.id) attrs.push(`id="${escapeHtml(String(data.id))}"`);
  if (data.class) attrs.push(`class="${escapeHtml(String(data.class))}"`);
  if (!attrs.length) return html;
  return `<div ${attrs.join(" ")}>${html}</div>`;
}

function parseShortcodeAttrs(attrStr) {
  const attrs = {};
  const pattern = /([A-Za-z][A-Za-z0-9_-]*)(?:=(?:"([^"]*)"|'([^']*)'|([^\s/>]*)))?/g;
  let match;
  while ((match = pattern.exec(attrStr)) !== null) {
    attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? true;
  }
  return attrs;
}

function renderPageList(folder, contentEntries, currentRel) {
  const target = folder.replace(/^\/|\/$/g, "");
  const pages = contentEntries
    .filter(e => {
      if (e.data["show-in-nav"] !== true && e.data["show-in-nav"] !== "true") return false;
      if (isUnlistedContent(e.data)) return false;
      const dir = path.dirname(e.rel).replace(/^\.([/\\]|$)/, "").replace(/\\/g, "/");
      return dir === target;
    })
    .sort((a, b) => {
      const ta = a.data.title || path.basename(a.rel, ".md");
      const tb = b.data.title || path.basename(b.rel, ".md");
      return ta.localeCompare(tb);
    });

  if (!pages.length) return "";

  const items = pages.map(e => {
    const url = "/" + e.rel.replace(/\.md$/i, ".html").replace(/\\/g, "/");
    const title = escapeHtml(e.data.title || path.basename(e.rel, ".md"));
    const current = e.rel === currentRel ? ' aria-current="page"' : "";
    return `<li><a href="${escapeHtml(url)}"${current}>${title}</a></li>`;
  }).join("");

  return `<ul>${items}</ul>`;
}

function injectContentSlot(html, contentHtml, label = "component") {
  return injectTemplate(html, { content: contentHtml }, [], label);
}

function expandRawComponentsInHtml(html, componentsByName, variables = {}, context = {}) {
  return html.replace(/<([A-Za-z][A-Za-z0-9_.-]*)([^>]*?)\s*\/>/g, (match, name, attrStr) => {
    const componentEntry = componentsByName.get(name);
    if (componentEntry && componentEntry.data.raw === true) {
      const attrs = parseShortcodeAttrs(attrStr);
      return renderComponentHtml(
        componentEntry,
        componentsByName,
        { ...variables, ...attrs },
        new Set([name]),
        {
          currentRel: context.currentRel || componentEntry.rel,
          pageEntriesByRel: context.pageEntriesByRel,
          warnings: context.warnings,
        }
      );
    }
    return match;
  });
}

function expandWrapperComponentsInHtml(html, componentsByName, variables = {}, context = {}) {
  const wrapperNames = [...componentsByName.entries()]
    .filter(([, entry]) => entry.data.wrapper === true)
    .map(([name]) => name);

  if (!wrapperNames.length) return html;

  let output = html;
  let changed = true;

  while (changed) {
    changed = false;

    for (const name of wrapperNames) {
      const pattern = new RegExp(
        `<${escapeRegExp(name)}([^>]*)>([\\s\\S]*?)</${escapeRegExp(name)}>`,
        "g"
      );
      output = output.replace(pattern, (match, attrStr, innerHtml) => {
        const componentEntry = componentsByName.get(name);
        if (!componentEntry || componentEntry.data.wrapper !== true) return match;
        changed = true;
        const attrs = parseShortcodeAttrs(attrStr);
        return renderComponentHtml(
          componentEntry,
          componentsByName,
          { ...variables, ...attrs },
          new Set([name]),
          context,
          innerHtml
        );
      });
    }
  }

  return output;
}

function renderBodyHtml(source, componentsByName, variables = {}, context = {}, componentStack = new Set(), includeStack = new Set(), raw = false) {
  const includeExpanded = expandIncludeShortcodes(source, componentsByName, variables, context, componentStack, includeStack);
  const shortcodeExpanded = expandShortcodes(includeExpanded, componentsByName, variables, componentStack, context);
  if (raw) {
    return shortcodeExpanded
      .replace(/\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/g, (match, key) => (
        Object.hasOwn(variables, key) ? String(variables[key]) : match
      ))
      .trim();
  }
  return expandRawComponentsInHtml(
    renderMarkdown(resolveReferenceLinks(shortcodeExpanded)).replace(/\n+/g, ""),
    componentsByName,
    variables,
    context
  );
}

// Expands built-in shortcodes (e.g. <page-list />) that require per-page context.
// Run this as a final pass on the fully assembled HTML so shortcodes that survived
// inside pre-rendered component HTML are still resolved correctly.
function expandBuiltinShortcodes(html, context) {
  return html.replace(/<page-list([^>]*?)\s*\/>/g, (match, attrStr) => {
    if (!context.contentEntries) return match;
    const attrs = parseShortcodeAttrs(attrStr);
    const currentDir = context.currentRel
      ? path.dirname(context.currentRel).replace(/^\.([/\\]|$)/, "").replace(/\\/g, "/")
      : "";
    const folder = typeof attrs.folder === "string" ? attrs.folder : currentDir;
    return renderPageList(folder, context.contentEntries, context.currentRel);
  });
}

function expandIncludeShortcodes(source, componentsByName, variables = {}, context = {}, componentStack = new Set(), includeStack = new Set()) {
  return source.replace(/<include([^>]*?)\s*\/>/g, (match, attrStr) => {
    const attrs = parseShortcodeAttrs(attrStr);
    const pageRef = typeof attrs.page === "string" ? attrs.page.trim() : "";
    if (!pageRef) return match;

    const pageEntriesByRel = context.pageEntriesByRel;
    if (!pageEntriesByRel) return match;

    const targetEntry = resolveIncludedPageEntry(pageRef, context.currentRel, pageEntriesByRel);
    if (!targetEntry) {
      if (Array.isArray(context.warnings)) {
        const label = context.currentRel || "unknown source";
        context.warnings.push(`Include "${pageRef}" in "${label}" could not be resolved to a page.`);
      }
      return "";
    }

    if (includeStack.has(targetEntry.rel)) {
      if (Array.isArray(context.warnings)) {
        context.warnings.push(
          `Circular include detected for "${targetEntry.rel}" while rendering "${context.currentRel || "unknown source"}".`
        );
      }
      return "";
    }

    const nextStack = new Set(includeStack);
    nextStack.add(targetEntry.rel);
    return renderBodyHtml(
      targetEntry.body,
      componentsByName,
      variables,
      { ...context, currentRel: targetEntry.rel },
      componentStack,
      nextStack,
      false
    );
  });
}

function expandShortcodes(source, componentsByName, variables = {}, stack = new Set(), context = {}) {
  return source.replace(/<([A-Za-z][A-Za-z0-9_.-]*)([^>]*?)\s*\/>/g, (match, name, attrStr) => {
    // Built-in: page-list — renders an <ul> of pages in a folder
    if (name === "page-list") {
      if (!context.contentEntries) return match;
      const attrs = parseShortcodeAttrs(attrStr);
      const currentDir = context.currentRel
        ? path.dirname(context.currentRel).replace(/^\.([/\\]|$)/, "").replace(/\\/g, "/")
        : "";
      const folder = typeof attrs.folder === "string" ? attrs.folder : currentDir;
      return renderPageList(folder, context.contentEntries, context.currentRel);
    }

    const componentEntry = componentsByName.get(name);
    if (componentEntry) {
      const attrs = parseShortcodeAttrs(attrStr);
      const scopedVariables = { ...variables, ...attrs };
      // Raw components are skipped here so they survive renderMarkdown intact.
      // They are expanded in a dedicated post-markdown pass in rebuildPageEntry.
      if (componentEntry.data.raw === true) return match;
      if (stack.has(name)) return "";
      const nextStack = new Set(stack);
      nextStack.add(name);
      return renderComponentHtml(componentEntry, componentsByName, scopedVariables, nextStack, context);
    }
    if (Object.hasOwn(variables, name)) {
      return String(variables[name]);
    }
    return match;
  });
}

function renderComponentHtml(componentEntry, componentsByName, variables = {}, stack = new Set(), context = {}, contentHtml = null) {
  let renderedHtml = renderBodyHtml(
    componentEntry.body,
    componentsByName,
    variables,
    {
      currentRel: context.currentRel || componentEntry.rel,
      pageEntriesByRel: context.pageEntriesByRel,
      warnings: context.warnings,
    },
    stack,
    context.includeStack || new Set(),
    componentEntry.data.raw === true
  );
  if (componentEntry.data.wrapper === true && contentHtml != null) {
    renderedHtml = injectContentSlot(
      renderedHtml,
      contentHtml,
      `Wrapper component ${componentEntry.rel || componentEntry.data?.["component-name"] || "unknown"}`
    );
  }
  return wrapComponentHtml(renderedHtml, componentEntry.data);
}

function componentCssCandidates(ref) {
  // For 'card.links', returns ['component.card.links.css', 'component.card.css']
  const parts = ref.split(".");
  const candidates = [];
  for (let len = parts.length; len >= 1; len--) {
    candidates.push(`component.${parts.slice(0, len).join(".")}.css`);
  }
  return [...new Set(candidates)];
}

function collectTransitiveComponentRefs(seedAliases, componentsByRel) {
  const refs = new Set(seedAliases);
  let changed = true;

  while (changed) {
    changed = false;
    for (const componentRecord of componentsByRel.values()) {
      const dependsOnTracked = [...componentRecord.refs].some(ref => refs.has(ref));
      if (!dependsOnTracked) continue;
      for (const alias of componentRecord.aliases) {
        if (refs.has(alias)) continue;
        refs.add(alias);
        changed = true;
      }
    }
  }

  return refs;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function removeDirContents(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    fs.rmSync(full, { recursive: true, force: true });
  }
}

function parseInlineValue(raw) {
  const value = raw.trim();
  if (!value) return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  if (/^-?\d+(\.\d+)?$/.test(value)) return Number(value);
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  if (value.startsWith("[") && value.endsWith("]")) {
    const inner = value.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(",").map(item => parseInlineValue(item));
  }
  return value;
}

export function parseFrontmatter(source) {
  const lines = source.split(/\r?\n/);
  if (!lines.length) return { data: {}, body: source };

  let start = null;
  let end = null;

  if (lines[0].trim() === "<!---") {
    start = 1;
    end = lines.indexOf("--->");
  } else if (lines[0].trim() === "---") {
    start = 1;
    end = lines.indexOf("---", 1);
  }

  if (start === null || end === -1 || end < start) {
    return { data: {}, body: source };
  }

  const data = {};
  let currentKey = null;

  for (const line of lines.slice(start, end)) {
    if (!line.trim()) continue;
    const keyMatch = line.match(/^([A-Za-z0-9_.-]+):(?:\s*(.*))?$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      const rawValue = keyMatch[2] ?? "";
      data[currentKey] = rawValue ? parseInlineValue(rawValue) : "";
      continue;
    }

    const arrayMatch = line.match(/^\s*-\s+(.*)$/);
    if (arrayMatch && currentKey) {
      if (!Array.isArray(data[currentKey])) data[currentKey] = [];
      data[currentKey].push(parseInlineValue(arrayMatch[1]));
    }
  }

  const body = lines.slice(end + 1).join("\n").replace(/^\n+/, "");
  return { data, body };
}

function primaryCategory(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const text = String(item || "").trim();
      if (text) return text;
    }
    return "";
  }

  const raw = String(value || "").trim();
  if (!raw) return "";
  return raw.split(",").map(part => part.trim()).find(Boolean) || "";
}

function normalizeFrontmatterData(data) {
  const normalized = { ...data };
  const categories = normalized.categories;
  const category = normalized.category;

  if ((!categories || (Array.isArray(categories) && categories.length === 0)) && category) {
    normalized.categories = category;
  }

  if (!normalized.category && normalized.categories) {
    normalized.category = primaryCategory(normalized.categories);
  }

  return normalized;
}

function isPublishedContent(data) {
  if (data.unpublished === true || data.unpublished === "true") return false;
  return true;
}

function isUnlistedContent(data) {
  return data.unlisted === true || data.unlisted === "true";
}

function inlineMarkdown(text) {
  const tokens = [];
  const source = text.replace(/\r/g, "");
  let output = "";
  let index = 0;

  function flushText(chunk) {
    // Protect inline HTML tags before escaping so they pass through intact.
    // Uses null-byte placeholders which cannot appear in markdown source.
    const saved = [];
    let text = chunk.replace(/<([a-z][a-z0-9]*)\b([^>]*)>([\s\S]*?)<\/\1>/gi, (match) => {
      saved.push(match);
      return `\x00${saved.length - 1}\x00`;
    });

    let result = escapeHtml(text);

    // Restore saved inline HTML
    result = result.replace(/\x00(\d+)\x00/g, (_, i) => saved[+i]);

    // Images before links so ![alt](url) isn't partially matched as a link
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, url) => {
      return `<img src="${escapeHtml(url)}"${alt ? ` alt="${escapeHtml(alt)}"` : ""}>`;
    });
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
      return `<a href="${escapeHtml(url)}">${label}</a>`;
    });
    result = result.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);
    result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    result = result.replace(/(^|[^\*])\*([^*]+)\*(?!\*)/g, (_, prefix, body) => `${prefix}<em>${body}</em>`);
    return result;
  }

  while (index < source.length) {
    const char = source[index];
    if (char === "\n") {
      output += "\n";
      index += 1;
      continue;
    }
    output += char;
    index += 1;
  }

  return flushText(output);
}

function resolveReferenceLinks(source) {
  // Collect reference definitions: [id]: url or [id]: url "title"
  const refs = {};
  const defPattern = /^\[([^\]]+)\]:\s+(\S+)(?:[ \t]+"[^"]*")?\s*$/gm;
  let m;
  while ((m = defPattern.exec(source)) !== null) {
    refs[m[1].toLowerCase()] = m[2];
  }
  if (!Object.keys(refs).length) return source;

  // Strip definition lines
  let result = source.replace(/^\[([^\]]+)\]:\s+\S+(?:[ \t]+"[^"]*")?\s*\n?/gm, "");

  // Image references: ![alt][id] or ![][id]
  result = result.replace(/!\[([^\]]*)\]\[([^\]]*)\]/g, (match, alt, id) => {
    const url = refs[(id || alt).toLowerCase()];
    return url ? `![${alt}](${url})` : match;
  });

  // Link references: [text][id] or [text][] (implicit — use text as id)
  result = result.replace(/\[([^\]]+)\]\[([^\]]*)\]/g, (match, text, id) => {
    const url = refs[(id || text).toLowerCase()];
    return url ? `[${text}](${url})` : match;
  });

  return result;
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, "").split("\n");
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    const fenceMatch = trimmed.match(/^```(\w+)?\s*$/);
    if (fenceMatch) {
      const language = fenceMatch[1] || "";
      const codeLines = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().match(/^```\s*$/)) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      const classAttr = language ? ` class="language-${escapeHtml(language)}"` : "";
      blocks.push(`<pre><code${classAttr}>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      blocks.push(`<h${level}>${inlineMarkdown(headingMatch[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (/^([-*_])\1\1+$/.test(trimmed)) {
      blocks.push("<hr>");
      i += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines = [];
      while (i < lines.length && /^>\s?/.test(lines[i].trim())) {
        quoteLines.push(lines[i].trim().replace(/^>\s?/, ""));
        i += 1;
      }
      blocks.push(`<blockquote>${renderMarkdown(quoteLines.join("\n"))}</blockquote>`);
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*+]\s+/);
    const orderedMatch = trimmed.match(/^\d+\.\s+/);
    if (unorderedMatch || orderedMatch) {
      const items = [];
      const ordered = Boolean(orderedMatch);
      while (i < lines.length) {
        const current = lines[i].trim();
        if (ordered) {
          const match = current.match(/^\d+\.\s+(.*)$/);
          if (!match) break;
          items.push(match[1]);
        } else {
          const match = current.match(/^[-*+]\s+(.*)$/);
          if (!match) break;
          items.push(match[1]);
        }
        i += 1;
      }
      const tag = ordered ? "ol" : "ul";
      blocks.push(`<${tag}>${items.map(item => `<li>${inlineMarkdown(item)}</li>`).join("")}</${tag}>`);
      continue;
    }

    // Void elements have no closing tag — pass through as-is
    if (/^<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s[^>]*)?>$/i.test(trimmed)) {
      blocks.push(trimmed);
      i += 1;
      continue;
    }

    // Self-closing custom tags (e.g. <page-list />, <my-shortcode attr="val" />) — pass through
    // so they survive rendering and can be expanded in a later post-processing pass.
    if (/^<[A-Za-z][^>]*\/>$/.test(trimmed)) {
      blocks.push(trimmed);
      i += 1;
      continue;
    }

    const wrapperMatch = trimmed.match(/^<([A-Za-z][A-Za-z0-9_.-]*)([^>]*)>$/);
    if (wrapperMatch && !trimmed.endsWith("/>")) {
      const tag = wrapperMatch[1];
      const attrs = wrapperMatch[2] || "";
      const closingTag = `</${tag}>`;
      const innerLines = [];
      i += 1;
      while (i < lines.length && lines[i].trim() !== closingTag) {
        innerLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      const renderedInner = renderMarkdown(innerLines.join("\n"));
      const innerHtml = /^<p>[\s\S]*<\/p>$/.test(renderedInner)
        ? renderedInner.replace(/^<p>|<\/p>$/g, "")
        : renderedInner;
      blocks.push(`<${tag}${attrs}>${innerHtml}</${tag}>`);
      continue;
    }

    if (trimmed.startsWith("<") && trimmed.includes("</") && trimmed.endsWith(">")) {
      blocks.push(line);
      i += 1;
      continue;
    }

    const paragraphLines = [line.trim()];
    i += 1;
    while (i < lines.length) {
      const next = lines[i];
      const nextTrimmed = next.trim();
      if (!nextTrimmed) break;
      if (
        nextTrimmed.match(/^(#{1,6})\s+/) ||
        nextTrimmed.match(/^([-*_])\1\1+$/) ||
        nextTrimmed.startsWith(">") ||
        nextTrimmed.match(/^[-*+]\s+/) ||
        nextTrimmed.match(/^\d+\.\s+/) ||
        nextTrimmed.startsWith("<") ||
        nextTrimmed.match(/^```/)
      ) {
        break;
      }
      paragraphLines.push(nextTrimmed);
      i += 1;
    }
    blocks.push(`<p>${inlineMarkdown(paragraphLines.join(" "))}</p>`);
  }

  return blocks.join("\n");
}

function injectTemplate(templateSource, replacements, warnings = [], templateLabel = "template") {
  let html = templateSource;
  const replaceSlot = (name, value) => {
    const normalized = String(value);
    html = html.replace(
      /<([A-Za-z][A-Za-z0-9_.-]*)\s*\/\s*>/g,
      (match, tagName) => (tagName === name ? normalized : match)
    );
    html = html.replace(
      /<([A-Za-z][A-Za-z0-9_.-]*)\s*>\s*<\/\1\s*>/g,
      (match, tagName) => (tagName === name ? normalized : match)
    );
  };

  for (const [name, value] of Object.entries(replacements)) {
    replaceSlot(name, value);
  }

  // `content` is the dedicated page slot. Support a bare opening tag and legacy `<body />`.
  if (Object.hasOwn(replacements, "content")) {
    if (/<content\s*>/i.test(html)) {
      warnings.push(
        `${templateLabel} uses bare <content>; prefer <content /> for the page content slot.`
      );
    }
    html = html.replace(/<content\s*>/g, String(replacements.content));
    html = html.replace(/<body\s*\/\s*>/g, String(replacements.content));
  }

  const trailingMatch = html.match(/<\/html>([\s\S]*)$/i);
  if (trailingMatch && trailingMatch[1].trim()) {
    const trailing = trailingMatch[1];
    const bodyPattern = /<body([^>]*)>([\s\S]*?)<\/body>/i;
    if (bodyPattern.test(html)) {
      html = html.replace(/<\/html>[\s\S]*$/i, "</html>");
      html = html.replace(bodyPattern, (_, attrs, bodyInner) => {
        const merged = `${bodyInner.trim()}\n${trailing.trim()}`.trim();
        return `<body${attrs}>${merged ? `\n${merged}\n` : ""}</body>`;
      });
    }
  }

  return html;
}

function replaceVariablesInHtml(html, variables = {}) {
  let output = html;
  for (const [name, value] of Object.entries(variables)) {
    const normalized = String(value);
    const rawPattern = new RegExp(`<${escapeRegExp(name)}\\\\s*\\\\/\\\\s*>`, "g");
    const escapedPattern = new RegExp(`&lt;${escapeRegExp(name)}\\\\s*\\\\/\\\\s*&gt;`, "g");
    output = output.replace(rawPattern, normalized);
    output = output.replace(escapedPattern, normalized);
  }
  return output;
}

function withLiveReload(html) {
  const liveReloadScript = `
<!-- LIVE_RELOAD -->
<script>
(() => {
  const previewPort = Number(window.location.port || "3003");
  const adminPort = previewPort > 0 ? previewPort - 1 : previewPort;
  const reloadUrl = \`\${window.location.protocol}//\${window.location.hostname}:\${adminPort}/__reload\`;
  const source = new EventSource(reloadUrl);
  source.onmessage = (event) => {
    if (event.data === "reload") {
      window.location.reload();
    }
  };
  source.onerror = () => {
    // EventSource handles reconnection on its own. Avoid reload loops.
  };
})();
</script>
<!-- /LIVE_RELOAD -->`.trim();

  html = html.replace(/\s*<!-- LIVE_RELOAD -->([\s\S]*?)<!-- \/LIVE_RELOAD -->\s*/i, "\n");
  html = html.replace(/\s*<script>\s*\(\(\)\s*=>\s*\{[\s\S]*?EventSource\(reloadUrl\)[\s\S]*?<\/script>\s*/i, "\n");

  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${liveReloadScript}\n</body>`);
  }

  return `${html}\n${liveReloadScript}\n`;
}

export function buildStylesheet(outputDir) {
  const cssDir = path.join(outputDir, "css");
  if (!fs.existsSync(cssDir)) return;

  const fixed = ["baseline.css", "theme.css"];
  const rest = fs.readdirSync(cssDir)
    .filter(f => !fixed.includes(f) && f !== "styles.css" && f.endsWith(".css"))
    .sort();

  const sections = [];
  for (const filename of [...fixed, ...rest]) {
    const filePath = path.join(cssDir, filename);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, "utf8").trim();
    sections.push(`/* ── ${filename} ── */\n\n${content}`);
  }

  fs.writeFileSync(
    path.join(cssDir, "styles.css"),
    sections.join("\n\n\n") + "\n",
    "utf8"
  );
}

export function buildBlogFeed(outputDir, posts, siteUrl = "", siteTitle = "Blog") {
  const blogPosts = posts
    .filter(p => p.url.startsWith("/blog/") && p.title && !p.unlisted)
    .sort((a, b) => {
      const da = a.date ? new Date(a.date) : new Date(0);
      const db = b.date ? new Date(b.date) : new Date(0);
      return db - da;
    })
    .slice(0, 50);

  if (!blogPosts.length) return null;

  const x = str => String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const rssDate = str => {
    try { return new Date(str).toUTCString(); } catch { return ""; }
  };

  const items = blogPosts.map(p => [
    "  <item>",
    `    <title>${x(p.title)}</title>`,
    `    <link>${siteUrl}${p.url}</link>`,
    `    <guid isPermaLink="true">${siteUrl}${p.url}</guid>`,
    p.description ? `    <description>${x(p.description)}</description>` : "",
    p.date        ? `    <pubDate>${rssDate(p.date)}</pubDate>` : "",
    p.categories  ? `    <category>${x(p.categories)}</category>` : "",
    "  </item>",
  ].filter(Boolean).join("\n")).join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${x(siteTitle)}</title>`,
    `    <link>${siteUrl}/blog/</link>`,
    `    <description>Writing by ${x(siteTitle)}</description>`,
    "    <language>en-us</language>",
    `    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  const feedDir = path.join(outputDir, "blog");
  fs.mkdirSync(feedDir, { recursive: true });
  const feedPath = path.join(feedDir, "feed.xml");
  fs.writeFileSync(feedPath, xml, "utf8");
  return feedPath;
}

export function buildSitemap(outputDir, pages, siteUrl = "") {
  const baseUrl = String(siteUrl || "").replace(/\/+$/, "");
  if (!baseUrl) return null;

  const sitemapPages = pages
    .filter(page => page.url && !page.unlisted)
    .sort((a, b) => a.url.localeCompare(b.url));

  if (!sitemapPages.length) return null;

  const x = str => String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

  const urls = sitemapPages.map(page => [
    "  <url>",
    `    <loc>${x(baseUrl + page.url)}</loc>`,
    "  </url>",
  ].join("\n")).join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("\n");

  const sitemapPath = path.join(outputDir, "sitemap.xml");
  fs.writeFileSync(sitemapPath, xml, "utf8");
  return sitemapPath;
}

// CSS files from source root, components/, or templates/ all land in css/ in the output.
// CSS already inside css/ keeps its path. Other assets preserve their relative path.
//
// Future: when build.minify is true, gather all CSS and concatenate into css/styles.css.
function remapOutputPath(rel, outputDir) {
  const ext = path.extname(rel).toLowerCase();
  if (ext === ".css") {
    const topDir = rel.split(path.sep)[0];
    if (topDir === "components" || topDir === "templates" || !rel.includes(path.sep)) {
      return path.join(outputDir, "css", path.basename(rel));
    }
  }
  return path.join(outputDir, rel);
}

function copyTree(sourceDir, outputDir, generatedFiles) {
  for (const file of walkSync(sourceDir)) {
    const rel = path.relative(sourceDir, file);
    const ext = path.extname(file).toLowerCase();
    if (ext === ".md" || ext === ".yml" || ext === ".yaml") continue;
    const target = remapOutputPath(rel, outputDir);
    if (generatedFiles.has(target)) continue;
    ensureDir(path.dirname(target));
    fs.copyFileSync(file, target);
  }
}

// Copy favicons (icons + site.webmanifest) from admin/favicons into a
// root-level favicons/ in the output. Kept separate from imgs/ so it can't
// collide with the existing imgs/ folder on the live server. These live under
// admin/ — build tooling, not content — so they stay out of the source/
// markdown mirror while still landing in the built site, visible locally and
// on deploy.
function copyFavicons(outputDir, generatedFiles) {
  const faviconDir = path.join(__dirname, "favicons");
  if (!fs.existsSync(faviconDir)) return;
  const targetDir = path.join(outputDir, "favicons");
  ensureDir(targetDir);
  for (const name of fs.readdirSync(faviconDir)) {
    const src = path.join(faviconDir, name);
    if (!fs.statSync(src).isFile()) continue;
    const target = path.join(targetDir, name);
    fs.copyFileSync(src, target);
    generatedFiles.add(target);
  }
}

function readPreviousState() {
  try {
    return JSON.parse(fs.readFileSync(BUILD_STATE_PATH, "utf8"));
  } catch {
    return { generated: [] };
  }
}

function writeState(generatedFiles) {
  fs.writeFileSync(
    BUILD_STATE_PATH,
    JSON.stringify({ generated: [...generatedFiles].sort() }, null, 2),
    "utf8"
  );
}

function buildGraph(sourceDir) {
  const files = walkSync(sourceDir).filter(file => [".md", ".yml", ".yaml"].includes(path.extname(file).toLowerCase()));
  const templatesByName = new Map();
  const componentsByName = new Map();
  const templatesByRel = new Map();
  const componentsByRel = new Map();
  const entriesByRel = new Map();
  const pageEntriesByRel = new Map();
  const variablesEntries = [];
  const contentEntries = [];
  const unpublishedEntries = [];

  for (const file of files) {
    const rel = path.relative(sourceDir, file).replace(/\\/g, "/");
    const raw = readText(file);
    const { data: rawData, body } = parseFrontmatter(raw);
    const data = normalizeFrontmatterData(rawData);
    const entry = { file, rel, data, body };
    entriesByRel.set(rel, entry);

    if (guessMarkdownKind(file, data) === "template") {
      const aliases = normalizeTemplateAliases(file, data);
      registerAliases(templatesByName, entry, ...aliases);
      templatesByRel.set(rel, {
        entry,
        aliases: new Set(aliases.filter(Boolean).map(String)),
        refs: new Set(),
      });
      continue;
    }

    if (guessMarkdownKind(file, data) === "component") {
      const aliases = normalizeComponentAliases(file, data);
      registerAliases(componentsByName, entry, ...aliases);
      componentsByRel.set(rel, {
        entry,
        aliases: new Set(aliases.filter(Boolean).map(String)),
        refs: new Set(),
      });
      continue;
    }

    if (guessMarkdownKind(file, data) === "variables") {
      variablesEntries.push(entry);
      continue;
    }

    const contentEntry = {
      ...entry,
      templateName: String(entry.data.template || "main"),
      outputPath: path.join(sourceDir, rel.replace(/\.md$/i, ".html")),
    };
    pageEntriesByRel.set(rel, contentEntry);

    if (isPublishedContent(data)) contentEntries.push(contentEntry);
    else unpublishedEntries.push(contentEntry);
  }

  const directDepsByRel = new Map();
  const reverseDepsByRel = new Map();

  const registerReverseDep = (sourceRel, targetRel) => {
    if (!reverseDepsByRel.has(targetRel)) {
      reverseDepsByRel.set(targetRel, new Set());
    }
    reverseDepsByRel.get(targetRel).add(sourceRel);
  };

  for (const entry of entriesByRel.values()) {
    const deps = new Set();

    const templateEntry = templatesByName.get(String(entry.data.template || "main"));
    if (pageEntriesByRel.has(entry.rel) && templateEntry) {
      deps.add(templateEntry.rel);
    }

    for (const ref of findPlaceholderNames(entry.body)) {
      const componentEntry = componentsByName.get(ref);
      if (componentEntry) deps.add(componentEntry.rel);
    }

    for (const ref of findWrapperComponentNames(entry.body, componentsByName)) {
      const componentEntry = componentsByName.get(ref);
      if (componentEntry) deps.add(componentEntry.rel);
    }

    for (const includeRel of findIncludePageRefs(entry.body, entry.rel, pageEntriesByRel)) {
      deps.add(includeRel);
    }

    directDepsByRel.set(entry.rel, deps);
    for (const dep of deps) registerReverseDep(entry.rel, dep);
  }

  return {
    files,
    templatesByName,
    componentsByName,
    templatesByRel,
    componentsByRel,
    entriesByRel,
    pageEntriesByRel,
    directDepsByRel,
    reverseDepsByRel,
    variablesEntries,
    contentEntries,
    unpublishedEntries,
  };
}

function collectReverseDependentPages(seedRel, reverseDepsByRel, contentRelSet) {
  const queue = [seedRel];
  const visited = new Set([seedRel]);
  const impacted = new Set();

  while (queue.length) {
    const currentRel = queue.shift();
    const dependents = reverseDepsByRel.get(currentRel);
    if (!dependents) continue;

    for (const dependentRel of dependents) {
      if (visited.has(dependentRel)) continue;
      visited.add(dependentRel);
      queue.push(dependentRel);
      if (contentRelSet.has(dependentRel)) impacted.add(dependentRel);
    }
  }

  return impacted;
}

function toHtmlOutputPath(rootDir, relPath) {
  return path.join(rootDir, relPath.replace(/\.(md|ya?ml)$/i, ".html"));
}

function rebuildPageEntry(entry, templateEntry, componentsByName, site, outputDir, generatedFiles, contentEntries = [], pageEntriesByRel = new Map()) {
  const variables = site.variables || {};
  const context = { contentEntries, currentRel: entry.rel, pageEntriesByRel };
  const contentHtml = renderBodyHtml(
    entry.body,
    componentsByName,
    variables,
    context,
    new Set(),
    new Set(),
    false
  );
  const pageTitle = entry.data.title || path.basename(entry.rel, ".md");

  // Compute relative path prefix so templates and assets work from any subfolder.
  // A page at kitchen-sink/post.md gets base="../"; root pages get base="".
  const depth = entry.rel.split("/").length - 1;
  const base = depth > 0 ? "../".repeat(depth) : "";

  const pageContext = {
    site,
    title: pageTitle,
    page: entry.data,
    base,
    content: contentHtml,
  };

  let html;
  const warnings = [];
  if (!templateEntry) {
    warnings.push(`"${entry.rel}" specifies template "${entry.templateName}" which was not found — rendered without a template.`);
    html = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>${escapeHtml(pageTitle)}</title>\n</head>\n<body>\n${contentHtml}\n</body>\n</html>\n`;
  } else {
    const templateContext = {
      currentRel: templateEntry.rel,
      pageEntriesByRel,
      contentEntries,
      warnings,
    };
    const expandedTemplateSource = expandIncludeShortcodes(
      templateEntry.body,
      componentsByName,
      variables,
      templateContext,
      new Set(),
      new Set()
    );
    const componentHtml = {};
    for (const [name, componentEntry] of componentsByName.entries()) {
      componentHtml[name] = renderComponentHtml(
        componentEntry,
        componentsByName,
        variables,
        new Set([name]),
        {
          currentRel: componentEntry.rel,
          pageEntriesByRel,
          warnings,
        }
      );
    }

    // Per-page slot overrides: frontmatter key slot.name: component-name
    // renders the named component into that slot, overriding the global default.
    const slotOverrides = {};
    for (const [key, value] of Object.entries(entry.data)) {
      if (!key.startsWith("slot.")) continue;
      const slotName = key.slice(5);
      const componentEntry = componentsByName.get(String(value));
      if (componentEntry) {
        slotOverrides[slotName] = renderComponentHtml(
          componentEntry,
          componentsByName,
          variables,
          new Set([String(value)]),
          {
            currentRel: componentEntry.rel,
            pageEntriesByRel,
            warnings,
          }
        );
      } else {
        warnings.push(`Slot "${slotName}" references unknown component "${value}" in "${entry.rel}".`);
      }
    }

    const replacements = {
      content: contentHtml,
      base,
      ...variables,
      ...componentHtml,
      ...slotOverrides,
    };

    html = injectTemplate(
      expandedTemplateSource,
      replacements,
      warnings,
      `Template ${templateEntry.rel || templateEntry.data?.["template-name"] || entry.templateName}`
    );
    html = html.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, key) => {
      const parts = key.split(".");
      let value = pageContext;
      for (const part of parts) {
        value = value?.[part];
      }
      return value == null ? "" : String(value);
    });

  }

  html = replaceVariablesInHtml(html, variables);
  html = expandWrapperComponentsInHtml(html, componentsByName, variables, {
    currentRel: entry.rel,
    pageEntriesByRel,
    warnings,
  });
  html = expandRawComponentsInHtml(html, componentsByName, variables, {
    currentRel: entry.rel,
    pageEntriesByRel,
    warnings,
  });
  // Final pass: expand built-in shortcodes that may have survived inside
  // pre-rendered component HTML (e.g. <page-list /> inside a component body).
  html = expandBuiltinShortcodes(html, context);
  html = withLiveReload(html);

  const outputPath = toHtmlOutputPath(outputDir, entry.rel);
  ensureDir(path.dirname(outputPath));
  fs.writeFileSync(outputPath, html, "utf8");
  generatedFiles.add(outputPath);

  return {
    title: pageTitle,
    source: entry.rel,
    url: "/" + entry.rel.replace(/\.md$/i, ".html").replace(/\\/g, "/"),
    template: entry.templateName,
    outputPath,
    warnings,
  };
}

export async function build(options = {}) {
  const { changedPath = null, eventType = null } = options;
  const settings = readSettings();
  const sourceDir = resolveRoot(settings.paths?.markdown || "./website");
  const outputDir = resolveRoot(settings.paths?.output || "./website");
  const cleanOutput = Boolean(settings.build?.cleanOutput);
  const copyNonMarkdown = settings.build?.copyNonMarkdown !== false;
  const sameTree = path.resolve(sourceDir) === path.resolve(outputDir);
  const graph = buildGraph(sourceDir);
  const previousState = readPreviousState();
  const previousGenerated = new Set(previousState.generated || []);

  if (!sameTree && cleanOutput) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }

  ensureDir(outputDir);

  const generatedFiles = new Set();
  const variableValues = loadVariables(sourceDir);
  const site = { ...(settings.site || {}), variables: variableValues };
  const rebuiltPages = [];
  const variableOutputPaths = new Set(
    graph.variablesEntries.map(entry => toHtmlOutputPath(outputDir, entry.rel))
  );
  const unpublishedOutputPaths = new Set(
    graph.unpublishedEntries.map(entry => toHtmlOutputPath(outputDir, entry.rel))
  );

  const buildAll = !changedPath;
  let mode = buildAll ? "full" : "incremental";
  const changedAbs = changedPath ? path.resolve(changedPath) : null;
  const changedRel = changedAbs ? path.relative(sourceDir, changedAbs).replace(/\\/g, "/") : null;
  const publishedContentRelSet = new Set(graph.contentEntries.map(entry => entry.rel));

  if (!buildAll && changedRel.startsWith("..")) {
    mode = "full";
  }

  let targets = new Set();
  if (mode === "full") {
    for (const entry of graph.contentEntries) targets.add(entry.rel);
  } else if (changedRel) {
    const changedKind = guessMarkdownKind(changedAbs, fs.existsSync(changedAbs) ? parseFrontmatter(readText(changedAbs)).data : {});

    if (eventType === "unlink") {
      mode = "full";
      for (const entry of graph.contentEntries) targets.add(entry.rel);
    } else if (graph.entriesByRel.has(changedRel) && (changedKind === "content" || changedKind === "template" || changedKind === "component")) {
      const impacted = collectReverseDependentPages(changedRel, graph.reverseDepsByRel, publishedContentRelSet);
      for (const rel of impacted) targets.add(rel);
      if (publishedContentRelSet.has(changedRel)) targets.add(changedRel);
    } else if (changedKind === "content") {
      mode = "full";
      for (const entry of graph.contentEntries) targets.add(entry.rel);
    } else {
      mode = "full";
      for (const entry of graph.contentEntries) targets.add(entry.rel);
    }
  }

  for (const rel of targets) {
    const entry = graph.contentEntries.find(item => item.rel === rel);
    if (!entry) continue;
    const templateEntry = graph.templatesByName.get(entry.templateName);
    const pageRecord = rebuildPageEntry(
      entry,
      templateEntry,
      graph.componentsByName,
      site,
      outputDir,
      generatedFiles,
      graph.contentEntries,
      graph.pageEntriesByRel
    );
    rebuiltPages.push(pageRecord);
  }

  if (mode === "full") {
    for (const unpublishedOutputPath of unpublishedOutputPaths) {
      if (fs.existsSync(unpublishedOutputPath)) {
        fs.rmSync(unpublishedOutputPath, { force: true });
      }
    }

    for (const variableOutputPath of variableOutputPaths) {
      if (fs.existsSync(variableOutputPath)) {
        fs.rmSync(variableOutputPath, { force: true });
      }
    }

    if (copyNonMarkdown && sourceDir !== outputDir) {
      copyTree(sourceDir, outputDir, generatedFiles);
    }

    for (const oldPath of previousGenerated) {
      if (generatedFiles.has(oldPath)) continue;
      try {
        fs.rmSync(oldPath, { force: true });
      } catch {}
    }
  }

  const pages = graph.contentEntries
    .map(entry => {
      const templateEntry = graph.templatesByName.get(entry.templateName);
      const pageTitle = entry.data.title || path.basename(entry.rel, ".md");
      return {
        title: pageTitle,
        source: entry.rel,
        url: "/" + entry.rel.replace(/\.md$/i, ".html").replace(/\\/g, "/"),
        template: entry.templateName,
        date: entry.data.date || "",
        description: entry.data.description || "",
        categories: entry.data.categories || "",
        unlisted: isUnlistedContent(entry.data),
      };
    })
    .sort((a, b) => a.url.localeCompare(b.url));

  buildStylesheet(outputDir);
  copyFavicons(outputDir, generatedFiles);
  const feedPath = buildBlogFeed(outputDir, pages, variableValues["site-url"] || "", variableValues["site-title"] || "");
  const sitemapPath = buildSitemap(outputDir, pages, variableValues["site-url"] || "");
  if (feedPath) generatedFiles.add(feedPath);
  if (sitemapPath) generatedFiles.add(sitemapPath);

  generatedFiles.add(path.join(outputDir, "posts.json"));
  fs.writeFileSync(
    path.join(outputDir, "posts.json"),
    JSON.stringify({ generated: new Date().toISOString(), posts: pages }, null, 2),
    "utf8"
  );

  const stateGenerated = new Set(previousGenerated);
  for (const generatedPath of generatedFiles) stateGenerated.add(generatedPath);
  if (mode === "full") {
    stateGenerated.clear();
    for (const generatedPath of generatedFiles) stateGenerated.add(generatedPath);
  }
  writeState(stateGenerated);

  return {
    ok: true,
    mode,
    pagesBuilt: rebuiltPages.length,
    postsBuilt: pages.length,
    sourceDir,
    outputDir,
    warnings: [...new Set(rebuiltPages.flatMap(page => page.warnings || []))],
  };
}
