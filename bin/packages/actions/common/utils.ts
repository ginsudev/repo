// @ts-expect-error import
import * as debianControl from 'debian-control/lib/index.js'
import { execSync } from 'child_process'
import { existsSync, readFileSync, rmSync, writeFileSync } from 'fs'

export function extractDebPackage(debPath: string, extractPath: string): void {
  try {
    execSync(`dpkg-deb --extract "${debPath}" "${extractPath}"`, { stdio: 'ignore' })
    execSync(`dpkg-deb --control "${debPath}" "${extractPath}/DEBIAN"`, { stdio: 'ignore' })
  } catch (error) {
    console.error(`Failed to extract ${debPath}:`, error)
    throw error
  }
}

export function archiveDebPackage(debPath: string, archivePath: string): void {
  try {
    removeFile(archivePath)
    execSync(`dpkg-deb --root-owner-group -b "${debPath}" "${archivePath}"`, { stdio: 'ignore' })
  } catch (error) {
    console.error(`Failed to archive ${debPath}:`, error)
    throw error
  }
}

export function parseControlFile(filePath: string): Record<string, unknown> {
  const controlFileContent = readFileSync(filePath, 'utf8')
  const parsed = debianControl.parse(controlFileContent)
  return parsed
}

export function writeControlFile(filePath: string, control: Record<string, unknown>) {
  removeFile(filePath)
  const stringified = `${debianControl.stringify(control)}\n`
  writeFileSync(filePath, stringified)
}

export function removeDirectory(dirPath: string): void {
  try {
    if (existsSync(dirPath)) {
      rmSync(dirPath, { recursive: true, force: true })
    }
  } catch (error) {
    console.error(`Failed to remove directory ${dirPath}:`, error)
    throw error
  }
}

export function removeFile(filePath: string): void {
  try {
    if (existsSync(filePath)) {
      rmSync(filePath, { force: true })
    }
  } catch (error) {
    console.error(`Failed to remove file ${filePath}:`, error)
    throw error
  }
}
