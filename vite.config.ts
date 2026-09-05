import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  // GitHub Pages serves this project from its repository subfolder.
  base: '/department-web/',
  plugins: [react(), tailwindcss(), viteSingleFile()],
});