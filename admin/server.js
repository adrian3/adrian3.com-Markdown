#!/usr/bin/env node
/**
 * Local dev server for Adrian3.com Generator
 * - Serves the generator admin UI at /
 * - Serves built website files at /preview/
 * - Rebuilds on markdown changes and notifies via SSE
 */

import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";
import { build, buildStylesheet, parseFrontmatter } from "./generator.js";
import { applyLinkFix, getLinkReport, invalidateLinkReportCache } from "./link-checker.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number.parseInt(process.env.PORT || "3002", 10);
const PREVIEW_PORT = Number.parseInt(process.env.PREVIEW_PORT || String(PORT + 1), 10);

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

// SSE clients for live reload
const sseClients = new Set();

function broadcastReload() {
  for (const res of sseClients) {
    res.write("data: reload\n\n");
  }
}

function logBuildWarnings(result) {
  for (const warning of result?.warnings || []) {
    console.warn(`Build warning: ${warning}`);
  }
}

async function checkPortFree(port) {
  return new Promise(resolve => {
    const tester = createServer()
      .once("error", () => resolve(false))
      .once("listening", () => tester.close(() => resolve(true)))
      .listen(port, "127.0.0.1");
  });
}

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || "application/octet-stream";
  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      return serveFile(res, path.join(filePath, "index.html"));
    }
    res.writeHead(200, { "Content-Type": mime });
    fs.createReadStream(filePath).pipe(res);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  }
}

function getLocalIP() {
  for (const ifaces of Object.values(os.networkInterfaces())) {
    for (const iface of ifaces) {
      if (iface.family === "IPv4" && !iface.internal) return iface.address;
    }
  }
  return null;
}

function readSettings() {
  const raw = fs.readFileSync(path.join(__dirname, "settings.json"), "utf8");
  return JSON.parse(raw);
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

function getSourceRoot() {
  const settings = readSettings();
  const configured = settings.paths?.markdown || settings.paths?.output || "./website";
  return path.resolve(ROOT, configured);
}

function getOutputRoot() {
  const settings = readSettings();
  const configured = settings.paths?.output || settings.paths?.markdown || "./website";
  return path.resolve(ROOT, configured);
}

function classifyMarkdownFile(relPath) {
  const ext = path.extname(relPath).toLowerCase();
  const base = path.basename(relPath, ext);
  const topDir = relPath.split(path.sep)[0];
  if ((ext === ".yml" || ext === ".yaml") && (base === "variables" || base.startsWith("variables."))) {
    return "variables";
  }
  if (ext !== ".md") return null;
  if (base === "variables" || base.startsWith("variables.")) return "variables";
  if (topDir === "templates" || base.startsWith("template.")) return "templates";
  if (topDir === "components" || base.startsWith("component.")) return "components";
  return "pages";
}

function parseShortcodeAttrsMeta(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item || "").trim()).filter(Boolean);
  }

  return String(value || "")
    .split(",")
    .map(part => part.trim())
    .filter(Boolean);
}

function buildShortcodeExample(name, data) {
  const explicit = String(data["shortcode-example"] || "").trim();
  if (explicit) return explicit;

  if (data.wrapper === true || data.wrapper === "true") {
    return `<${name}>...</${name}>`;
  }

  const attrs = parseShortcodeAttrsMeta(data["shortcode-attrs"]);
  if (!attrs.length) return `<${name} />`;

  const attrText = attrs.map(attr => `${attr}="..."`).join(" ");
  return `<${name} ${attrText} />`;
}

const RESERVED_FRONTMATTER_KEYS = new Set([
  "title",
  "template",
  "template-name",
  "component",
  "component-name",
  "template-module",
  "module-name",
  "variables",
  "date",
  "description",
  "categories",
  "category",
  "unpublished",
  "unlisted",
  "show-in-nav",
  "class",
  "id",
  "raw",
  "shortcode-attrs",
  "shortcode-example",
]);

function isReservedFrontmatterKey(key) {
  return RESERVED_FRONTMATTER_KEYS.has(key) || key.startsWith("slot.");
}

function parseVariablesYaml(source) {
  const entries = [];
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
    entries.push({
      key: match[1],
      value,
      shortcode: `<${match[1]} />`,
    });
  }
  return entries;
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // SSE endpoint for live reload
  if (pathname === "/__reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });
    res.write(": connected\n\n");
    sseClients.add(res);
    req.on("close", () => sseClients.delete(res));
    return;
  }

  // API: trigger a build
  if (pathname === "/api/build" && req.method === "POST") {
    res.writeHead(200, { "Content-Type": "application/json" });
    try {
      const result = await build();
      logBuildWarnings(result);
      broadcastReload();
      res.end(JSON.stringify({ ok: true, ...result }));
    } catch (err) {
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
    return;
  }

  // API: read settings
  if (pathname === "/api/settings" && req.method === "GET") {
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(readSettings(), null, 2));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // API: save settings (merges editable site fields only)
  if (pathname === "/api/settings" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        const updates = JSON.parse(body);
        const settingsPath = path.join(__dirname, "settings.json");
        const current = readSettings();
        current.site = { ...current.site, ...updates.site };
        fs.writeFileSync(settingsPath, JSON.stringify(current, null, 2), "utf8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true }));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // API: get built posts/pages index
  if (pathname === "/api/posts" && req.method === "GET") {
    try {
      const postsPath = path.join(getOutputRoot(), "posts.json");
      const raw = fs.readFileSync(postsPath, "utf8");
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(raw);
    } catch {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ posts: [] }));
    }
    return;
  }

  if (pathname === "/api/network" && req.method === "GET") {
    const ip = getLocalIP();
    const url = ip ? `http://${ip}:${PREVIEW_PORT}/` : null;
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ip, url }));
    return;
  }

  if (pathname === "/api/catalog" && req.method === "GET") {
    try {
      const sourceDir = getSourceRoot();
      const sourceFiles = walkSync(sourceDir)
        .filter(file => [".md", ".yml", ".yaml"].includes(path.extname(file).toLowerCase()))
        .map(file => ({
          relPath: path.relative(sourceDir, file).replace(/\\/g, "/"),
          absPath: file,
        }))
        .sort((a, b) => a.relPath.localeCompare(b.relPath));

      const catalog = {
        templates: [],
        components: [],
        pages: [],
        variables: [],
        frontmatterSystemKeys: [],
        frontmatterUserKeys: [],
      };

      // Boolean classification flags only — not useful to show to authors.
      // Authoring keys like raw, class, id, component-name ARE useful and are kept.
      const classificationFlags = new Set([
        "component", "template", "variables", "template-module",
      ]);
      const frontmatterSystemKeySet = new Set();
      const frontmatterUserKeySet = new Set();

      for (const file of sourceFiles) {
        const kind = classifyMarkdownFile(file.relPath);
        if (!kind) continue;
        if (kind === "variables") {
          const variables = parseVariablesYaml(fs.readFileSync(file.absPath, "utf8"));
          for (const variable of variables) {
            catalog.variables.push({ ...variable, source: file.relPath });
          }
          continue;
        }
        if (kind !== "components") {
          catalog[kind].push(file.relPath);
        }

        // Collect frontmatter keys from pages and components
        if (kind === "pages" || kind === "components") {
          const { data } = parseFrontmatter(fs.readFileSync(file.absPath, "utf8"));
          for (const key of Object.keys(data)) {
            if (classificationFlags.has(key)) continue;
            if (isReservedFrontmatterKey(key)) frontmatterSystemKeySet.add(key);
            else frontmatterUserKeySet.add(key);
          }
        }

        // Collect component shortcode names
        if (kind === "components") {
          const { data } = parseFrontmatter(fs.readFileSync(file.absPath, "utf8"));
          const base = path.basename(file.relPath, ".md");
          const name = data["component-name"] || data["module-name"] || base;
          catalog.components.push({
            name,
            shortcode: buildShortcodeExample(name, data),
            source: file.relPath,
          });
        }
      }

      catalog.components.push(
        { name: "page-list", shortcode: '<page-list />', source: "built-in" },
        { name: "page-list (folder)", shortcode: '<page-list folder=\"...\" />', source: "built-in" },
        { name: "include", shortcode: '<include page=\"path/to/page.md\" />', source: "built-in" }
      );
      catalog.components.sort((a, b) => a.name.localeCompare(b.name));

      catalog.frontmatterSystemKeys = [...new Set([...RESERVED_FRONTMATTER_KEYS, "slot.*", ...frontmatterSystemKeySet])].sort();
      catalog.frontmatterUserKeys = [...frontmatterUserKeySet].sort();

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(catalog));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === "/api/link-report" && req.method === "GET") {
    try {
      const report = getLinkReport(getSourceRoot(), getOutputRoot());
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(report));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  if (pathname === "/api/link-fix" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const result = applyLinkFix(getSourceRoot(), getOutputRoot(), payload);
        const changedPath = path.join(getSourceRoot(), String(payload.source || ""));
        const buildResult = await build({ changedPath, eventType: "change" });
        logBuildWarnings(buildResult);
        broadcastReload();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // Preview: serve built website
  if (pathname.startsWith("/preview/") || pathname === "/preview") {
    try {
      const outDir = getOutputRoot();
      const rel = pathname.replace(/^\/preview\/?/, "") || "index.html";
      serveFile(res, path.join(outDir, rel));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(err.message);
    }
    return;
  }

  // Serve admin UI files from root
  const filePath = pathname === "/" || pathname === ""
    ? path.join(ROOT, "admin", "index.html")
    : path.join(ROOT, decodeURIComponent(pathname));

  serveFile(res, filePath);
}

async function startServer() {
  const free = await checkPortFree(PORT);
  if (!free) {
    console.log(`Port ${PORT} already in use — opening browser to existing server.`);
    return;
  }

  const server = http.createServer((req, res) => {
    handleRequest(req, res).catch(err => {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end(err.message);
    });
  });

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Admin server running at http://localhost:${PORT}`);
  });

  // Preview server — serves website/ at root, mirroring production
  const outDir = getOutputRoot();

  const previewFree = await checkPortFree(PREVIEW_PORT);
  if (previewFree) {
    const previewServer = http.createServer((req, res) => {
      const pathname = new URL(req.url, `http://localhost:${PREVIEW_PORT}`).pathname;
      const filePath = path.join(outDir, decodeURIComponent(pathname));
      const ext = path.extname(pathname).toLowerCase();

      // Mirror Apache: redirect directory requests without trailing slash so
      // relative paths in the HTML resolve from the correct base URL.
      if (!ext && !pathname.endsWith('/')) {
        try {
          if (fs.statSync(filePath).isDirectory()) {
            res.writeHead(301, { Location: pathname + '/' });
            res.end();
            return;
          }
        } catch {}
      }

      // Serve file; fall back to error pages on 404
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory() && !fs.existsSync(path.join(filePath, "index.html"))) {
        const errorPage = path.join(outDir, "404.html");
        if (fs.existsSync(errorPage)) {
          res.writeHead(404, { "Content-Type": "text/html" });
          fs.createReadStream(errorPage).pipe(res);
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        }
        return;
      }
      serveFile(res, filePath);
    });
    previewServer.listen(PREVIEW_PORT, "0.0.0.0", () => {
      console.log(`Preview server running at http://localhost:${PREVIEW_PORT}`);
    });
  } else {
    console.log(`Preview port ${PREVIEW_PORT} already in use.`);
  }

  // Watch markdown folder for changes and auto-rebuild
  try {
    const mdDir = getSourceRoot();

    let buildTimer = null;
    const queueBuild = (event, filePath) => {
      clearTimeout(buildTimer);
      buildTimer = setTimeout(async () => {
        const relative = path.relative(mdDir, filePath || "").replace(/\\/g, "/");
        console.log(`Markdown ${event}${relative ? `: ${relative}` : ""}, rebuilding...`);
        try {
          invalidateLinkReportCache();
          const result = await build({ changedPath: filePath, eventType: event });
          logBuildWarnings(result);
          console.log(`Rebuilt (${result.mode}): ${result.pagesBuilt} pages, ${result.postsBuilt} posts`);
          broadcastReload();
        } catch (err) {
          console.error("Build error:", err.message);
        }
      }, 300);
    };

    try {
      const watcher = fs.watch(mdDir, { recursive: true }, (eventType, filename) => {
        if (!filename) return;
        if (/\.(md|yml|yaml)$/i.test(filename)) {
          const filePath = path.join(mdDir, filename);
          const event = eventType === "rename" && !fs.existsSync(filePath) ? "unlink" : "change";
          queueBuild(event, filePath);
        } else if (/\.(css|js|json|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf)$/i.test(filename)) {
          // Asset changed — copy it to output and reload without a full rebuild.
          // Root-level CSS files get remapped to css/ in the output (mirrors copyTree logic).
          clearTimeout(buildTimer);
          buildTimer = setTimeout(async () => {
            const srcFile = path.join(mdDir, filename);
            const topDir = filename.split(path.sep)[0];
            const isMappedCss = /\.css$/i.test(filename) &&
              (topDir === "components" || topDir === "templates" || !filename.includes(path.sep));
            const outRel = isMappedCss ? path.join("css", path.basename(filename)) : filename;
            const outFile = path.join(getOutputRoot(), outRel);
            try {
              invalidateLinkReportCache();
              if (fs.existsSync(srcFile)) {
                fs.mkdirSync(path.dirname(outFile), { recursive: true });
                fs.copyFileSync(srcFile, outFile);
              }
              if (/\.css$/i.test(filename)) {
                buildStylesheet(getOutputRoot());
              }
              console.log(`Asset changed: ${filename} → ${outRel} — synced, reloading.`);
              broadcastReload();
            } catch (err) {
              console.error("Asset sync error:", err.message);
            }
          }, 100);
        }
      });
      watcher.on("error", err => {
        console.error("Source watcher error:", err.message);
      });
      console.log(`Watching source files in ${mdDir}`);
    } catch (watchErr) {
      console.log(`File watching unavailable (${watchErr.message}) — auto-rebuild disabled.`);
    }

    // Also watch settings.json
    fs.watch(path.join(__dirname, "settings.json"), (eventType) => {
      if (eventType !== "change") return;
      invalidateLinkReportCache();
      queueBuild("change", path.join(__dirname, "settings.json"));
    });
  } catch {
    console.log("File watching unavailable — auto-rebuild disabled.");
  }
}

startServer();
