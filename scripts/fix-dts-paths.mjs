import { existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../dist/lib', import.meta.url))

function declarationExists(path) {
  return (
    existsSync(path) ||
    existsSync(`${path}.d.ts`) ||
    existsSync(`${path}.vue.d.ts`)
  )
}

function fixSpecifier(file, specifier) {
  if (!specifier.startsWith('.')) return specifier
  const dir = dirname(file)
  if (declarationExists(resolve(dir, specifier))) return specifier
  const shorter = specifier.replace(/^\.\.\//, '')
  if (shorter !== specifier && declarationExists(resolve(dir, shorter))) {
    return shorter
  }
  return specifier
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      await walk(full)
      continue
    }
    if (!entry.name.endsWith('.d.ts')) continue
    const original = await readFile(full, 'utf8')
    const next = original.replace(
      /(['"])(\.\.?\/[^'"]+)\1/g,
      (match, quote, specifier) => {
        const fixed = fixSpecifier(full, specifier)
        return fixed === specifier ? match : `${quote}${fixed}${quote}`
      },
    )
    if (next !== original) await writeFile(full, next)
  }
}

await walk(root)
