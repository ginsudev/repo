import { select } from '@inquirer/prompts'
import addPackage from './actions/addPackage/index.ts'
import bulkAddPackages from './actions/bulkAddPackages/index.ts'
import syncPackage from './actions/syncPackage/index.ts'

async function main() {
  const action = await getMainMenuAction()

  switch (action) {
    case 'add_package':
      await addPackage()
      return
    case 'bulk_add_packages':
      await bulkAddPackages()
      return
    case 'sync_package':
      await syncPackage()
      return
    case 'sync_all_packages':
      await syncPackage(true)
      return
  }
}

async function getMainMenuAction(): Promise<'add_package' | 'bulk_add_packages' | 'sync_package' | 'sync_all_packages'> {
  const answer = await select({
    message: 'What do you want to do?',
    choices: [
      { name: 'Add a package', value: 'add_package' },
      { name: 'Bulk add packages', value: 'bulk_add_packages' },
      { name: 'Sync a package', value: 'sync_package' },
      { name: 'Sync all packages', value: 'sync_all_packages' }
    ]
  })
  return answer as unknown as Awaited<ReturnType<typeof getMainMenuAction>>
}

await main()
