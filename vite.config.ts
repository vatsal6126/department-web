import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  // Tells Vite your site lives inside the repository subfolder
  base: '/ldce-chem-dept/',
  plugins: [react(), tailwindcss(), viteSingleFile()],
});