/**
 * Serves the static export (out/) with correct Content-Type for Atom feeds.
 * Use this to verify feed Subscribe/Preview in the browser without deploying.
 *
 * 1. npm run build
 * 2. npm run preview
 * 3. Open http://localhost:3000 (site) or http://localhost:3000/feed.xml (feed)
 * 4. In the browser, use the feed icon or add feed URL to test Subscribe/Preview
 *
 * PORT=4000 npm run preview  → serve on port 4000
 */
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, "..", "out");
const port = Number(process.env.PORT) || 3080;

const ATOM_PATHS = ["/feed.xml", "/ja/feed.xml", "/en/feed.xml"];
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

function send(res, statusCode, body, contentType) {
  res.writeHead(statusCode, {
    "Content-Type": contentType || "text/plain; charset=utf-8",
  });
  res.end(body);
}

function sendFile(res, filePath, contentType) {
  const stream = fs.createReadStream(filePath);
  res.writeHead(200, { "Content-Type": contentType });
  stream.on("error", () => send(res, 404, "Not Found", "text/plain"));
  stream.pipe(res);
}

const outDirResolved = path.resolve(outDir);

const server = http.createServer((req, res) => {
  const base = (req.url || "/").replace(/\?.*$/, "").replace(/\/$/, "") || "/";
  const segs = base.split("/").filter(Boolean);
  const safePath = path.resolve(outDir, ...segs);
  if (!safePath.startsWith(outDirResolved)) {
    send(res, 403, "Forbidden", "text/plain");
    return;
  }

  if (ATOM_PATHS.includes(base)) {
    const filePath = path.resolve(outDir, segs.join(path.sep) || "feed.xml");
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      sendFile(res, filePath, "application/atom+xml; charset=utf-8");
      return;
    }
  }

  const asFile = path.join(outDir, ...segs);
  const asIndex = path.join(asFile, "index.html");
  if (fs.existsSync(asFile) && fs.statSync(asFile).isFile()) {
    const ext = path.extname(asFile);
    sendFile(res, asFile, MIME[ext] || "application/octet-stream");
    return;
  }
  if (fs.existsSync(asIndex)) {
    sendFile(res, asIndex, MIME[".html"]);
    return;
  }
  if (segs.length === 0 && fs.existsSync(path.join(outDir, "index.html"))) {
    sendFile(res, path.join(outDir, "index.html"), MIME[".html"]);
    return;
  }
  send(res, 404, "Not Found", "text/plain");
});

server.listen(port, () => {
  if (!fs.existsSync(outDir)) {
    console.error("out/ not found. Run: npm run build");
    process.exit(1);
  }
  console.log(`Serving out/ at http://localhost:${port}`);
  console.log("Feed URLs (Content-Type: application/atom+xml):");
  ATOM_PATHS.forEach((p) => console.log(`  http://localhost:${port}${p}`));
});
