import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    tailwindcss()
  ],
  server: {
    host: true, // <-- This exposes the dev server on your network
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Your Spring Boot server
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
