import path from 'path'
import { readdirSync } from 'fs'
import { select } from '@inquirer/prompts'
import { DEBS_PATH } from '../../constant.ts'
import addPackage from '../addPackage/index.ts'

export default async function (all: boolean = false) {
  const files = readdirSync(DEBS_PATH)
    .filter((file) => file.endsWith('.deb'))
    .sort((a, b) => (a < b ? -1 : 1))

  if (!files.length) {
    console.log('No debs to process')
    return
  }

  if (all) {
    for (const file of files) {
      await addPackage(path.join(DEBS_PATH, file))
    }
  } else {
    const selectedDeb = await select({
      message: 'Select a deb',
      choices: files.map((file) => ({ name: file, value: file }))
    })

    const inputDebPath = path.join(DEBS_PATH, selectedDeb)
    await addPackage(inputDebPath)
  }
}
