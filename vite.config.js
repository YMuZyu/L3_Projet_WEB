import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige les appels API vers le serveur Express (port 10000)
      // comme ça les URLs dans le code n'ont pas besoin de "http://localhost:10000"
      '/uploads':       { target: 'http://localhost:10000', changeOrigin: true },
      '/posts':         { target: 'http://localhost:10000', changeOrigin: true },
      '/user':          { target: 'http://localhost:10000', changeOrigin: true },
      '/admin':         { target: 'http://localhost:10000', changeOrigin: true },
      '/messages':      { target: 'http://localhost:10000', changeOrigin: true },
      '/notifications': { target: 'http://localhost:10000', changeOrigin: true },
      '/connexion':     { target: 'http://localhost:10000', changeOrigin: true },
    }
  }
})
