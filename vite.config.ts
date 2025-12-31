
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // This allows the build process to inject the API_KEY from Vercel's environment variables
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});
