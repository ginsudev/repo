import React from 'react'

interface ImageCarouselProps {
  images: string[]
  alt?: string
}

const containerStyles: React.CSSProperties = {
  display: 'flex',
  gap: '1rem',
  overflowX: 'auto',
  scrollBehavior: 'smooth',
  scrollbarWidth: 'thin',
  scrollbarColor: '#999 #f0f0f0'
}

const itemStyles: React.CSSProperties = {
  flex: '0 0 auto',
  height: '350px',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const imageStyles: React.CSSProperties = {
  maxWidth: '100%',
  height: '100%',
  objectFit: 'contain'
}

export default function ImageCarousel({ images, alt = 'Screenshot' }: ImageCarouselProps) {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div style={containerStyles}>
      {images.map((image, index) => (
        <div key={index} style={itemStyles}>
          <img src={image} alt={`${alt} ${index + 1}`} style={imageStyles} loading='lazy' />
        </div>
      ))}
    </div>
  )
}
