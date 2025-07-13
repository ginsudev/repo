import path from 'path'
import { readdirSync } from 'fs'
import { input } from '@inquirer/prompts'
import addPackage from '../addPackage/index.ts'

export default async function () {
  const debsInputPath = await input({ message: 'Enter the path to the debs directory', required: true })

  // For each deb file in the debs directory, extract the contents
  const debs = readdirSync(debsInputPath)
    .filter((file) => file.endsWith('.deb'))
    .sort((a, b) => (a < b ? -1 : 1))

  if (debs.length === 0) {
    console.log('No debs to process')
    return
  }

  for (const deb of debs) {
    const debPath = path.join(debsInputPath, deb)
    await addPackage(debPath)
  }
}
