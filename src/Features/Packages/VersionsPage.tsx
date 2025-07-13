import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import SectionContent from '../../Components/SectionContent'
import ChangelogEntry from '../../Components/ChangelogEntry'
import ClassicButton from '../../Components/ClassicButton'
import type { PackageInfo } from '../../Model/packageInfo'

const titleStyles: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#333'
}

const loadingStyles: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '1.1rem',
  color: '#666'
}

const errorStyles: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '1.1rem',
  color: '#8B0000',
  background: 'linear-gradient(to bottom, #ffebee, #ffcdd2)',
  borderRadius: '12px',
  border: '1px solid #e57373'
}

export default function VersionsPage() {
  const { id } = useParams<{ id: string }>()
  const [packageInfo, setPackageInfo] = useState<PackageInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackageInfo = async () => {
      if (!id) {
        setError('Package ID not found')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/repo/packageInfo/${id}/info.json`)
        if (!response.ok) {
          throw new Error('Package not found')
        }
        const data = await response.json()
        setPackageInfo(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load package info')
      } finally {
        setLoading(false)
      }
    }

    fetchPackageInfo()
  }, [id])

  if (loading) {
    return (
      <SectionContent>
        <div style={loadingStyles}>Loading versions...</div>
      </SectionContent>
    )
  }

  if (error) {
    return (
      <SectionContent>
        <div style={errorStyles}>Error: {error}</div>
      </SectionContent>
    )
  }

  if (!packageInfo) {
    return (
      <SectionContent>
        <div style={errorStyles}>Package not found</div>
      </SectionContent>
    )
  }

  const sortedVersions = Object.entries(packageInfo.versions).sort((a, b) => (a > b ? -1 : 1))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <ClassicButton title={`← Back to ${packageInfo.name}`} onClick={() => (window.location.href = `/depiction/${id}`)} />
      {sortedVersions.length && (
        <>
          <div style={titleStyles}>Version History</div>
          <SectionContent>
            {sortedVersions.map(([versionNumber, versionData], index) => (
              <>
                <ChangelogEntry version={versionNumber} date={versionData.date} changes={versionData.changes} />
                {index !== sortedVersions.length - 1 && <div style={{ height: '1px', background: '#ddd', margin: '0.5rem 0' }} />}
              </>
            ))}
          </SectionContent>
        </>
      )}
    </div>
  )
}
