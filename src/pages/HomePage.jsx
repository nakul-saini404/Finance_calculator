import { Box, Typography } from '@mui/material';
import { HOME_CARDS } from '../constants/constants';

export function HomePage({ onNavigate }) {
  return (
    <Box sx={{ p: '30px 28px', overflowY: 'auto', height: 'calc(100vh - 56px)' }}>
      {/* Hero */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h1" sx={{ fontSize: 32, mb: 1, lineHeight: 1.2 }}>
          Smart{' '}
          <Box component="span" sx={{ background: 'linear-gradient(90deg, #34d399, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Financial
          </Box>
          <br />Calculators
        </Typography>
        <Typography sx={{ color: 'text.secondary', fontSize: 14, lineHeight: 1.7 }}>
          Plan loans, taxes, investments & GST in seconds. No sign-up. No guesswork. Just accurate numbers.
        </Typography>
      </Box>

      {/* Cards Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.75 }}>
        {HOME_CARDS.map((card) => (
          <Box
            key={card.id}
            onClick={() => onNavigate(card.id)}
            sx={{
              background: '#0f1018', border: `1px solid ${card.borderColor}`,
              borderRadius: 4, p: 2.75, cursor: 'pointer', position: 'relative',
              overflow: 'hidden', transition: 'transform .2s ease',
              '&:hover': { transform: 'translateY(-3px)' },
              '&:hover .card-arrow': { transform: 'translateX(3px)' },
            }}
          >
            {/* Top glow line */}
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${card.accentColor}, transparent)` }} />

            <Box sx={{ width: 46, height: 46, borderRadius: 3, background: card.tagBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, mb: 1.75 }}>
              {card.icon}
            </Box>

            <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 15.5, fontWeight: 700, mb: 0.75 }}>
              {card.title}
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.65 }}>
              {card.desc}
            </Typography>

            <Box sx={{ display: 'inline-block', fontSize: 9.5, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', px: 1, py: 0.375, borderRadius: 2, mt: 1.25, background: card.tagBg, color: card.tagColor }}>
              {card.tag}
            </Box>

            <Typography className="card-arrow" sx={{ position: 'absolute', right: 18, bottom: 18, fontSize: 16, color: card.accentColor, transition: 'transform .2s' }}>
              →
            </Typography>
          </Box>
        ))}

        {/* Coming soon card */}
        <Box sx={{ background: 'repeating-linear-gradient(45deg, #0f1018, #0f1018 10px, #141520 10px, #141520 20px)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 4, p: 2.75, opacity: 0.4, cursor: 'default', position: 'relative' }}>
          <Box sx={{ width: 46, height: 46, borderRadius: 3, background: '#1a1d2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, mb: 1.75 }}>⏳</Box>
          <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 15.5, fontWeight: 700, mb: 0.75 }}>More Coming Soon</Typography>
          <Typography sx={{ fontSize: 12.5, color: 'text.secondary', lineHeight: 1.65 }}>PPF, FD, NPS, HRA, Compound Interest & more launching soon.</Typography>
          <Box sx={{ display: 'inline-block', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', px: 1, py: 0.375, borderRadius: 2, mt: 1.25, background: '#1a1d2e', color: '#4e5168' }}>Soon</Box>
        </Box>
      </Box>
    </Box>
  );
}
