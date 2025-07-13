import React from 'react';

interface GlossyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
}

export default function GlossyImage({ 
  src, 
  alt, 
  width = '60px', 
  height = '60px', 
  borderRadius = '12px',
  style,
  ...props 
}: GlossyImageProps) {
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: width,
    height: height,
    borderRadius: borderRadius,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.25)',
    ...style,
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  // White circle positioned with bottom at center, clipped by container
  const glossCircleStyle: React.CSSProperties = {
    position: 'absolute',
    width: '120%',
    height: '120%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    top: '-60%',
    left: '50%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle}>
      <img 
        src={src} 
        alt={alt} 
        style={imageStyle}
        {...props}
      />
      <div style={glossCircleStyle} />
    </div>
  );
}
