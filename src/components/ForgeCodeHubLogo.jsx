
export default function ForgeCodeHubLogo() {
    return (
        <a href="https://forgecodehub.com" style={styles.logo}>
            <div style={styles.iconBox}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <rect x="2" y="3" width="9" height="5" rx="1.5" fill="#0a0a0b" />
                    <rect x="8" y="5.5" width="3" height="9" rx="1.5" transform="rotate(38 9 9)" fill="#0a0a0b" />
                    <circle cx="4" cy="14" r="1" fill="white" opacity="0.7" />
                    <circle cx="7" cy="15.5" r="0.7" fill="white" opacity="0.5" />
                </svg>
            </div>
            <div style={styles.name}>
                Forge<span style={styles.accent}>Code</span>Hub
            </div>
        </a>
    );
}

const styles = {
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        padding: '4px 0',
    },
    iconBox: {
        width: '32px',
        height: '32px',
        background: 'linear-gradient(135deg, #e8692a, #f5a623)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    name: {
        fontFamily: 'Georgia, serif',
        fontSize: '17px',
        fontWeight: '700',
        color: '#f0ede8',
        letterSpacing: '-0.03em',
        lineHeight: 1,
    },
    accent: {
        color: '#e8692a',
    },
};