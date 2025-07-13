interface PageIntroductionProps {
    title: string;
    subtitle?: string;
    leadingImage?: string;
}   

export default function PageIntroduction({ title, subtitle, leadingImage }: PageIntroductionProps) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            {leadingImage && <img src={leadingImage} alt="logo" style={{ width: '50px', height: '50px' }} />}
            <div style={{ textAlign: 'left' }}>
                <h1 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h1>
                {subtitle && <p style={{ fontSize: '1rem', margin: '4px 0 0 0', color: '#666' }}>{subtitle}</p>}
            </div>
        </div>
    )
}