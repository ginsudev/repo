import path from 'path'
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs'
import { archiveDebPackage, extractDebPackage, parseControlFile, removeDirectory, writeControlFile } from '../common/utils.ts'
import { createPackage } from '../common/package.ts'
import { input } from '@inquirer/prompts'
import { DEBS_PATH, PACKAGES_DIR, REPO_URL } from '../../constant.ts'

export default async function (debPath?: string) {
  const inputDebPath = debPath ?? (await input({ message: 'Enter the path to the deb file', required: true }))

  if (!inputDebPath || !existsSync(inputDebPath)) {
    console.error('No input deb path provided')
    return
  }
  if (statSync(inputDebPath).isDirectory()) {
    console.error('Input path must be a file.')
    return
  }
  if (!inputDebPath.endsWith('.deb')) {
    console.error('Input file must be a deb file.')
    return
  }

  const inputDebName = path.basename(inputDebPath)
  const targetCopyPath = path.join(DEBS_PATH, inputDebName)
  const tmpExtractPath = path.join(DEBS_PATH, `tmp_extract_${inputDebName}_${Date.now()}`)

  try {
    console.log(`⌛ Exctracting ${inputDebName}`)
    extractDebPackage(inputDebPath, tmpExtractPath)
    const controlFile = parseControlFile(path.join(tmpExtractPath, 'DEBIAN', 'control'))
    const packageId = controlFile['Package'] as string

    // Append custom fields to the control file
    console.log(`⌛ Processing control file`)
    controlFile['Depiction'] = `${REPO_URL}/depiction/${packageId}`
    controlFile['SileoDepiction'] = `${REPO_URL}/packageInfo/${packageId}/sileo.json`
    controlFile['Icon'] = `${REPO_URL}/packageInfo/${packageId}/icon.png`
    writeControlFile(path.join(tmpExtractPath, 'DEBIAN', 'control'), controlFile)

    console.log(`⌛ Re-archiving ${inputDebName}`)
    archiveDebPackage(tmpExtractPath, targetCopyPath)

    console.log('⌛ Creating package entry')
    await createPackage({ control: controlFile, packagesDir: PACKAGES_DIR })

    console.log(`⌛ Adding entry to packages.json`)
    if (!existsSync(path.join(PACKAGES_DIR, 'packages.json'))) {
      writeFileSync(path.join(PACKAGES_DIR, 'packages.json'), JSON.stringify([packageId], null, 2))
    } else {
      const packages: Set<string> = new Set(JSON.parse(readFileSync(path.join(PACKAGES_DIR, 'packages.json'), 'utf8')))
      packages.add(packageId)
      writeFileSync(path.join(PACKAGES_DIR, 'packages.json'), JSON.stringify(Array.from(packages), null, 2))
    }

    console.log(`⌛ Cleaning up`)
    removeDirectory(tmpExtractPath)

    console.log(`✅ Successfully added ${inputDebName} to the repository`)
  } catch (error) {
    console.error(`Error processing ${inputDebName}:`, error)
    removeDirectory(tmpExtractPath)
  }
}
