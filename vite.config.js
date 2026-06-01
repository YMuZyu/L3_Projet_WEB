import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Rend le serveur Vite accessible depuis d'autres machines du réseau (pas seulement localhost)
    host: true,

    proxy: {
      // Toutes les requêtes fetch du frontend qui commencent par ces chemins
      // sont redirigées automatiquement vers le serveur Express (port 10000).
      // Grâce à ça, les autres PC du réseau n'ont besoin d'accéder qu'au
      // serveur Vite (port 5173) : c'est lui qui fait le relais vers Express.
      //
      // Exemple pour les images de posts :
      //   Le frontend fait fetch('/posts') → Vite redirige vers http://localhost:10000/posts
      //   L'image est stockée à /uploads/photo.jpg sur le serveur Express.
      //   Le frontend affiche <img src="/uploads/photo.jpg"> → Vite sert le fichier via Express.
      //   Un autre PC qui accède à http://192.168.x.x:5173 voit l'image correctement,
      //   car c'est Vite (sur le bon PC) qui va chercher le fichier, pas le navigateur distant.

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
