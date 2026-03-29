const HUB_URL = '/';

export default function HubNavbar() {
    return (
        <div style={styles.bar}>
            <a href={HUB_URL} style={styles.logo}>
                <div style={styles.logoIcon}>⚒</div>
                <span style={styles.logoText}>ForgeCodeHub</span>
            </a>
            <span style={styles.divider}>/</span>
            <span style={styles.current}>Financial Calculators</span>
            <a href={HUB_URL} style={styles.backBtn}>← All Tools</a>
        </div>
    );
}

const styles = {
    bar: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 24px',
        background: '#0a0a0b',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        fontFamily: 'inherit',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        textDecoration: 'none',
    },
    logoIcon: {
        width: '24px', height: '24px',
        background: 'linear-gradient(135deg, #e8692a, #f5a623)',
        borderRadius: '6px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '12px',
    },
    logoText: {
        fontFamily: 'sans-serif',
        fontWeight: '700',
        fontSize: '14px',
        color: '#f0ede8',
        letterSpacing: '-0.02em',
    },
    divider: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: '13px',
    },
    current: {
        color: '#7a7875',
        fontSize: '13px',
        flex: 1,
    },
    backBtn: {
        color: '#e8692a',
        fontSize: '12px',
        textDecoration: 'none',
        fontWeight: '500',
        padding: '4px 10px',
        border: '1px solid rgba(232,105,42,0.3)',
        borderRadius: '6px',
        transition: 'all 0.2s',
    },
};