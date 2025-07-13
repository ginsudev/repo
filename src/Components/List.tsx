import React from 'react'
import GlossyImage from './GlossyImage'

interface ListItem {
  id: string
  title: string
  subtitle?: string
  rightText?: string
  showArrow?: boolean
  leadingImage?: string
}

interface ListProps<T> {
  items: T[]
  createRow: (item: T) => ListItem
  onItemClick?: (item: T) => void
}

export default function List<T>({ items, createRow, onItemClick }: ListProps<T>) {
  const listStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '20px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  }

  const itemStyle: React.CSSProperties = {
    backgroundColor: 'white',
    padding: '12px 16px',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  }

  const lastItemStyle: React.CSSProperties = {
    ...itemStyle,
    borderBottom: 'none'
  }

  const leftContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  }

  const leadingImageStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    objectFit: 'cover',
    flexShrink: 0
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: '400',
    color: '#000',
    margin: 0
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#666',
    margin: '2px 0 0 0'
  }

  const rightContentStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#666',
    fontSize: '14px'
  }

  const arrowStyle: React.CSSProperties = {
    color: '#c7c7cc',
    fontSize: '18px'
  }

  const handleItemClick = (item: T) => {
    if (onItemClick) {
      onItemClick(item)
    }
  }

  const handleItemHover = (e: React.MouseEvent<HTMLDivElement>) => {
    ;(e.currentTarget as HTMLDivElement).style.backgroundColor = '#f0f0f0'
  }

  const handleItemLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    ;(e.currentTarget as HTMLDivElement).style.backgroundColor = 'white'
  }

  return (
    <div style={listStyle}>
      {items.map((item, index) => {
        const row = createRow(item)
        return (
          <div
            key={row.id}
            style={index === items.length - 1 ? lastItemStyle : itemStyle}
            onClick={() => handleItemClick(item)}
            onMouseEnter={handleItemHover}
            onMouseLeave={handleItemLeave}
          >
            <div style={leftContentStyle}>
              {row.leadingImage && <GlossyImage src={row.leadingImage} alt={row.title} style={leadingImageStyle} />}
              <div>
                <div style={titleStyle}>{row.title}</div>
                {row.subtitle && <div style={subtitleStyle}>{row.subtitle}</div>}
              </div>
            </div>
            <div style={rightContentStyle}>
              {row.rightText && <span>{row.rightText}</span>}
              {row.showArrow && <span style={arrowStyle}>›</span>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
