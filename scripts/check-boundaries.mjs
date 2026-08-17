import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';

const webRoot = resolve('apps/web');
const forbidden = [
  /(?:^|\/)apps\/(?:api|worker)(?:\/|$)/,
  /(?:^|\/)packages\/(?:adapters|application)(?:\/|$)/,
  /(?:^|\/)src\/server(?:\/|$)/,
  /\bkysely\b/,
  /^@burgoweb\/(?:api|worker|adapters|application)(?:\/|$)/,
];

function candidates(file, specifier) {
  const values = [specifier.replaceAll('\\', '/')];
  if (specifier.startsWith('.')) {
    values.push(relative(process.cwd(), resolve(dirname(file), specifier)).replaceAll('\\', '/'));
  }
  return values;
}

async function walk(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(path)));
    else if (['.ts', '.tsx', '.js', '.jsx'].includes(extname(entry.name))) files.push(path);
  }
  return files;
}

const violations = [];
for (const file of await walk(webRoot)) {
  const source = await readFile(file, 'utf8');
  const imports = source.matchAll(/(?:from\s+|import\s*(?:\(\s*)?)["']([^"']+)["']/g);
  for (const match of imports) {
    if (candidates(file, match[1]).some((candidate) => forbidden.some((rule) => rule.test(candidate)))) {
      violations.push(`${relative(process.cwd(), file)} -> ${match[1]}`);
    }
  }
}

if (violations.length) {
  console.error(`Importações proibidas da web:\n${violations.join('\n')}`);
  process.exit(1);
}

console.log('Fronteiras da aplicação web validadas.');
