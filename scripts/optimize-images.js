/**
 * optimize-images.js
 * One-time script to compress spotlight images from JPG → WebP
 * Run: node scripts/optimize-images.js
 */

import sharp from "sharp"
import { readdirSync, mkdirSync, existsSync } from "fs"
import { join, parse } from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const INPUT_DIR = join(__dirname, "..", "src", "assets", "spotlight")
const OUTPUT_DIR = join(__dirname, "..", "src", "assets", "spotlight-optimized")

const MAX_WIDTH = 800
const QUALITY = 80

async function optimize() {
  // Create output directory
  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
  }

  const files = readdirSync(INPUT_DIR).filter(f => /\.(jpg|jpeg|png)$/i.test(f))
  console.log(`\n🖼️  Found ${files.length} images to optimize\n`)

  let totalOriginal = 0
  let totalOptimized = 0

  for (const file of files) {
    const inputPath = join(INPUT_DIR, file)
    const { name } = parse(file)
    const outputPath = join(OUTPUT_DIR, `${name}.webp`)

    try {
      const inputMeta = await sharp(inputPath).metadata()
      const inputSize = (await sharp(inputPath).toBuffer()).length

      const output = await sharp(inputPath)
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY })
        .toFile(outputPath)

      totalOriginal += inputSize
      totalOptimized += output.size

      const reduction = ((1 - output.size / inputSize) * 100).toFixed(1)
      console.log(
        `  ✅ ${file.padEnd(25)} ${(inputSize / 1024 / 1024).toFixed(1)}MB → ${(output.size / 1024).toFixed(0)}KB  (${reduction}% smaller)`
      )
    } catch (err) {
      console.error(`  ❌ ${file}: ${err.message}`)
    }
  }

  console.log(`\n${"─".repeat(60)}`)
  console.log(`  📦 Total: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${(totalOptimized / 1024 / 1024).toFixed(1)}MB`)
  console.log(`  🚀 Saved: ${((totalOriginal - totalOptimized) / 1024 / 1024).toFixed(1)}MB (${((1 - totalOptimized / totalOriginal) * 100).toFixed(1)}% reduction)`)
  console.log(`\n  Output: ${OUTPUT_DIR}\n`)
}

optimize().catch(console.error)
