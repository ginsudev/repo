import { useState, useEffect } from 'react'
import List from '../../Components/List'
import { createPackageInfo, type PackageInfo } from '../../Model/packageInfo'

export default function PackageList() {
  const [packages, setPackages] = useState<PackageInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getPackages()
      .then((res) => {
        setPackages(res)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div>Loading packages...</div>
  if (error) return <div>Error loading packages: {error}</div>

  return (
    <>
      <List
        items={packages}
        createRow={(p) => ({
          id: p.id,
          title: p.name,
          subtitle: p.subtitle,
          leadingImage: p.icon,
          showArrow: true
        })}
        onItemClick={(p) => {
          window.location.href = `#/depiction/${p.id}`
        }}
      />
    </>
  )
}

async function getPackages(): Promise<PackageInfo[]> {
  const response = await fetch('/repo/packageInfo/packages.json')
  if (!response.ok) throw new Error(`Failed to fetch packages: ${response.statusText}`)

  const packageIds: string[] = await response.json()

  const packageInfos = await Promise.all(
    packageIds.map(async (id) => {
      const response = await fetch(`/repo/packageInfo/${id}/info.json`)
      if (!response.ok) throw new Error(`Failed to fetch package info: ${response.statusText}`)
      const data = await response.json()
      return createPackageInfo(data)
    })
  )

  return packageInfos.filter((p) => p !== undefined)
}
