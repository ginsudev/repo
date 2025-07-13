import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import ReactMarkdown from 'react-markdown'
import ImageCarousel from '../../Components/ImageCarousel'
import SocialsList from '../../Components/SocialsList'
import PageIntroduction from '../../Components/PageIntroduction'
import SectionContent from '../../Components/SectionContent'
import ChangelogEntry from '../../Components/ChangelogEntry'
import { apply } from '../../Utils/functional'
import type { PackageInfo } from '../../Model/packageInfo'
import ClassicButton from '../../Components/ClassicButton'

const sectionTitleStyles: React.CSSProperties = {
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

export default function PackageDepictionPage() {
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
        if (!response.ok) throw new Error('Package not found')
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
        <div style={loadingStyles}>Loading package information...</div>
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <PageIntroduction title={packageInfo.name} leadingImage={packageInfo.icon} />
      <SocialsList />

      {/* Description Section */}
      <div style={sectionTitleStyles}>Description</div>
      <SectionContent>
        <ReactMarkdown
          components={{
            p: ({ children }) => <p style={{ margin: '0.5rem 0' }}>{children}</p>,
            h1: ({ children }) => <h1 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.5rem' }}>{children}</h1>,
            h2: ({ children }) => <h2 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.3rem' }}>{children}</h2>,
            h3: ({ children }) => <h3 style={{ margin: '1rem 0 0.5rem 0', fontSize: '1.1rem' }}>{children}</h3>,
            ul: ({ children }) => <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>{children}</ul>,
            ol: ({ children }) => <ol style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>{children}</ol>,
            li: ({ children }) => <li style={{ margin: '0.25rem 0' }}>{children}</li>,
            code: ({ children }) => (
              <code style={{ backgroundColor: '#f0f0f0', padding: '0.2rem 0.4rem', borderRadius: '3px', fontSize: '0.9rem' }}>{children}</code>
            ),
            pre: ({ children }) => (
              <pre style={{ backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '6px', overflowX: 'auto', fontSize: '0.9rem' }}>
                {children}
              </pre>
            ),
            blockquote: ({ children }) => (
              <blockquote style={{ borderLeft: '4px solid #ddd', paddingLeft: '1rem', margin: '1rem 0', fontStyle: 'italic' }}>{children}</blockquote>
            ),
            a: ({ children, href }) => (
              <a
                href={href}
                style={{ color: '#007bff', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
              >
                {children}
              </a>
            )
          }}
        >
          {packageInfo.description.replace(/\\n/g, '\n')}
        </ReactMarkdown>
      </SectionContent>

      {/* Screenshots Section */}
      {packageInfo.screenshots && packageInfo.screenshots.length > 0 && (
        <>
          <div style={sectionTitleStyles}>Screenshots</div>
          <SectionContent>
            <ImageCarousel
              images={packageInfo.screenshots.map((s) => `/repo/packageInfo/${id}/screenshots/${s}`)}
              alt={`${packageInfo.name} screenshot`}
            />
          </SectionContent>
        </>
      )}

      {/* Changelog Section */}
      <div style={sectionTitleStyles}>What's new</div>
      {apply(newestVersion(packageInfo.versions), (version) => {
        return (
          <SectionContent>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <ChangelogEntry version={version} date={packageInfo.versions[version].date} changes={packageInfo.versions[version].changes} />
              <div style={{ height: '1px', background: '#ddd', margin: '0.5rem 0' }} />
              <ClassicButton title='View all versions' onClick={() => (window.location.href = `/versions/${id}`)} />
            </div>
          </SectionContent>
        )
      })}
    </div>
  )
}

const newestVersion = (versions: PackageInfo['versions']) =>
  Object.keys(versions)
    .sort((a, b) => (a > b ? -1 : 1))
    .at(0)
