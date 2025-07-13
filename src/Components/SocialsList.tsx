import { DISCORD_INVITE_URL, GITHUB_URL, X_URL } from '../constant'
import List from './List'

export default function SocialsList() {
  return (
    <>
      <List
        items={listItems}
        createRow={(item) => ({
          id: item.url,
          title: item.title,
          subtitle: item.subtitle,
          leadingImage: item.iconUrl,
          showArrow: true,
          url: item.url
        })}
        onItemClick={(item) => {
          window.open(item.url, '_blank')
        }}
      />
    </>
  )
}

interface SocialItem {
  title: string
  subtitle: string
  iconUrl: string
  url: string
}

const listItems: SocialItem[] = [
  {
    title: 'X',
    subtitle: 'Follow me on X',
    iconUrl: '/xIcon.png',
    url: X_URL
  },
  {
    title: 'Discord',
    subtitle: 'Join Discord server',
    iconUrl: '/discordIcon.png',
    url: DISCORD_INVITE_URL
  },
  {
    title: 'GitHub',
    subtitle: 'View my open source projects',
    iconUrl: '/githubIcon.png',
    url: GITHUB_URL
  }
]
