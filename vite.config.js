import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/calculators/',
  server: {
    port: 5173,
    cors: true,
    allowedHosts: ['localhost'],
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
