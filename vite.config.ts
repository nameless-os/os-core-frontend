import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    target: 'esnext',
  },
  resolve: {
    alias: {
      '@Components': path.resolve(__dirname, 'src/components'),
      '@Constants': path.resolve(__dirname, 'src/constants'),
      '@Pages': path.resolve(__dirname, 'src/pages'),
      '@Interfaces': path.resolve(__dirname, 'src/interfaces'),
      '@Types': path.resolve(__dirname, 'src/types'),
      '@Enums': path.resolve(__dirname, 'src/enums'),
      '@Features': path.resolve(__dirname, 'src/features'),
      '@Hooks': path.resolve(__dirname, 'src/hooks'),
      '@Backgrounds': path.resolve(__dirname, 'src/assets/images/backgrounds'),
      '@Icons': path.resolve(__dirname, 'src/assets/images/icons'),
      '@Sounds': path.resolve(__dirname, 'src/assets/sounds'),
      '@Apps': path.resolve(__dirname, 'src/apps'),
      '@Chat': path.resolve(__dirname, 'src/apps/chat'),
      '@Calculator': path.resolve(__dirname, 'src/apps/calculator'),
      '@Minesweeper': path.resolve(__dirname, 'src/apps/minesweeper'),
      '@ToDo': path.resolve(__dirname, 'src/apps/toDo'),
      '@Translate': path.resolve(__dirname, 'src/apps/translate'),
      '@Simon': path.resolve(__dirname, 'src/apps/simon'),
      '@Settings': path.resolve(__dirname, 'src/apps/settings'),
      '@BullsAndCows': path.resolve(__dirname, 'src/apps/bullsAndCows'),
      '@Assets': path.resolve(__dirname, 'src/assets'),
    },
  },
});