import { writeFileSync } from 'fs'
import path from 'path'
import type { PackageInfo } from './package.ts'
import { PACKAGES_DIR, REPO_URL } from '../../constant.ts'

interface CreateSileoDepictionOptions {
  packageInfo: PackageInfo
}

export function createSileoDepiction(options: CreateSileoDepictionOptions) {
  const headerImage = `${REPO_URL}/packageInfo/${options.packageInfo.id}/banner.png`

  const screenshots = options.packageInfo.screenshots.map((screenshot) => ({
    fullSizeURL: `${REPO_URL}/packageInfo/${options.packageInfo.id}/screenshots/${screenshot}`,
    url: `${REPO_URL}/packageInfo/${options.packageInfo.id}/screenshots/${screenshot}`,
    accessibilityText: 'Screenshot'
  }))

  const latestVersion = Object.keys(options.packageInfo.versions).sort().pop()

  const result = {
    minVersion: '0.4',
    class: 'DepictionTabView',
    headerImage,
    tabs: [
      {
        views: [
          {
            class: 'DepictionSpacerView',
            spacing: 12
          },
          {
            yPadding: 10,
            action: 'https://paypal.me/xiaonuoya',
            class: 'DepictionButtonView',
            text: 'Click here to buy me a coffee :)'
          },
          {
            itemSize: '{160, 346}',
            class: 'DepictionScreenshotsView',
            itemCornerRadius: 6,
            screenshots
          },
          {
            markdown: options.packageInfo.description,
            class: 'DepictionMarkdownView'
          },
          {
            class: 'DepictionSeparatorView'
          },
          {
            class: 'DepictionHeaderView',
            title: 'Extra information'
          },
          {
            class: 'DepictionTableTextView',
            text: latestVersion ?? 'Unknown version',
            title: 'Version'
          },
          {
            title: 'Price',
            text: 'Free',
            class: 'DepictionTableTextView'
          },
          {
            title: 'Developer',
            class: 'DepictionTableTextView',
            text: options.packageInfo.author
          },
          {
            class: 'DepictionTableButtonView',
            action: `${REPO_URL}/depiction/${options.packageInfo.id}`,
            title: 'View web depiction'
          }
        ],
        class: 'DepictionStackView',
        tabname: 'Details'
      },
      {
        tabname: 'Changes',
        class: 'DepictionStackView',
        views: Object.entries(options.packageInfo.versions).flatMap(([version, { date, changes }]) => [
          {
            class: 'DepictionLayerView',
            views: [
              {
                alignment: 0,
                useBoldText: true,
                title: version,
                class: 'DepictionSubheaderView'
              },
              {
                title: new Date(date).toLocaleDateString(),
                alignment: 2,
                class: 'DepictionSubheaderView'
              }
            ]
          },
          ...changes.map((change) => ({
            useSpacing: true,
            markdown: change,
            class: 'DepictionMarkdownView'
          })),
          {
            class: 'DepictionSpacerView',
            spacing: 12
          }
        ])
      },
      {
        views: [
          {
            action: 'https://discord.gg/BhdUyCbgkZ',
            title: 'Join my Discord server',
            class: 'DepictionTableButtonView'
          },
          {
            action: 'https://x.com/GinsuDev',
            title: 'Follow me on X',
            class: 'DepictionTableButtonView'
          }
        ],
        class: 'DepictionStackView',
        tabname: 'Contact'
      }
    ],
    tintColor: '#47afd1'
  }

  const packageDir = path.join(PACKAGES_DIR, options.packageInfo.id)
  writeFileSync(path.join(packageDir, 'sileo.json'), JSON.stringify(result, null, 2))
}
