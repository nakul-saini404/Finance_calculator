import { Box, Slider, TextField, Typography, InputAdornment } from '@mui/material';

export function DualSlider({
  label, value, onChange,
  min, max, step = 1,
  prefix, suffix, displayValue,
  sliderColor = '#34d399',
}) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography sx={{ fontSize: 11.5, fontWeight: 500, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {label}
        </Typography>
        <Box sx={{ background: '#1a1d2e', px: 1.25, py: 0.25, borderRadius: 1.5 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: 'text.primary' }}>
            {displayValue ?? value}
          </Typography>
        </Box>
      </Box>

      <TextField
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        size="small"
        fullWidth
        InputProps={{
          startAdornment: prefix ? <InputAdornment position="start"><Typography sx={{ color: 'text.disabled', fontSize: 14, fontWeight: 500 }}>{prefix}</Typography></InputAdornment> : undefined,
          endAdornment:   suffix ? <InputAdornment position="end"><Typography sx={{ color: 'text.disabled', fontSize: 12 }}>{suffix}</Typography></InputAdornment> : undefined,
          inputProps: { min, max, step, style: { MozAppearance: 'textfield' } },
        }}
        sx={{ mb: 0.5 }}
      />

      <Slider
        value={typeof value === 'number' ? value : 0}
        onChange={(_, v) => onChange(v)}
        min={min} max={max} step={step}
        sx={{ color: sliderColor, '& .MuiSlider-thumb': { border: `2.5px solid #09090f` } }}
      />
    </Box>
  );
}