import { editor, input } from '@inquirer/prompts'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { removeFile } from './utils.ts'
import { createSileoDepiction } from './sileo.ts'

interface CreatePackageOptions {
  control: Record<string, unknown>
  packagesDir: string
}

export interface PackageInfo {
  id: string
  name: string
  subtitle: string
  description: string
  icon: string
  author: string
  maintainer: string
  screenshots: string[]
  versions: {
    [version: string]: {
      date: string
      changes: string[]
    }
  }
}

export async function createPackage(options: CreatePackageOptions) {
  const packageDir = getPackageDir(options)
  if (!existsSync(packageDir)) {
    await handleNewPackage(options)
  } else {
    await handleExistingPackage(options)
  }
}

async function handleNewPackage(options: CreatePackageOptions) {
  const packageDir = getPackageDir(options)
  // Create the package directory
  mkdirSync(packageDir, { recursive: true })
  // Create screenshots directory
  mkdirSync(path.join(packageDir, 'screenshots'), { recursive: true })

  const defaultDescription = options.control['Description'] as string
  const description = await editor({
    message: 'Enter the package description',
    postfix: 'md',
    default: defaultDescription
  }).then((i) => i.trim())

  const packageInfo = createPackageInfo({ ...options, description: description })
  const packageInfoPath = path.join(packageDir, 'info.json')
  removeFile(packageInfoPath)
  writeFileSync(packageInfoPath, JSON.stringify(packageInfo, null, 2))

  createSileoDepiction({ packageInfo })
}

async function handleExistingPackage(options: CreatePackageOptions) {
  const packageDir = getPackageDir(options)
  const newVersion = options.control['Version'] as string

  // Create screenshots directory if needed
  mkdirSync(path.join(packageDir, 'screenshots'), { recursive: true })

  const existingPackageInfo: PackageInfo = JSON.parse(readFileSync(path.join(packageDir, 'info.json'), 'utf8'))

  if (!existingPackageInfo.versions[newVersion]) {
    const newVersionChanges: string[] = []

    let isFinishedAddingChanges = false
    while (!isFinishedAddingChanges) {
      const change = await input({ message: 'Enter change (or empty to finish)' }).then((i) => i.trim())
      if (change.length) {
        newVersionChanges.push(change)
      } else {
        isFinishedAddingChanges = true
      }
    }

    existingPackageInfo.versions[newVersion] = {
      date: new Date().toISOString(),
      changes: newVersionChanges
    }
  }

  // Sync screenshots
  const screenshots = getScreenshotNames(options)
  existingPackageInfo.screenshots = screenshots

  const packageInfoPath = path.join(packageDir, 'info.json')
  removeFile(packageInfoPath)
  writeFileSync(packageInfoPath, JSON.stringify(existingPackageInfo, null, 2))

  createSileoDepiction({ packageInfo: existingPackageInfo })
}

function getPackageDir(options: CreatePackageOptions): string {
  const packageId = options.control['Package'] as string
  const packageDir = path.join(options.packagesDir, packageId)
  return packageDir
}

function getScreenshotNames(options: CreatePackageOptions): string[] {
  const packageDir = getPackageDir(options)
  return readdirSync(path.join(packageDir, 'screenshots')).sort((a, b) => (a < b ? -1 : 1))
}

function createPackageInfo(options: CreatePackageOptions & { description: string }): PackageInfo {
  const { control, description } = options
  const screenshots = getScreenshotNames(options)
  const packageInfo: PackageInfo = {
    id: control['Package'] as string,
    name: control['Name'] as string,
    subtitle: control['Description'] as string,
    description: description,
    icon: control['Icon'] as string,
    author: control['Author'] as string,
    maintainer: control['Maintainer'] as string,
    screenshots,
    versions: {
      [control['Version'] as string]: {
        date: new Date().toISOString(),
        changes: ['Initial release']
      }
    }
  }
  return packageInfo
}
