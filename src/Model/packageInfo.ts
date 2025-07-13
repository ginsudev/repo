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

// not safe at all
export function createPackageInfo(data: Record<string, unknown>): PackageInfo | undefined {
  return data as unknown as PackageInfo
}
