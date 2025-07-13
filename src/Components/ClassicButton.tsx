interface ClassicButtonProps {
  title: string
  onClick: () => void
}

export default function ClassicButton({ title, onClick }: ClassicButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        color: '#4a90e2',
        fontSize: '1rem',
        padding: '0.5rem 1rem',
        background: 'linear-gradient(to bottom, #ffffff, #f0f0f0)',
        border: '1px solid #ddd',
        borderRadius: '4px',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'linear-gradient(to bottom, #f0f0f0, #e8e8e8)'
        e.currentTarget.style.boxShadow = 'inset 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'linear-gradient(to bottom, #ffffff, #f0f0f0)'
        e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.8), 0 1px 3px rgba(0,0,0,0.1)'
      }}
    >
      {title}
    </button>
  )
}
