import PageIntroduction from '../../Components/PageIntroduction'
import PackageList from '../Packages/PackageList'
import SocialsList from '../../Components/SocialsList'

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageIntroduction title="Ginsu's repo" subtitle='A repo for my apps.' leadingImage='/repo/CydiaIcon.png' />

      <SocialsList />

      <PackageList />
    </div>
  )
}
