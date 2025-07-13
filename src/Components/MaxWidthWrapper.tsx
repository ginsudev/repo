import React from 'react'

interface MaxWidthWrapperProps {
  children: React.ReactNode
}

const containerStyles: React.CSSProperties = {
  maxWidth: '500px',
  margin: '0 auto',
  padding: '0 1rem',
  width: '100%'
}

export default function MaxWidthWrapper({ children }: MaxWidthWrapperProps) {
  return <div style={containerStyles}>{children}</div>
}
