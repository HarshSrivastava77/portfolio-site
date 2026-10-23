import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' lets the same build run on GitHub Pages, Netlify or Vercel.
export default defineConfig({ plugins: [react()], base: './' });
