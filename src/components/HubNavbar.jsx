const HUB_URL = import.meta.env.VITE_BASE_URL
    ? import.meta.env.VITE_BASE_URL.replace('/calculators', '')
    : 'https://forgecodehub.com';

export default function HubNavbar() {
    return (
        <a href={HUB_URL} style={styles.bar}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7L9 12" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={styles.logo}>⚒</span>
            <span style={styles.text}>
                ForgeCodeHub <span style={styles.sep}>/</span> FinVault
            </span>
        </a>
    );
}

const styles = {
    bar: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 20px',
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none',
        color: '#7a7875',
        fontSize: '12px',
        fontWeight: 500,
        letterSpacing: '0.02em',
        transition: 'background 0.2s, color 0.2s',
        fontFamily: 'inherit',
    },
    logo: { fontSize: '13px' },
    text: { color: '#7a7875' },
    sep: { margin: '0 4px', opacity: 0.4 },
};