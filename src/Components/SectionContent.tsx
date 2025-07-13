const styles: React.CSSProperties = {
  background: 'linear-gradient(to bottom, #ffffff, #f8f8f8)',
  borderRadius: '12px',
  border: '1px solid #d0d0d0',
  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
  padding: '1.5rem'
}

export default function SectionContent({ children }: { children: React.ReactNode }) {
  return <div style={styles}>{children}</div>
}
