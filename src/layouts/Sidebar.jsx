import { Box, Typography } from '@mui/material';
import { NAV_ITEMS } from '../constants/constants';
import { useNavigate } from "react-router-dom";
import ForgeCodeHubLogo from '../components/ForgeCodeHubLogo';


const SIDEBAR_W = 240;

export function Sidebar({ activePage }) {
  const navigate = useNavigate();
  return (
    <Box sx={{
      width: SIDEBAR_W, minHeight: '100vh',
      background: '#0f1018',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, pt: 3, pb: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          {/* <Box sx={{
            width: 36, height: 36, borderRadius: 2.5, flexShrink: 0,
            background: 'linear-gradient(135deg, #34d399, #60a5fa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>💰</Box> */}
          {/* <Typography sx={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Financial <span style={{ color: '#34d399' }}>Calculators</span>
          </Typography> */}
          <ForgeCodeHubLogo />
        </Box>
        <Typography sx={{ fontSize: 10, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1.5px', mt: 0.625 }}>
          Financial Calculators
        </Typography>
      </Box>

      {/* Nav */}
      <Box sx={{ px: 1.25, py: 1.75, flex: 1, overflowY: 'auto' }}>
        {NAV_ITEMS.map((group) => (
          <Box key={group.group}>
            <Typography sx={{ fontSize: 9.5, fontWeight: 600, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: '1.8px', px: 1.25, py: 0.625, mt: group.group !== 'Overview' ? 0.75 : 0 }}>
              {group.group}
            </Typography>
            {group.items.map((item) => {
              const isActive = activePage === item.id;
              return (
                <Box
                  key={item.id}
                  onClick={() => navigate(`/${item.id}`)}

                  sx={{
                    display: 'flex', alignItems: 'center', gap: 1.25,
                    px: 1.5, py: 1.125, borderRadius: 2.25, cursor: 'pointer',
                    color: isActive ? 'text.primary' : 'text.secondary',
                    fontWeight: isActive ? 500 : 400,
                    fontSize: 13.5, mb: 0.25, position: 'relative',
                    transition: 'all .15s',
                    userSelect: 'none',
                    '&:hover': { background: '#141520', color: 'text.primary' },
                  }}
                >
                  {/* Active accent bar */}
                  <Box sx={{
                    position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                    width: 3, height: isActive ? 20 : 0, borderRadius: '0 3px 3px 0',
                    background: item.accent, transition: 'height .2s ease',
                  }} />

                  {/* Icon */}
                  <Box sx={{
                    width: 30, height: 30, borderRadius: 2,
                    background: isActive ? item.iconBg : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14, flexShrink: 0, transition: 'background .15s',
                  }}>
                    {item.icon}
                  </Box>

                  <Typography sx={{ flex: 1, fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
                    {item.label}
                  </Typography>

                  {item.hot && (
                    <Box sx={{ fontSize: 10, px: 0.75, py: 0.125, borderRadius: 2, background: 'rgba(251,191,36,0.12)', color: '#fbbf24', fontWeight: 700 }}>
                      {item.hot}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{ px: 1.25, py: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
        <Box
          // onClick={() => onNavigate('home')}
          onClick={() => navigate('/')}
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            px: 1.5, py: 1.125, borderRadius: 2.25, cursor: 'pointer',
            color: 'text.disabled', fontSize: 12.5, transition: 'all .15s',
            '&:hover': { background: '#141520', color: 'text.secondary' },
          }}
        >
          ← Back to Dashboard
        </Box>
      </Box>
    </Box>
  );
}

