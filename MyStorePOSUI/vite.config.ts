import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

export default defineConfig({
  plugins: [
    react(),
    basicSsl() // This creates the dev certificate
  ],
  server: {
    https: true as any,     // Force HTTPS
    port: 5173,      // Your preferred port
    strictPort: true, // Prevents jumping to 5174
    proxy: {
      '/api': {
        target: 'https://localhost:7063', // Your backend
        changeOrigin: true,
        secure: false, // This tells Vite to ignore the backend's self-signed cert
      },
    },
  }
})
