import fs from 'fs';
import path from 'path';

const DOCS_DIR = path.join(process.cwd(), 'data', 'research', 'docs');

export default function handler(req, res) {
  const { file } = req.query;

  if (!file || typeof file !== 'string') {
    return res.status(400).json({ error: 'File parameter is required' });
  }

  // Protection 1: Strip ../ sequences (naive — does not recurse)
  let sanitized = file.replaceAll('../', '');

  // Protection 2: Decode URI component (re-decode after sanitize)
  try {
    sanitized = decodeURIComponent(sanitized);
  } catch {
    return res.status(400).json({ error: 'Invalid encoding in file parameter' });
  }

  // Build absolute path using string concat (intentionally not path.resolve)
  const filePath = DOCS_DIR + path.sep + sanitized;

  // Protection 3: Prefix check — ensure path stays within docs dir
  if (!filePath.startsWith(DOCS_DIR)) {
    return res.status(403).json({ error: 'Access denied — path traversal detected' });
  }

  console.log(`[DEBUG] cwd=${process.cwd()} | path=${filePath} | exists=${fs.existsSync(filePath)}`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return res.status(404).json({ error: 'File not found in research archive' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
}
