interface ChangelogEntryProps {
  version: string
  date: string
  changes: string[]
}

const versionStyles: React.CSSProperties = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  margin: '0 0 0.5rem 0'
}

const dateStyles: React.CSSProperties = {
  fontSize: '0.9rem',
  color: '#666',
  margin: '0 0 0.75rem 0'
}

const changesStyles: React.CSSProperties = {
  margin: 0,
  paddingLeft: '1.2rem'
}

export default function ChangelogEntry({ version, date, changes }: ChangelogEntryProps) {
  return (
    <>
      <div style={versionStyles}>Version {version}</div>
      <div style={dateStyles}>{new Date(date).toLocaleDateString()}</div>
      <ul style={changesStyles}>
        {changes
          .filter((change) => change.trim().length > 0)
          .map((change, index) => (
            <li key={index}>{change}</li>
          ))}
      </ul>
    </>
  )
}
